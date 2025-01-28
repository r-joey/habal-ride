/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "date4047900188",
    "max": "",
    "min": "",
    "name": "subscription_expiry",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // remove field
  collection.fields.removeById("date4047900188")

  return app.save(collection)
})
