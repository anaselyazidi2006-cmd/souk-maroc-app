-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'listings');

CREATE POLICY "Authenticated users can update their own listing images"
  ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own listing images"
  ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);