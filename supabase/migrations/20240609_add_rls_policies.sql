-- Migration: Add Row Level Security policies for sightings and neighborhoods

-- Enable RLS on tables
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Sightings policies
-- Anyone authenticated can read all sightings
CREATE POLICY "Users can view all sightings" ON sightings
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own sightings
CREATE POLICY "Users can create own sightings" ON sightings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own sightings
CREATE POLICY "Users can update own sightings" ON sightings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own sightings
CREATE POLICY "Users can delete own sightings" ON sightings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Neighborhoods policies
-- Anyone authenticated can read neighborhoods
CREATE POLICY "Users can view all neighborhoods" ON neighborhoods
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can modify neighborhoods (admin only)
-- No INSERT/UPDATE/DELETE policies for regular users