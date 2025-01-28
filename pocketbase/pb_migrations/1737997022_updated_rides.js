/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2392944706",
    "max": null,
    "min": 0,
    "name": "amount",
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
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2392944706",
    "max": null,
    "min": 0,
    "name": "amount",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
