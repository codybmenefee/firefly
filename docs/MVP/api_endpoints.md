# Firefly Tracker App - MVP API Endpoints

## Auth Required (except /ping, /db-test)

### POST /functions/v1/sightings
- Create a new sighting

### GET /functions/v1/sightings
- List all sightings

### GET /functions/v1/sightings/:id
- Get a single sighting

### PUT /functions/v1/sightings/:id
- Update a sighting (owner only)

### DELETE /functions/v1/sightings/:id
- Delete a sighting (owner only)

### GET /functions/v1/neighborhoods
- List neighborhoods

### GET /functions/v1/ping
- Healthcheck (no auth)

### GET /functions/v1/db-test
- DB connectivity test (no auth) 