-- Migration: Create storage bucket for firefly photos

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'firefly-photos',
  'firefly-photos',
  true, -- Public bucket for easy access
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'firefly-photos');

-- Allow anyone to view photos (since bucket is public)
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'firefly-photos');

-- Allow users to update their own photos
CREATE POLICY "Users can update own photos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'firefly-photos' AND auth.uid()::text = owner)
  WITH CHECK (bucket_id = 'firefly-photos');

-- Allow users to delete their own photos  
CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'firefly-photos' AND auth.uid()::text = owner);