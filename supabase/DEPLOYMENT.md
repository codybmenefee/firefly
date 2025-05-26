# Supabase Backend Deployment Guide

This guide covers deploying the database schema, Edge Functions, and storage configuration to your remote Supabase project.

## Prerequisites

1. A Supabase account and project created at https://supabase.com
2. Supabase CLI installed (`npm install -g supabase`)
3. Your project's environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY`

## Setup Steps

### 1. Configure Environment

```bash
# Copy the example env file
cp supabase/.env.example supabase/.env

# Edit .env with your project values
# Get these from your Supabase project settings
```

### 2. Link to Your Supabase Project

```bash
cd supabase
npx supabase login
npx supabase link --project-ref your-project-ref
```

### 3. Deploy Database Migrations

```bash
# Run all migrations to create tables and policies
npx supabase db push

# Or run specific migrations
npx supabase db push --include-all
```

The migrations will create:
- `sightings` table with RLS policies
- `neighborhoods` table with RLS policies  
- `firefly-photos` storage bucket with policies

### 4. Deploy Edge Functions

```bash
# Deploy all functions
npx supabase functions deploy

# Or deploy individually
npx supabase functions deploy ping
npx supabase functions deploy db-test
npx supabase functions deploy sightings
npx supabase functions deploy neighborhoods
```

### 5. Verify Deployment

Test the endpoints:

```bash
# Test ping (no auth required)
curl https://your-project.supabase.co/functions/v1/ping

# Test database connectivity
curl https://your-project.supabase.co/functions/v1/db-test
```

### 6. Seed Initial Data (Optional)

If you want to add some initial neighborhoods:

```sql
-- Run this in the Supabase SQL editor
INSERT INTO neighborhoods (name, city, state, country) VALUES
  ('Dilworth', 'Charlotte', 'NC', 'US'),
  ('Myers Park', 'Charlotte', 'NC', 'US'),
  ('Plaza Midwood', 'Charlotte', 'NC', 'US'),
  ('NoDa', 'Charlotte', 'NC', 'US'),
  ('South End', 'Charlotte', 'NC', 'US');
```

## Troubleshooting

### Edge Function Not Working
- Check function logs: `npx supabase functions logs <function-name>`
- Verify environment variables are set correctly
- Ensure CORS headers are properly configured

### Database Tables Missing
- Run migrations: `npx supabase db push`
- Check migration status: `npx supabase db migrations list`

### Storage Bucket Issues
- Verify bucket exists in Supabase dashboard
- Check RLS policies are enabled
- Ensure file size and MIME type restrictions match your needs

## Next Steps

1. Share the `SUPABASE_URL` and `SUPABASE_ANON_KEY` with the frontend team
2. Test all endpoints with a tool like Postman or curl
3. Monitor Edge Function logs for any errors
4. Set up proper error alerting in production