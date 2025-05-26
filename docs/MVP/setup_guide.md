# Firefly Tracker App - MVP Setup Guide

## Prerequisites
- Node.js v20+
- Supabase CLI (`npm install -g supabase`)
- Vercel account (for deployment)
- **Remote Supabase project** (no local Docker database required)

## Setup Steps

1. **Clone the repo**
   ```sh
   git clone <repo-url>
   cd firefly
   ```
2. **Install dependencies**
   ```sh
   cd frontend && npm install
   cd ../supabase && npm install
   ```
3. **Copy environment variables**
   - Copy `.env.example` to `.env` in both `frontend/` and `supabase/` and fill in required values from your remote Supabase project settings.
4. **(Optional) Supabase CLI login**
   - Run `supabase login` and follow the prompt to connect your CLI to your remote Supabase project.
5. **Start frontend**
   ```sh
   cd frontend && npm start
   ```
6. **Run tests**
   ```sh
   cd frontend && npm test
   ```

## Useful Commands
- `cd frontend && npm start` – Start frontend
- `cd frontend && npm test` – Run frontend tests
- `supabase functions deploy <function>` – Deploy Edge Functions to remote Supabase

## Deployment
- Deploy frontend to Vercel
- Deploy Edge Functions via Supabase CLI to your remote project

## Notes
- **No local database or Docker required.** All data is stored in your remote Supabase project.
- Ensure your `.env` files use the remote Supabase URL and keys. 