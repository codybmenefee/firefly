# Firefly Tracker App - Alpha Architecture

## Alpha Scope
- County/state leaderboards
- Content moderation (community reporting)
- Notification system for optimal viewing times
- Research data export (CSV)

## Data Flow Enhancements
- Leaderboard data aggregated nightly (materialized view)
- Moderation: users can report content, admins review
- Notifications: backend calculates optimal times, triggers push
- Research export: admin/researcher can request anonymized data

## New API Endpoints (Supabase Edge Functions)
- `GET /functions/v1/leaderboard` - Area rankings
- `POST /functions/v1/report` - Report content
- `GET /functions/v1/notifications` - Get/view notifications
- `POST /functions/v1/export` - Request research data

## New Database Tables/Views
- `content_reports`
- `firefly_moments`
- `user_streaks`
- `leaderboards` (materialized view)
- `research_exports`

## Integration Points
- Supabase Edge Functions for all backend logic
- Push notification service (web/PWA)
- Admin dashboard for moderation/export 