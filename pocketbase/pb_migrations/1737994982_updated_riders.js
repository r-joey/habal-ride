/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authRule": "@request.auth.verified = true ",
    "deleteRule": "id = @request.auth.id && @request.auth.verified = true ",
    "listRule": null,
    "updateRule": "id = @request.auth.id && @request.auth.verified = true ",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "authRule": "",
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
