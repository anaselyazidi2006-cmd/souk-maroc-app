-- Ensure RLS update policy exists for listings table
-- Allows authenticated users to update only their own listings

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listings'
      AND policyname = 'Users can update own listings'
  ) THEN
    CREATE POLICY "Users can update own listings"
      ON listings
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Ensure delete policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'listings'
      AND policyname = 'Users can delete own listings'
  ) THEN
    CREATE POLICY "Users can delete own listings"
      ON listings
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END
$$;
