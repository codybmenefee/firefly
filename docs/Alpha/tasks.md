# Firefly Tracker App - Alpha Task List

> Note: Alpha tasks are for post-MVP features. See `/docs/MVP/tasks.md` for current progress.

## User Stories
- As a user, I can see leaderboards for my county/state
- As a user, I can report inappropriate content
- As an admin, I can review and moderate reports
- As a user, I receive notifications for optimal viewing times
- As a researcher, I can request anonymized data exports

## Tasks
### Leaderboards
- [ ] Create materialized view in DB
- [ ] Supabase Edge Function for leaderboard data
- [ ] Frontend leaderboard UI

### Moderation
- [ ] Report button on sightings/comments
- [ ] Supabase Edge Function to submit reports
- [ ] Admin dashboard for reviewing reports

### Notifications
- [ ] Supabase Edge Function for optimal viewing calculation
- [ ] Push notification integration (web/PWA)
- [ ] Frontend notification UI

### Research Export
- [ ] Supabase Edge Function for export requests
- [ ] Admin UI for export management

### Testing
- [ ] Manual test: leaderboard displays correctly
- [ ] Manual test: reporting and moderation flow
- [ ] Manual test: notifications sent/received
- [ ] Manual test: data export works

## Acceptance Criteria
- All Alpha user stories are fulfilled
- Features are deployed and usable
- Code is commented and documented
- No Railway or Node.js/Express dependencies 