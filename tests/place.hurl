# Create a new user
POST http://localhost:3000/auth/register
Content-Type: application/json
{
  "name": "mega_admin",
  "username": "megaadmin",
  "email": "megaadmin@example.com",
  "avatarURL": "",
  "password": "megaadmin123"
}
HTTP 201
[Captures]
user_id: jsonpath "$.user.id"

# Login user
POST http://localhost:3000/auth/login
Content-Type: application/json
{
  "identifier": "megaadmin",
  "password": "megaadmin123"
}
HTTP 200
[Captures]
jwt_token: jsonpath "$.token"

# Create a new place
POST http://localhost:3000/places
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
{
  "name": "test",
  "description": "testing",
  "priceMin": 50000,
  "priceMax": 1000000,
  "city": "depok",
  "address": "jalan margonda rawan begal",
  "latitude": 0.934,
  "longitude": 1
}
HTTP 201
[Captures]
place_id: jsonpath "$.place.id"
place_slug: jsonpath "$.place.slug"
city_id: jsonpath "$.place.cityId"
created_at: jsonpath "$.place.createdAt"
updated_at: jsonpath "$.place.updatedAt"

    # Create a new place with invalid input
    POST http://localhost:3000/places
    Authorization: Bearer {{jwt_token}}
    Content-Type: application/json
    {
      "name": 22222,
      "description": 432413,
      "priceMin": "test",
      "priceMax": 1000000,
      "city": "depok",
      "address": "jalan margonda rawan begal",
      "latitude": 0.934,
      "longitude": 1
    }
    HTTP 400

    # Create a new place without token
    POST http://localhost:3000/places
    Content-Type: application/json
    {
      "name": "test2",
      "description": "testing2",
      "priceMin": 50000,
      "priceMax": 1000000,
      "city": "depok",
      "address": "jalan margonda rawan begal",
      "latitude": 0.934,
      "longitude": 1
    }
    HTTP 401

    # Re-create the same place
    POST http://localhost:3000/places
    Authorization: Bearer {{jwt_token}}
    Content-Type: application/json
    {
      "name": "test",
      "description": "testing",
      "priceMin": 50000,
      "priceMax": 1000000,
      "city": "depok",
      "address": "jalan margonda rawan begal",
      "latitude": 0.934,
      "longitude": 1
    }
    HTTP 500

# Get all places
GET http://localhost:3000/places
HTTP 200
{"count":1,"places":[{"id":"{{place_id}}","slug":"{{place_slug}}","name":"test","description":"testing","priceMin":"50000","priceMax":"1000000","cityId":"{{city_id}}","address":"jalan margonda rawan begal","latitude":0.934,"longitude":1,"userId":"{{user_id}}","createdAt":"{{created_at}}","updatedAt":"{{updated_at}}","images":[]}]}

# Get a place by id
GET http://localhost:3000/places/{{place_id}}
HTTP 200
{"id":"{{place_id}}","slug":"{{place_slug}}","name":"test","description":"testing","priceMin":"50000","priceMax":"1000000","cityId":"{{city_id}}","address":"jalan margonda rawan begal","latitude":0.934,"longitude":1,"userId":"{{user_id}}","createdAt":"{{created_at}}","updatedAt":"{{updated_at}}","menuItems":[]}

# Get a place by slug
GET http://localhost:3000/places/{{place_slug}}
HTTP 200

    # Get a place by invalid slug
    GET http://localhost:3000/places/invalid-slug
    HTTP 404
    [Asserts]
    jsonpath "$.message" == "Place not found"

# Update a place
PATCH http://localhost:3000/places/{{place_id}}
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
{
  "name": "updated",
  "description": "testing",
  "priceMin": 50000,
  "priceMax": 1000000,
  "city": "depok",
  "address": "jalan margonda rawan begal",
  "latitude": 0.934,
  "longitude": 1
}
HTTP 200
[Captures]
updated_name: jsonpath "$.place.name"
updated_at: jsonpath "$.place.updatedAt"

# Get place with updated name
GET http://localhost:3000/places/{{place_id}}
HTTP 200
{"id":"{{place_id}}","slug":"{{place_slug}}","name":"{{updated_name}}","description":"testing","priceMin":"50000","priceMax":"1000000","cityId":"{{city_id}}","address":"jalan margonda rawan begal","latitude":0.934,"longitude":1,"userId":"{{user_id}}","createdAt":"{{created_at}}","updatedAt":"{{updated_at}}","menuItems":[]}

# Delete a place
DELETE http://localhost:3000/places/{{place_id}}
Authorization: Bearer {{jwt_token}}
HTTP 200