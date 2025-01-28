/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3176414797",
    "max": 180,
    "min": -182,
    "name": "pick_up_lng",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2238399305",
    "max": 180,
    "min": -180,
    "name": "drop_off_lng",
    "onlyInt": false,
    "presentable": false,
    "required": true,
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
    "max": 90,
    "min": -90,
    "name": "pick_up_lng",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2238399305",
    "max": 90,
    "min": -90,
    "name": "drop_off_lng",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
