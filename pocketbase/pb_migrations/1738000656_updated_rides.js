/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.subscriptions_via_driver.expiry > @todayEnd || (@request.auth.collectionName = \"riders\" && @request.auth.id = rider)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.subscriptions_via_driver.expiry > @todayEnd"
  }, collection)

  return app.save(collection)
})
