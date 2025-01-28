/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2329123692")

  // update collection data
  unmarshal({
    "name": "vehicles"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2329123692")

  // update collection data
  unmarshal({
    "name": "vehicle"
  }, collection)

  return app.save(collection)
})
