/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
