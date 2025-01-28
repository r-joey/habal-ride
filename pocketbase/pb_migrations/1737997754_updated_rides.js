/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_qArtBj3rm2` ON `rides` (`driver`)",
      "CREATE INDEX `idx_wPBBW6dQHF` ON `rides` (`rider`)",
      "CREATE INDEX `idx_15zThdexpY` ON `rides` (`status`)",
      "CREATE INDEX `idx_lGDbIQelFt` ON `rides` (`pick_up_lat`)",
      "CREATE INDEX `idx_j3ucYWyM6E` ON `rides` (`pick_up_lng`)",
      "CREATE INDEX `idx_0E0IKg680s` ON `rides` (`drop_off_lat`)",
      "CREATE INDEX `idx_Ll3Fx0f8mU` ON `rides` (`drop_off_lng`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
