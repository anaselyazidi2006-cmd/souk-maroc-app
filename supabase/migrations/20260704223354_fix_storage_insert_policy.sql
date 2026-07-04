/*
# Fix storage INSERT policy for listings bucket

1. Changes
- Drops the permissive INSERT policy that allowed any authenticated user to upload to any path
- Replaces it with a policy that restricts uploads to the user's own folder (auth.uid() as first path segment)
- This prevents user A from uploading into user B's folder

2. Security
- INSERT now requires: bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]
- Consistent with existing UPDATE and DELETE policies
*/

DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
