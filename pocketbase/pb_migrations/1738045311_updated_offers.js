/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3981801833")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"drivers\" && @request.auth.subscriptions_via_driver.expiry >= @todayEnd"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3981801833")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"drivers\""
  }, collection)

  return app.save(collection)
})
