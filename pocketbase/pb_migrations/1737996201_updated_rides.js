/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = rider || @request.auth.id = driver"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3157269344")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = rider"
  }, collection)

  return app.save(collection)
})
