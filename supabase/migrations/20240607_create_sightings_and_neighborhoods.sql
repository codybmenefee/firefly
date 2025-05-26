-- Migration: Create sightings and neighborhoods tables for Firefly Tracker MVP

CREATE TABLE IF NOT EXISTS sightings (
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

CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  polygon JSONB, -- GeoJSON polygon
  created_at TIMESTAMP DEFAULT NOW()
); 