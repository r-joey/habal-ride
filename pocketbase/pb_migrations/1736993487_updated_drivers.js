/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3468036041",
    "max": null,
    "min": null,
    "name": "rating",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3468036041",
    "max": null,
    "min": null,
    "name": "ratings",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
