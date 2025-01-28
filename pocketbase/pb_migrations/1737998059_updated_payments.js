/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"drivers\"",
    "deleteRule": "@request.auth.id = driver",
    "indexes": [
      "CREATE INDEX `idx_JNurrvdwyg` ON `payments` (\n  `driver`,\n  `verified`\n)"
    ],
    "listRule": "@request.auth.collectionName = \"drivers\"",
    "updateRule": "@request.auth.id = driver",
    "viewRule": "@request.auth.collectionName = \"drivers\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "indexes": [],
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
