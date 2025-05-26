# Firefly Tracker App - MVP Task List

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