/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"riders\"",
    "deleteRule": "@request.auth.id = rider",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_u9MqI8RQTW` ON `reviews` (\n  `ride`,\n  `rider`\n)",
      "CREATE INDEX `idx_AV3I6urO2q` ON `reviews` (`ride`)",
      "CREATE INDEX `idx_TbqQYSnIb5` ON `reviews` (`rider`)"
    ],
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = rider",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_u9MqI8RQTW` ON `reviews` (\n  `ride`,\n  `rider`\n)"
    ],
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
