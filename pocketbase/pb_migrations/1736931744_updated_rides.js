/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // remove field
  collection.fields.removeById("json166181210")

  // remove field
  collection.fields.removeById("json228030159")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3736464057",
    "max": null,
    "min": null,
    "name": "pick_up_lat",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
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

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3867842493",
    "max": null,
    "min": null,
    "name": "drop_off_lat",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json166181210",
    "maxSize": 0,
    "name": "pick_up",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json228030159",
    "maxSize": 0,
    "name": "drop_off",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("number3736464057")

  // remove field
  collection.fields.removeById("number3176414797")

  // remove field
  collection.fields.removeById("number3867842493")

  // remove field
  collection.fields.removeById("number2238399305")

  return app.save(collection)
})
