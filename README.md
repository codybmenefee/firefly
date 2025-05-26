# Firefly Tracker App

## Project Overview
A community-driven platform for tracking, sharing, and promoting firefly conservation. Designed for rapid prototyping, modularity, and easy onboarding for junior developers.

---

## MVP Features
See `/docs/MVP/mvp_features.md` for the full MVP feature list.

- User authentication (Supabase)
- Sighting form (date, time, count, optional photo)
- Map view (Mapbox, anonymized locations)
- Basic dashboard (user's sightings)
- Responsive mobile-first design

---

## Getting Started – Quick Setup
See `/docs/MVP/setup_guide.md` for full details.

```sh
# 1. Clone the repo
git clone <repo-url>
cd firefly

# 2. Install dependencies
cd frontend && npm install
cd ../supabase && npm install

# 3. Copy environment variables
cp frontend/.env.example frontend/.env
cp supabase/.env.example supabase/.env
# Fill in required values from your remote Supabase project settings

# 4. (Optional) Supabase CLI login
supabase login
# Follow the prompt to connect your CLI to your remote Supabase project

# 5. Start frontend
cd frontend && npm start
```

---

## Directory Structure
```
firefly/
  frontend/      # Vite + React + Tailwind app
  supabase/      # Supabase project & Edge Functions
  docs/          # All documentation
  README.md
```

---

## Documentation
- **MVP Features:** `/docs/MVP/mvp_features.md`
- **API Endpoints:** `/docs/MVP/api_endpoints.md`
- **Setup Guide:** `/docs/MVP/setup_guide.md`
- **Architecture:** `/docs/architecture.md`, `/docs/MVP/architecture.md`
- **Tasks:** `/docs/tasks.md`, `/docs/MVP/tasks.md`

---

## Environment Variables
- `frontend/.env.example` contains:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_MAPBOX_TOKEN`
- `supabase/.env.example` contains:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `MAPBOX_TOKEN`
  - `OPENAI_API_KEY`
- **All environment variables must be set to your remote Supabase project values.**

---

## For Agents: Staged, Test-Driven MVP Plan
Agents should follow the staged plan in `/docs/MVP/tasks.md` and verify end-to-end functionality at each step before proceeding.

---

## Useful Scripts
- `cd frontend && npm start` – Start frontend
- `cd frontend && npm test` – Run frontend tests
- `supabase functions deploy <function>` – Deploy Edge Functions to remote Supabase

---

## Deployment
- Deploy frontend to Vercel
- Deploy Edge Functions via Supabase CLI to your remote project

---

**Your goal:**
Get the MVP up and running, deployed, and ready for friends and family to use. Iterate quickly, keep code modular and well-commented, and update documentation as you go.

---

## Notes
- **No local database or Docker required.** All data is stored in your remote Supabase project.
- Ensure your `.env` files use the remote Supabase URL and keys.

## Current State
- **Documentation:** All architecture, tasks, and onboarding docs are up to date and located in `/docs/`.
- **Tech Stack:**
  - **Frontend:** React (Vite) + Tailwind CSS, deployed on Vercel
  - **Backend/API:** Supabase Edge Functions (serverless)
  - **Database/Auth/Storage:** Supabase
  - **Maps:** Mapbox GL JS
- **Vendors:** Only Vercel and Supabase (no Railway, no Node.js/Express backend).

---

## Getting Started – Onboarding Checklist
- [ ] Read `/docs/architecture.md` and `/docs/tasks.md` for the big picture and best practices.
- [ ] Review `/docs/MVP/architecture.md` and `/docs/MVP/tasks.md` for MVP-specific details and actionable tasks.
- [ ] Scaffold the codebase:
    - [ ] Create the `/frontend` directory and initialize a Vite + React + Tailwind CSS project.
    - [ ] Create the `/supabase` directory and initialize a Supabase project (using the Supabase CLI).
    - [ ] Set up the initial Supabase Edge Functions for the MVP API endpoints.
- [ ] Prepare `.env.example` files for both frontend and Supabase Edge Functions (see docs for required variables).
- [ ] Ensure you have Supabase and Vercel accounts ready.
- [ ] Use the schema in `/docs/MVP/architecture.md` to set up the `sightings` and `neighborhoods` tables in Supabase.
- [ ] Set up a Supabase Storage bucket for photo uploads.
- [ ] Follow the branching, code review, and testing practices in `/docs/tasks.md`.
- [ ] Prioritize getting a working MVP deployed to Vercel and Supabase as quickly as possible.
- [ ] Focus on manual and end-to-end user flow tests (see `/docs/MVP/tasks.md`).

---

## Staged, Test-Driven MVP Plan (For Agents)

To ensure rapid progress and minimize bugs, follow this incremental plan. Each stage is end-to-end testable and should be completed and verified before moving to the next.

### Stage 1: "Hello World" End-to-End
**Goal:** Prove the frontend, backend, and database all connect and run.
- Frontend: Display a static page with a "Ping API" button.
- Backend: Implement a `/ping` endpoint in an Edge Function that returns `{ "message": "pong" }`.
- Frontend: Button calls `/ping` and displays the response.
- **Test:** Deploy locally, click the button, and see "pong" from the backend.

### Stage 2: Database Connectivity
**Goal:** Prove the backend can read/write to the database.
- Database: Create a simple `test_table` with a text column.
- Backend: Add a `/db-test` endpoint that inserts and returns rows from `test_table`.
- Frontend: Add a "Test DB" button that calls `/db-test` and displays the result.
- **Test:** Click the button and see data from the database.

### Stage 3: Basic Auth Flow
**Goal:** Prove user signup/login works end-to-end.
- Frontend: Add a simple signup/login form using Supabase Auth.
- Backend: Update `/ping` or `/db-test` to require a valid JWT.
- **Test:** Sign up, log in, and call the protected endpoint.

### Stage 4: MVP Sighting Flow (Skeleton)
**Goal:** Prove a user can submit and view a sighting.
- Database: Create the `sightings` table (minimal columns: id, user_id, description).
- Backend: Implement `POST /sightings` (create) and `GET /sightings` (list).
- Frontend: Add a form to submit a sighting and a list to display them.
- **Test:** Log in, submit a sighting, and see it in the list.

### Stage 5: Iterate Toward Full MVP
- Add fields (date, time, count, photo), map view, neighborhoods, dashboard, etc.
- **At each step, do a manual E2E test before moving on.**

#### Summary Table

| Stage | What You Prove | What to Test |
|-------|----------------|--------------|
| 1     | Frontend ↔ Backend | Button returns "pong" |
| 2     | Backend ↔ DB   | Button returns DB data |
| 3     | Auth           | Can sign up, log in, call protected endpoint |
| 4     | Core Flow      | Can submit/view a sighting |
| 5     | Full MVP       | All features work together |

**Agents:** Complete each stage in order, verifying end-to-end functionality before proceeding. This ensures a stable, testable MVP at every step.

---

## Sample Directory Structure
```
firefly/
  frontend/      # Vite + React + Tailwind app
  supabase/      # Supabase project & Edge Functions
  docs/          # All documentation
  README.md
```

---

## Example Commands
```sh
# Initialize frontend
cd firefly
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize Supabase
cd ../
supabase init supabase
```

---

## Where to Ask for Help
- If you have any questions, refer to the documentation first.
- For technical blockers, document your issue and reach out to the project lead or post in the team chat.

---

**Your goal:**  
Get the MVP up and running, deployed, and ready for friends and family to use.  
Iterate quickly, keep code modular and well-commented, and update documentation as you go.

---

**You're set up for success—good luck, and let's light up the world for fireflies!** 