-- Add missing columns to listings table that PostAdScreen tries to insert
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS price_label  text,
  ADD COLUMN IF NOT EXISTS type_label   text,
  ADD COLUMN IF NOT EXISTS whatsapp     text,
  ADD COLUMN IF NOT EXISTS badge        text,
  ADD COLUMN IF NOT EXISTS user_name    text,
  ADD COLUMN IF NOT EXISTS user_avatar  text,
  ADD COLUMN IF NOT EXISTS user_city    text,
  ADD COLUMN IF NOT EXISTS user_rating  numeric DEFAULT 4.5;
