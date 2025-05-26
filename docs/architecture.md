# Firefly Tracker App - System Architecture

## Overview
A community-driven platform for tracking, sharing, and promoting firefly conservation. The system is designed for rapid prototyping, modularity, and scalability, enabling junior developers to contribute effectively.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Query, Zustand, Mapbox GL JS
- **Backend/API:** Supabase Edge Functions (serverless)
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:**
  - Frontend: Vercel
  - Backend/API: Supabase Edge Functions
- **Maps:** Mapbox
- **AI/ML (future):** OpenAI API

## Directory Structure
```
/frontend   # React (Vite) app
/supabase   # Supabase Edge Functions, migrations, config
/docs       # Documentation and planning
/assets     # Images, color palettes, etc.
```

## Deployment Strategy
- **Frontend:** Continuous deployment via Vercel (GitHub integration)
- **Backend/API:** Supabase Edge Functions (deployed via Supabase CLI)
- **Database:** Supabase project with migrations and RLS policies

## Design Principles
- Modular, small files (refactor after 300 lines)
- Clear, well-commented code
- Lightweight, user-centric tests
- Documentation-first approach
- Rapid prototyping, iterative delivery

## Phases
- **MVP:** Core sighting functionality, map, auth
- **Alpha:** Leaderboards, moderation, notifications
- **Beta:** Firefly Moments, real-time updates, user content
- **Production:** Advanced gamification, research tools 