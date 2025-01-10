# Get all cities
GET http://localhost:3000/cities
HTTP 200

# Get a city by slug
GET http://localhost:3000/cities/depok
HTTP 200
[Captures]
city_id: jsonpath "$.id"

# Get a city by id
GET http://localhost:3000/cities/{{city_id}}
HTTP 200