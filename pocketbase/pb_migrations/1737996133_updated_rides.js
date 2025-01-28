/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = rider",
    "updateRule": "@request.auth.id = rider"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = id",
    "updateRule": ""
  }, collection)

  return app.save(collection)
})
