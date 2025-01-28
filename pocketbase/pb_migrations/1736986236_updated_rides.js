/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3176414797",
    "max": null,
    "min": null,
    "name": "pick_up_lng",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2238399305",
    "max": null,
    "min": null,
    "name": "drop_off_lng",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3176414797",
    "max": null,
    "min": null,
    "name": "pick_up_lon",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2238399305",
    "max": null,
    "min": null,
    "name": "drop_off_lon",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
