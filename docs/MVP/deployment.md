# Firefly Tracker App - Deployment Guide

## Overview
The Firefly Tracker App uses:
- **Vercel** for frontend hosting
- **Supabase Edge Functions** for serverless backend
- **Supabase** for database, auth, and file storage

## Prerequisites
- Vercel account (free tier works)
- Supabase project (already set up)
- Supabase CLI installed and logged in
- Environment variables configured

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# From frontend directory
cd frontend
vercel

# Follow prompts to:
# - Link to existing project or create new
# - Configure build settings (auto-detected for Vite)
# - Set environment variables
```

### Option 2: Deploy via GitHub Integration
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_TOKEN` (if using maps)

### Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable for Production environment
3. Redeploy to apply changes

## Backend Deployment (Supabase Edge Functions)

### Deploy All Functions
```bash
cd supabase
supabase functions deploy --all
```

### Deploy Specific Function
```bash
supabase functions deploy <function-name>

# Examples:
supabase functions deploy ping
supabase functions deploy db-test
supabase functions deploy sightings
supabase functions deploy neighborhoods
```

### Set Edge Function Secrets
```bash
# Set secrets for Edge Functions (if needed)
supabase secrets set MAPBOX_TOKEN=your-token
supabase secrets set OPENAI_API_KEY=your-key
```

## Database Setup

### Apply Migrations
```bash
cd supabase
supabase db push
```

### Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create bucket named `sightings`
3. Set bucket to public (for photo URLs)
4. Configure policies:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload sighting photos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'sightings');
   
   -- Allow public to view photos
   CREATE POLICY "Public can view sighting photos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'sightings');
   ```

## Post-Deployment Checklist

### Verify Frontend
- [ ] Site loads at Vercel URL
- [ ] Environment variables are working
- [ ] Can reach API endpoints

### Verify Backend
- [ ] Edge Functions are deployed
- [ ] `/ping` endpoint returns "pong"
- [ ] `/db-test` can connect to database
- [ ] Auth endpoints work

### Verify Database
- [ ] Tables created (`sightings`, `neighborhoods`)
- [ ] RLS policies in place
- [ ] Storage bucket configured

### Test User Flow
- [ ] User can sign up
- [ ] User can log in
- [ ] User can submit sighting
- [ ] Map displays sightings
- [ ] Dashboard shows user's sightings

## Monitoring

### Frontend (Vercel)
- View logs: Vercel Dashboard → Functions → Logs
- Analytics: Vercel Dashboard → Analytics

### Backend (Supabase)
- Edge Function logs: Supabase Dashboard → Edge Functions → Logs
- Database metrics: Supabase Dashboard → Database → Statistics

## Troubleshooting

### Frontend Not Loading
- Check Vercel build logs
- Verify environment variables are set
- Check browser console for errors

### API Errors
- Check Edge Function logs in Supabase Dashboard
- Verify CORS headers in Edge Functions
- Ensure auth tokens are valid

### Database Connection Issues
- Verify service role key in Edge Functions
- Check RLS policies
- Ensure tables exist

## Rollback

### Frontend
```bash
# Vercel keeps deployment history
# Rollback via dashboard or CLI
vercel rollback
```

### Edge Functions
```bash
# Deploy previous version of function
# Keep function code in version control
git checkout <previous-commit>
supabase functions deploy <function-name>
```