-- Seed data for Firefly Tracker MVP

-- Insert some example neighborhoods (Charlotte, NC area)
INSERT INTO neighborhoods (name, city, state, country, polygon) VALUES
  ('Dilworth', 'Charlotte', 'NC', 'US', NULL),
  ('Myers Park', 'Charlotte', 'NC', 'US', NULL),
  ('Plaza Midwood', 'Charlotte', 'NC', 'US', NULL),
  ('NoDa', 'Charlotte', 'NC', 'US', NULL),
  ('South End', 'Charlotte', 'NC', 'US', NULL),
  ('Elizabeth', 'Charlotte', 'NC', 'US', NULL),
  ('Chantilly', 'Charlotte', 'NC', 'US', NULL),
  ('Eastover', 'Charlotte', 'NC', 'US', NULL),
  ('Wesley Heights', 'Charlotte', 'NC', 'US', NULL),
  ('Sedgefield', 'Charlotte', 'NC', 'US', NULL)
ON CONFLICT DO NOTHING;

-- Note: In production, you would add proper GeoJSON polygons for each neighborhood
-- to enable accurate location-to-neighborhood mapping