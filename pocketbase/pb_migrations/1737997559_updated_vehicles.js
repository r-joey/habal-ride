/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1602236899")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"drivers\"",
    "deleteRule": "@request.auth.id = driver",
    "listRule": null,
    "updateRule": "@request.auth.id = driver",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1602236899")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
