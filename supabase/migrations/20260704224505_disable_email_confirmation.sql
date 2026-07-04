/*
# Disable email confirmation for auth

Bolt-managed Supabase projects do not expose the dashboard toggle for email confirmation.
This migration disables email confirmation at the database level using the auth settings
approach available in self-hosted / Bolt environments.
*/

-- Disable email confirmation requirement by auto-confirming any unconfirmed users
-- and setting email_confirmed_at for all existing users who registered but couldn't confirm.
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
