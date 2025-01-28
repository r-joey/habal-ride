/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = driver",
    "updateRule": null,
    "viewRule": "@request.auth.id = driver"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.collectionName = \"drivers\"",
    "updateRule": "@request.auth.id = driver",
    "viewRule": "@request.auth.collectionName = \"drivers\""
  }, collection)

  return app.save(collection)
})
