/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.subscription_expiry > @todayEnd",
    "viewRule": "@request.auth.subscription_expiry > @todayEnd"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.subscription_expiry > @yesterday",
    "viewRule": "@request.auth.subscription_expiry > @yesterday"
  }, collection)

  return app.save(collection)
})
