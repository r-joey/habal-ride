/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // remove field
  collection.fields.removeById("number3920950366")

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3920950366",
    "max": 0,
    "min": 0,
    "name": "mobile_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number3920950366",
    "max": null,
    "min": null,
    "name": "mobile_number",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("text3920950366")

  return app.save(collection)
})
