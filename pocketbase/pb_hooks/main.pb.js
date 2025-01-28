onRecordCreate((e) => {  
    const rider = e.record.get('rider')
    let totalPending = $app.countRecords("rides", $dbx.hashExp({"status": ["requesting", "in_progress"], "rider": rider}) )
    if (!totalPending) { 
        e.next()
    } else {
        throw new Error(`user ${user_id} is attempting to create a new ride but has an uncompleted ride.`)
    }
}, "rides")

// hook for setting verified payment to false upon creating 
onRecordCreate((e) => { 
    try {
        e.record.set("verified", false) 
        e.next()
        
    } catch (error) {
        $app.logger().error(error)
    }
 }, "payments")

// hook for creating a subscription for every driver
onRecordAfterCreateSuccess((e) => { 
    try {
        // create a subscription
        let trialDays = 15
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + trialDays)
        let collection = $app.findCollectionByNameOrId("subscriptions") 
        let subscription = new Record(collection) 
        subscription.set("driver", e.record.id)
        subscription.set("expiry", expiryDate)
        subscription.set("rating", 0)
        subscription.set("trips", 0)
        $app.save(subscription);
    } catch (err) { 
        $app.logger().error(`Upon creating a driver, an error was encountered while creating a subscription. ${err}`)
    } 
    e.next()
},"drivers")

// to be removed later as I need to secure that every user is verified.
onRecordCreate((e) => { 
   e.record.setVerified(true) 
    e.next()
}, "riders", "drivers")

// hood for deleting other offers of the driver
onRecordAfterUpdateSuccess((e) => {
    const driverID = e.record.get("driver")
    const status = e.record.get("status")
    if (status === "in_progress" && driverID) {
        try {
            let otherOffers = $app.findRecordsByFilter(
                "offers",   
                `driver = '${driverID}'`
            )
            if (otherOffers.length > 0) {
                otherOffers.forEach(offer => {
                    $app.delete(offer) 
                })
            }
        } catch (_) {
            $app.logger().info("no other offers found")
        }
       
    }
    e.next()
}, "rides")

onRecordAfterUpdateSuccess((e) => {
    try {
        let subscription = $app.findFirstRecordByFilter(
            "subscriptions",
            `driver = '${e.record.get("driver")}'`
        )
        if (subscription) {
            let currentExpiry = new Date(subscription.get("expiry"));
            let now = new Date();
            let newExpiryDate;

            if (currentExpiry < now) {
                // If the expiry has already expired, start from today
                newExpiryDate = new Date(now.setDate(now.getDate() + 15));
            } else {
                // If not expired, add 15 days to the existing expiry
                newExpiryDate = new Date(currentExpiry.setDate(currentExpiry.getDate() + 15));
            }
             
            subscription.set("expiry", newExpiryDate.toISOString() )
            $app.save(subscription);
        }
    } catch (err) {
        $app.logger().info(`Upon updating a payment, an error was encountered ${err}`)
    }
    e.next()
}, "payments")

// cron job to clean up expired rides
cronAdd(`rideCleaner`, "*/1 * * * *", () => {
    $app.logger().info("Checking for expired rides...")
    const result = arrayOf(new DynamicModel({
        "id":    "",
        "expires_at": "",
        "status": ""
    }))
    const now = new Date().toISOString()
    $app.db()
    .select("id", "expires_at", "status")
    .from("rides")
    .where($dbx.exp("expires_at < datetime({:now})", { now: now }))
    .andWhere($dbx.exp("status = 'requesting'"))
    .limit(100)
    .orderBy("created ASC")
    .all(result) 

    result.forEach(ride => { 
        $app.logger().debug(`now: ${now}, ID ${ride.id}, and status: ${ride.status}, expires_at: ${ride.expires_at}`) 

        let record = $app.findRecordById("rides", ride.id)
        if (record) {
            $app.logger().debug(`deleting record with ID ${record.id}`)
            $app.delete(record)
        }
    })
})