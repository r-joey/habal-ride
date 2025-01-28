/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3981801833")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_a6M7pvSnJs` ON `offers` (\n  `ride`,\n  `driver`\n)",
      "CREATE INDEX `idx_yUGqHafgVC` ON `offers` (`ride`)",
      "CREATE INDEX `idx_XD5M7UKVSN` ON `offers` (`driver`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3981801833")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_a6M7pvSnJs` ON `offers` (\n  `ride`,\n  `driver`\n)"
    ]
  }, collection)

  return app.save(collection)
})
