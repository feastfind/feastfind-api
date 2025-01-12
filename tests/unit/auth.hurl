# Register a user
POST http://localhost:3000/auth/register
Content-Type: application/json
{
  "name": "testing123",
  "username": "testing123",
  "email": "testing123@testing.com",
  "password": "testing123"
}
HTTP 201

# Login user with username
POST http://localhost:3000/auth/login
Content-Type: application/json
{
  "identifier": "testing123",
  "password": "testing123"
}
HTTP 200

# Login user with email
POST http://localhost:3000/auth/login
Content-Type: application/json
{
  "identifier": "testing123@testing.com",
  "password": "testing123"
}
HTTP 200
[Captures]
jwt_token: jsonpath "$.token"

# Get authenticated user information
GET http://localhost:3000/auth/me
Authorization: Bearer {{jwt_token}}
HTTP 200