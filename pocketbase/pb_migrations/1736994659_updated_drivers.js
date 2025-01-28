/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "json461431942",
    "maxSize": 0,
    "name": "vehicle",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // remove field
  collection.fields.removeById("json461431942")

  return app.save(collection)
})
