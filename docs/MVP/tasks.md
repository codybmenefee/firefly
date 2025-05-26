# Firefly Tracker App - MVP Task List

## MVP Dev Plan by Agent Responsibilities

### 1. Backend Agent (Supabase)
**Responsibilities:**
- Set up and maintain Supabase Edge Functions for all API endpoints (see `/docs/MVP/api_endpoints.md`).
- Implement authentication middleware (JWT validation).
- Create and update database tables (`sightings`, `neighborhoods`) and storage buckets as per `/docs/MVP/architecture.md`.
- Write and deploy Edge Functions for CRUD operations.
- Ensure all endpoints use the remote Supabase project (no local DB).
- Document API request/response shapes.

**Initial Agent Prompt:**
```
You are the Backend Agent for the Firefly Tracker App. Your job is to:
- Implement and deploy all Supabase Edge Functions for the endpoints in /docs/MVP/api_endpoints.md.
- Ensure all endpoints use the remote Supabase project (see .env.example for variables).
- Set up and migrate the required tables and storage buckets as per /docs/MVP/architecture.md.
- Add authentication middleware to all endpoints except /ping and /db-test.
- Document your work and update /docs/MVP/api_endpoints.md as needed.
```

---

### 2. Frontend Agent
**Responsibilities:**
- Build all UI components and pages for the MVP features in `/docs/MVP/mvp_features.md`.
- Integrate Supabase Auth for signup/login/logout.
- Connect frontend to all backend endpoints (using remote Supabase URL/keys).
- Implement forms, map view, dashboard, and responsive design.
- Add manual and automated tests for user flows.
- Ensure all environment variables are set for remote Supabase.

**Initial Agent Prompt:**
```
You are the Frontend Agent for the Firefly Tracker App. Your job is to:
- Build all UI components and pages for the MVP features in /docs/MVP/mvp_features.md.
- Integrate Supabase Auth and connect to all backend endpoints using the remote Supabase project.
- Implement forms, map view, dashboard, and ensure responsive/mobile-first design.
- Add tests for all user flows.
- Ensure all environment variables are set for remote Supabase.
```

---

### 3. DevOps/Workspace Agent
**Responsibilities:**
- Ensure all environment variables in `.env.example` files are correct and reference the remote Supabase project.
- Maintain and update `.cursor/environment.json` for agent automation.
- Keep all documentation up to date (README, setup guide, API docs, etc.).
- Provide scripts for install, start, test, and deployment.
- Ensure no references to local DB or Docker remain in any scripts or docs.

**Initial Agent Prompt:**
```
You are the DevOps/Workspace Agent for the Firefly Tracker App. Your job is to:
- Ensure all environment variables and scripts reference the remote Supabase project only.
- Maintain .cursor/environment.json for agent automation.
- Keep all documentation up to date and clear for agent and human use.
- Remove any references to local DB or Docker from scripts and docs.
```

---

## Agent Guidance: Staged, Test-Driven MVP Plan
To ensure a stable and testable MVP, agents must:
- Complete each stage in order (see checklist below).
- After each stage, perform a manual end-to-end test to verify the app works as expected.
- Only proceed to the next stage when the previous one is fully operational.
- Refer to the main README for detailed instructions on each stage.

**Stages:**
- [x] Hello World End-to-End: Frontend ↔ Backend connectivity (`/ping` endpoint) *(CORS/auth issues resolved; pong received in browser)*
- [x] Database Connectivity: Backend ↔ DB (`/db-test` endpoint) *(Edge Function deployed and working; returns error if no tables exist, but confirms DB connection)*
3. Basic Auth Flow: User signup/login and protected endpoint
4. MVP Sighting Flow: Submit and view a sighting
5. Iterate to full MVP: Add fields, map, dashboard, etc.

## User Stories
- As a user, I can sign up and log in
- As a user, I can submit a firefly sighting with date, time, count, and photo
- As a user, I can view recent sightings on a map
- As a user, I can see my own sightings in a dashboard

## Tasks
### Frontend
- [x] Set up Vite + React + Tailwind CSS (manual Tailwind config if CLI fails)
- [ ] Integrate Supabase Auth
- [ ] Build sighting form (date, time, count, photo upload)
- [ ] Map component (Mapbox, show anonymized sightings)
- [ ] User dashboard (list of user's sightings)
- [ ] Responsive/mobile-first layout
- [x] Connect to Supabase Edge Function API *(ping endpoint, CORS/auth debugged)*

### Backend/API (Supabase Edge Functions)
- [x] Initialize Supabase project in `/supabase`
- [ ] Write Edge Functions for CRUD endpoints (sightings, neighborhoods)
- [ ] Auth middleware (validate Supabase JWT in Edge Functions)
- [ ] Location anonymization logic in Edge Functions

### Database
- [ ] Create `sightings` table (per spec)
- [ ] Create `neighborhoods` table (per spec)
- [ ] Set up Supabase Storage for photos

### Testing
- [ ] Manual test: user can sign up, post, and view sighting
- [ ] Manual test: map displays sightings
- [ ] Manual test: dashboard shows user's posts

## Acceptance Criteria
- All MVP user stories are fulfilled
- App is deployed and usable by friends/family
- Code is commented and documented
- No Railway or Node.js/Express dependencies 