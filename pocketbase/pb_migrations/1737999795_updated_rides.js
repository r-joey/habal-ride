/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.subscriptions_via_driver.expiry > @todayEnd || @request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.subscription_expiry > @todayEnd || @request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
