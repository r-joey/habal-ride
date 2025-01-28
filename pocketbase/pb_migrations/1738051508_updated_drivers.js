/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "file177404655",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf"
    ],
    "name": "drivers_license",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1031832422")

  // remove field
  collection.fields.removeById("file177404655")

  return app.save(collection)
})
