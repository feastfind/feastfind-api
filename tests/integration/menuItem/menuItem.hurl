# Create a new user
POST http://localhost:3000/auth/register
Content-Type: application/json
{
  "name": "mega_admin",
  "username": "megaadmin2",
  "email": "megaadmin2@example.com",
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
  "identifier": "megaadmin2",
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
  "name": "test2",
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
place_slug: jsonpath "$.place.slug"

# Get all menu items
GET http://localhost:3000/menu-items
HTTP 200

# Create a menu item
POST http://localhost:3000/menu-items
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
{
  "name": "test",
  "price": 1,
  "description": "test",
  "images": [
    {
      "url": "http://dicebear.com/random"
    }
  ],
  "placeSlug": "{{place_slug}}"
}
HTTP 201
[Captures]
menu_item_slug: jsonpath "$.menuItem.slug"
menu_item_id: jsonpath "$.menuItem.id"

# Get a menu item by slug
GET http://localhost:3000/menu-items/{{menu_item_slug}}
HTTP 200

# Get a menu item by id
GET http://localhost:3000/menu-items/{{menu_item_id}}
HTTP 200

# Update a menu item by slug
PATCH http://localhost:3000/menu-items/{{menu_item_slug}}
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
{
  "name": "updated"
}
HTTP 200

# Delete a menu item by slug
DELETE http://localhost:3000/menu-items/{{menu_item_slug}}
Authorization: Bearer {{jwt_token}}
HTTP 200
