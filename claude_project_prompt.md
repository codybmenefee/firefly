Firefly Tracker App - Technical Product Specification
Product Vision
A community-driven platform for tracking, sharing, and promoting firefly conservation through simple sighting posts, educational content, and data visualization. The app balances social engagement with privacy, education with gamification, and research with accessibility.
Tech Stack & Vendor Consolidation
Recommended Architecture

Frontend: React (Vite) deployed on Vercel
Backend/API: Supabase Edge Functions (serverless)
Database: Supabase (PostgreSQL + Auth + Storage)
File Storage: Supabase Storage for videos/images
Analytics: Vercel Analytics (built-in) + Supabase Analytics
Maps: Mapbox GL JS (generous free tier)
AI/ML: OpenAI API for video analysis (later phase)

Why This Stack?

Vercel: Excellent free tier and simple deployment for frontend
Supabase: Provides database, auth, storage, real-time subscriptions, and serverless backend in one service
Cost-effective: All services have generous free tiers for MVP

Development Phases
Phase 1: Core MVP (2-3 weeks)
Goal: Get basic sighting functionality live quickly
Frontend Features

Simple sighting form (date, time, count, optional photo)
Basic map view showing sightings (anonymized to neighborhood level)
User authentication (email/password)
Responsive design for mobile-first experience

Backend/API Features (Supabase Edge Functions)

User authentication via Supabase
CRUD operations for sightings
Location anonymization (convert GPS to neighborhood polygons)
Basic API endpoints (Edge Functions)

Database Schema (MVP)
sql-- Users (handled by Supabase Auth)
-- Sightings
CREATE TABLE sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  sighting_date DATE NOT NULL,
  sighting_time TIME,
  firefly_count INTEGER,
  weather_conditions TEXT,
  location_neighborhood TEXT, -- Anonymized location
  location_lat DECIMAL(10,8), -- For internal heat map generation
  location_lng DECIMAL(11,8),
  notes TEXT,
  photo_url TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Neighborhoods (for anonymization)
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  polygon JSONB, -- GeoJSON polygon
  created_at TIMESTAMP DEFAULT NOW()
);
Phase 2: Enhanced Experience (3-4 weeks)
Goal: Add heat maps, gamification, and community features
New Features

Heat map visualization with seasonal/temporal filters
User profiles with sighting statistics
Leaderboards (most sightings, streaks, etc.)
Educational content pages about firefly conservation
Weather integration (fetch historical weather data)
Basic social features (commenting on sightings)

Database Additions
sql-- User profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  total_sightings INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Educational content
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'habitat', 'species', 'conservation', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sighting_id UUID REFERENCES sightings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
Phase 3: AI & Advanced Features (4-5 weeks)
Goal: Video analysis, advanced analytics, and research tools
New Features

Video upload and AI analysis for firefly counting
Advanced heat maps with temporal animations
Research dashboard for data export
Species identification assistance
Weather correlation insights
Push notifications for peak viewing times

Technical Implementation Details
Location Privacy Strategy

Client-side: Capture precise GPS coordinates
Server-side: Convert to neighborhood polygons using services like:

Mapbox Tilequery API
OpenStreetMap Nominatim
Google Places API (Nearby Search)


Storage: Store both precise (for heat maps) and anonymized (for display)
Display: Always show neighborhood-level data to users

Video AI Analysis Approach
javascript// Planned workflow for Phase 3
const analyzeVideo = async (videoFile) => {
  // 1. Extract frames at regular intervals (every 0.5s)
  // 2. Send frames to OpenAI Vision API or custom model
  // 3. Count illuminated objects (fireflies)
  // 4. Calculate density metrics
  // 5. Store results with sighting record
}
API Structure
POST /functions/v1/sightings           # Create new sighting
GET  /functions/v1/sightings           # Get sightings (with filters)
GET  /functions/v1/sightings/:id       # Get specific sighting
PUT  /functions/v1/sightings/:id       # Update sighting
DELETE /functions/v1/sightings/:id     # Delete sighting

GET  /functions/v1/heatmap            # Get heat map data
GET  /functions/v1/neighborhoods      # Get neighborhood data
GET  /functions/v1/leaderboard        # Get user rankings
GET  /functions/v1/educational        # Get educational content

POST /functions/v1/upload-video       # Upload video for analysis (Phase 3)
UI/UX Key Principles
Posting Experience (Strava-like)
Quick Post Flow:
1. Location detection (auto-fill neighborhood)
2. Date/time (default to now)
3. Firefly count (slider or quick buttons: 1-5, 6-15, 16+)
4. Optional photo/video
5. Optional notes
6. One-tap submit
Social Features (Minimal)

Like/heart sightings
Simple comments
Share streak achievements
Follow local area activity (not specific users)

Development Handoff Instructions
Frontend Agent Tasks

Setup: Create React app with Vite, deploy to Vercel
Authentication: Integrate Supabase auth with protected routes
Core Components:

Sighting form with location services
Map component with Mapbox
User dashboard


Styling: Tailwind CSS with nature-inspired theme
State Management: React Query for server state, Zustand for client state

Backend Agent Tasks (Supabase Edge Functions)

Setup: Supabase project, Edge Functions, deploy via Supabase CLI
Database: Supabase integration with proper RLS policies
API Endpoints: RESTful API via Edge Functions
Location Services: Implement neighborhood anonymization
File Upload: Supabase storage integration

Environment Variables Needed
# Frontend (.env)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MAPBOX_TOKEN=

# Supabase Edge Functions (.env)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MAPBOX_TOKEN=
OPENAI_API_KEY= (Phase 3)
Product Requirements - Clarified
Geographic Scope

US-only for MVP launch
State-by-state rollout strategy
County-level granularity for leaderboards and heat maps

Content Moderation Strategy

Hybrid approach: Automated + community reporting
Tight content control with focus on fireflies, regenerative agriculture, and habitat improvement
Pre-approved topic categories to guide discussions

Gamification & Leaderboards

Multi-level competition: County → State → National
Density-based scoring (sightings per area over time)
Streak tracking and seasonal challenges
"BeReal for Fireflies" - daily peak viewing notifications with community challenges

Educational Content

Admin-curated content initially
User submission pathway with approval workflow (Phase 2+)
Research partnership integration for scientific accuracy

Real-time Features Priority

Daily peak viewing notifications (weather + historical data driven)
Live community challenges during peak season
Real-time heat map updates during active viewing hours (7-10 PM local time)

Enhanced Technical Implementation
BeReal-Style Feature ("FireFly Moment")
javascript// Daily notification system
const sendFireflyMoment = async () => {
  // Calculate optimal viewing time based on:
  // - Sunset time + 30-45 minutes
  // - Weather conditions (clear, warm, humid preferred)
  // - Historical peak activity data
  // - Moon phase (darker nights preferred)
  
  // Send push notification to users in optimal zones
  // Open 2-hour window for community posting
}
Enhanced Database Schema Updates
sql-- Enhanced neighborhoods with county/state hierarchy
CREATE TABLE administrative_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'county', 'state', 'neighborhood'
  parent_id UUID REFERENCES administrative_areas(id),
  polygon JSONB, -- GeoJSON polygon
  centroid_lat DECIMAL(10,8),
  centroid_lng DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Firefly moments (BeReal-style daily challenges)
CREATE TABLE firefly_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  optimal_viewing_start TIME,
  optimal_viewing_end TIME,
  weather_conditions JSONB,
  participation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content moderation
CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'sighting', 'comment', 'photo'
  content_id UUID NOT NULL,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research partnerships data export tracking
CREATE TABLE research_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_email TEXT NOT NULL,
  export_date DATE NOT NULL,
  data_range_start DATE,
  data_range_end DATE,
  geographic_scope TEXT, -- 'county:xyz', 'state:abc', 'national'
  anonymization_level TEXT, -- 'full', 'partial'
  export_format TEXT DEFAULT 'csv',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily challenges and streaks
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_sighting_date DATE,
  total_firefly_moments_participated INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboards (materialized view updated nightly)
CREATE MATERIALIZED VIEW leaderboards AS
SELECT 
  ua.name as area_name,
  ua.type as area_type,
  COUNT(s.id) as total_sightings,
  COUNT(DISTINCT s.user_id) as unique_contributors,
  AVG(s.firefly_count) as avg_density,
  MAX(s.created_at) as last_activity
FROM administrative_areas ua
LEFT JOIN sightings s ON ST_Contains(ua.polygon::geometry, ST_Point(s.location_lng, s.location_lat))
WHERE s.created_at >= NOW() - INTERVAL '30 days'
GROUP BY ua.id, ua.name, ua.type
ORDER BY total_sightings DESC;
Real-time Notification System
javascript// Weather + optimal viewing calculation
const calculateFireflyMoment = async (date, location) => {
  const weather = await getWeatherForecast(location, date);
  const sunset = await getSunsetTime(location, date);
  
  // Optimal conditions:
  // - Temperature: 70-85°F
  // - Humidity: 60%+
  // - Clear or partly cloudy
  // - Light wind (<10mph)
  // - 30-45 minutes after sunset
  
  const score = calculateOptimalityScore(weather, sunset);
  
  if (score > 0.7) {
    return {
      recommendedTime: addMinutes(sunset, 35),
      duration: 120, // 2-hour window
      conditions: weather,
      confidence: score
    };
  }
  
  return null;
};
Phase 1 Enhanced Features (Week 3-4 Addition)

County-level leaderboards with state rankings
Basic moderation system with community reporting
Simple notification system for optimal viewing times
Research data export functionality (CSV format)

Phase 2 Enhanced Features (Week 4-6)

Firefly Moments - daily community challenges
Advanced leaderboards with seasonal competitions
User-submitted educational content with approval workflow
Real-time activity feeds during peak hours
Push notification system for web (PWA-ready)

Content Moderation Implementation
javascript// Automated content filtering
const moderateContent = async (content, type) => {
  // 1. Profanity filter
  // 2. Off-topic detection (OpenAI API)
  // 3. Spam detection
  // 4. Image analysis for inappropriate content
  
  const isOnTopic = await checkTopicRelevance(content, [
    'fireflies', 'lightning bugs', 'regenerative agriculture', 
    'habitat restoration', 'native plants', 'pesticide-free gardening'
  ]);
  
  return {
    approved: isOnTopic && !containsProfanity(content),
    requiresReview: !isOnTopic,
    flagged: containsProfanity(content)
  };
};
Research Partnership Integration
javascript// Data export for researchers
const generateResearchExport = async (params) => {
  const {
    dateRange,
    geographicScope,
    anonymizationLevel,
    researcherInfo
  } = params;
  
  // Generate anonymized dataset
  // Include metadata: weather, moon phase, temperature
  // Aggregate by time periods and geographic regions
  // Export in researcher-friendly formats (CSV, JSON, GeoJSON)
  
  await logResearchExport(researcherInfo, params);
  return exportData;
};
Next Steps for Development Agents
Priority Order for Implementation

Week 1-2: Core sighting functionality + basic map
Week 3: County-level leaderboards + content moderation
Week 4: Notification system + research export
Week 5-6: Firefly Moments feature + real-time updates
Week 7+: Advanced gamification + user content submission

Critical Success Metrics

Engagement: Daily active users during firefly season (May-September)
Data Quality: Average sightings per user, geographic coverage
Community: User retention, content quality scores
Research Value: Data export requests, academic partnerships formed

The enhanced specification now includes all your requirements with a clear path for the "BeReal for Fireflies" feature and robust research partnership capabilities. Ready to hand off to your development agents!