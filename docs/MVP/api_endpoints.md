# Firefly Tracker App - MVP API Endpoints

All endpoints are implemented as Supabase Edge Functions and require authentication (except /ping, /db-test).

## Base URL
`https://your-project.supabase.co/functions/v1`

## Authentication
All protected endpoints require a valid Supabase JWT in the Authorization header:
```
Authorization: Bearer <JWT>
```

## Endpoints

### GET /ping
- **Description**: Health check endpoint
- **Auth Required**: No
- **Response**: `{ "message": "pong" }`

### GET /db-test
- **Description**: Database connectivity test
- **Auth Required**: No
- **Response**: 
  - Success: `{ "success": true, "sightingsCount": 3, "neighborhoodsCount": 2 }`
  - Error: `{ "success": false, "error": "error message" }`

### POST /sightings
- **Description**: Create a new sighting
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "sighting_date": "YYYY-MM-DD",
    "sighting_time": "HH:MM[:SS]",
    "firefly_count": 5,
    "weather_conditions": "Clear",
    "location_lat": 35.12345678,
    "location_lng": -80.12345678,
    "notes": "Optional notes",
    "photo_url": "https://..."
  }
  ```
- **Response**: Created sighting object with generated ID and metadata

### GET /sightings
- **Description**: List all sightings (anonymized locations for others' sightings)
- **Auth Required**: Yes
- **Query Parameters**:
  - `user_id`: Filter by user (optional)
- **Response**: Array of sighting objects

### GET /sightings/:id
- **Description**: Get a single sighting by ID
- **Auth Required**: Yes
- **Response**: Single sighting object

### PUT /sightings/:id
- **Description**: Update a sighting (owner only)
- **Auth Required**: Yes
- **Request Body**: Any fields to update
- **Response**: `{ "success": true, "updated": {...} }`

### DELETE /sightings/:id
- **Description**: Delete a sighting (owner only)
- **Auth Required**: Yes
- **Response**: `{ "success": true }`

### GET /neighborhoods
- **Description**: List neighborhoods
- **Auth Required**: Yes
- **Query Parameters**:
  - `city`: Filter by city (optional)
  - `state`: Filter by state (optional)
- **Response**: Array of neighborhood objects

### GET /neighborhoods/:id
- **Description**: Get a single neighborhood by ID
- **Auth Required**: Yes
- **Response**: Single neighborhood object

## Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 401: Unauthorized (missing or invalid JWT)
- 403: Forbidden (not owner of resource)
- 404: Resource not found
- 400: Bad request (invalid input)
- 500: Server error 