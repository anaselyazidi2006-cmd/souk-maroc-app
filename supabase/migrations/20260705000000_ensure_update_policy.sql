-- Ensure the owner_update_listings policy exists and is correct.
-- This is a no-op if the policy already exists from the initial migration,
-- but ensures the policy is in place for edit functionality.

DO $$
BEGIN
  -- Re-create update policy (idempotent)
  DROP POLICY IF EXISTS "owner_update_listings" ON listings;
  CREATE POLICY "owner_update_listings" ON listings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;
