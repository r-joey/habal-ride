/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3980638064")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = driver",
    "listRule": "@request.auth.id = driver",
    "viewRule": "@request.auth.id = driver"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3980638064")

  // update collection data
  unmarshal({
    "deleteRule": null,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
