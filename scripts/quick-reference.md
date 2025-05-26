# Firefly Tracker App - Quick Reference

## 🚀 Quick Start
```bash
# Initial setup
./scripts/setup.sh

# Start development
npm run dev:frontend    # Start frontend on http://localhost:5173
npm run dev:functions   # Start Edge Functions locally (requires Supabase CLI)
```

## 📦 Common Commands

### Frontend Development
```bash
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm test                # Run tests
node test-env.js        # Check environment variables
```

### Supabase Edge Functions
```bash
cd supabase
supabase functions new <name>              # Create new function
supabase functions serve                   # Run all functions locally
supabase functions serve <name>            # Run specific function locally
supabase functions deploy <name>           # Deploy specific function
supabase functions deploy --all            # Deploy all functions
```

### Database Management
```bash
# From supabase directory
supabase db reset       # Reset database to initial migration state
supabase db push        # Push local migrations to remote
supabase db pull        # Pull remote schema changes
```

## 🔑 Environment Variables

### Frontend (.env)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_MAPBOX_TOKEN` - Mapbox token for map features

### Edge Functions (.env)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secure!)

Get these from: https://app.supabase.com/project/_/settings/api

## 📝 MVP Checklist
- [ ] Stage 1: Hello World connectivity (/ping endpoint)
- [ ] Stage 2: Database connectivity (/db-test endpoint)  
- [ ] Stage 3: Basic auth flow (signup/login)
- [ ] Stage 4: MVP sighting flow (submit/view)
- [ ] Stage 5: Full MVP features (map, dashboard, etc)

## 🐛 Troubleshooting

### CORS Issues
- Check that Edge Functions include proper CORS headers
- Ensure frontend uses correct Supabase URL

### Auth Issues
- Verify anon key is correct in frontend .env
- Check JWT is being sent in Authorization header
- Ensure service role key is set for Edge Functions

### Database Issues
- Confirm tables exist in remote Supabase project
- Check RLS policies are configured correctly
- Verify service role key for Edge Functions

## 📚 Key Documentation
- `/docs/MVP/mvp_features.md` - Feature requirements
- `/docs/MVP/api_endpoints.md` - API documentation
- `/docs/MVP/architecture.md` - System design
- `/docs/MVP/tasks.md` - Development tasks