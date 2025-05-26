# Firefly Tracker App - MVP Architecture

## MVP Scope
- User authentication (Supabase)
- Sighting form (date, time, count, optional photo)
- Map view (Mapbox, anonymized locations)
- Basic dashboard (user's sightings)
- Responsive mobile-first design

## Data Flow
1. **User logs in (Supabase Auth)**
2. **User submits sighting:**
   - Form data sent to Supabase Edge Function (API)
   - Edge Function stores data in Supabase (with anonymized location)
   - Photo uploaded to Supabase Storage
3. **Map loads sightings:**
   - Frontend fetches anonymized sightings from Edge Function API
   - Mapbox displays points/polygons
4. **Dashboard:**
   - User fetches their own sightings

## Integration Points
- **Supabase:** Auth, DB, Storage, Edge Functions (API)
- **Mapbox:** Map rendering, location anonymization

## Authentication
All endpoints (except `/ping` and `/db-test`) require a valid Supabase JWT in the `Authorization` header:

```
Authorization: Bearer <JWT>
```
- Obtain JWT via Supabase Auth (sign up, login, session).
- If the token is missing, invalid, or expired, the API returns a 401 error.

## MVP API Endpoints (Supabase Edge Functions)
- `POST /functions/v1/sightings` - Create sighting
- `GET /functions/v1/sightings` - List sightings
- `GET /functions/v1/sightings/:id` - Get sighting
- `PUT /functions/v1/sightings/:id` - Update sighting
- `DELETE /functions/v1/sightings/:id` - Delete sighting
- `GET /functions/v1/neighborhoods` - List neighborhoods

## API Request & Response Shapes

### POST /functions/v1/sightings
**Request (JSON, Auth required):**
```
{
  "sighting_date": "YYYY-MM-DD",
  "sighting_time": "HH:MM[:SS]", // optional
  "firefly_count": 5, // integer
  "weather_conditions": "Clear",
  "location_lat": 35.12345678, // decimal
  "location_lng": -80.12345678, // decimal
  "notes": "Saw a cluster near the park.", // optional
  "photo_url": "https://..." // optional, after upload
}
```
**Response:**
```
{
  "id": "uuid",
  "user_id": "uuid",
  "created_at": "timestamp",
  ... // all submitted fields, plus any server-generated fields
}
```
**Error Response:**
```
{
  "error": "Missing or invalid Authorization header"
}
```

### GET /functions/v1/sightings
**Request:**
- Auth required. No body.
**Response:**
```
[
  {
    "id": "uuid",
    "sighting_date": "YYYY-MM-DD",
    "firefly_count": 5,
    "location_neighborhood": "Neighborhood Name",
    "location_lat": 35.1234, // anonymized or omitted for public
    "location_lng": -80.1234,
    "photo_url": "https://...",
    ...
  },
  ...
]
```
**Error Response:**
```
{
  "error": "Missing or invalid Authorization header"
}
```

### GET /functions/v1/sightings/:id
**Request:**
- Auth required. No body.
**Response:**
```
{
  "id": "uuid",
  "user_id": "uuid",
  "sighting_date": "YYYY-MM-DD",
  ... // all fields for this sighting
}
```
**Error Response:**
```
{
  "error": "Sighting not found"
}
```

### PUT /functions/v1/sightings/:id
**Request (JSON, Auth required, must own sighting):**
- Any updatable fields (same as POST)
**Response:**
```
{
  "success": true,
  "updated": { ...sighting fields... }
}
```
**Error Response:**
```
{
  "error": "Unauthorized: not owner of sighting"
}
```

### DELETE /functions/v1/sightings/:id
**Request:**
- Auth required, must own sighting. No body.
**Response:**
```
{
  "success": true
}
```
**Error Response:**
```
{
  "error": "Unauthorized: not owner of sighting"
}
```

### GET /functions/v1/neighborhoods
**Request:**
- Auth required. No body.
**Response:**
```
[
  {
    "id": "uuid",
    "name": "Neighborhood Name",
    "city": "City",
    "state": "State",
    "country": "US",
    "polygon": { ...GeoJSON... },
    ...
  },
  ...
]
```
**Error Response:**
```
{
  "error": "Missing or invalid Authorization header"
}
```

### GET /functions/v1/ping
**Request:**
- No auth required. No body.
**Response:**
```
{
  "message": "pong"
}
```

### GET /functions/v1/db-test
**Request:**
- No auth required. No body.
**Response:**
```
{
  "success": true,
  "sightingsCount": 3,
  "neighborhoodsCount": 2
}
```
**Error Response:**
```
{
  "success": false,
  "error": "'sightings' table does not exist"
}
```

## MVP Database Tables
- `sightings`