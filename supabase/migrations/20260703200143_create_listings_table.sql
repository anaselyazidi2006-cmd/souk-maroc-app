/*
# Create listings table

1. New Tables
- `listings`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `title` (text, not null)
  - `description` (text)
  - `price` (numeric, nullable — null means بالاتفاق)
  - `price_label` (text)
  - `type` (text: sale | service | job | rent)
  - `type_label` (text)
  - `category` (text)
  - `image` (text — public URL)
  - `city` (text)
  - `phone` (text)
  - `whatsapp` (text)
  - `badge` (text, nullable: urgent | featured | new)
  - `likes` (integer, default 0)
  - `comments` (integer, default 0)
  - `views` (integer, default 0)
  - `user_name` (text)
  - `user_avatar` (text)
  - `user_city` (text)
  - `user_rating` (numeric, default 4.5)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `listings`.
- Authenticated users can INSERT their own listings (owner column defaults to auth.uid()).
- All users (anon + authenticated) can SELECT all listings (marketplace is public).
- Authenticated owners can UPDATE and DELETE their own listings.

3. Important Notes
- `user_id` defaults to `auth.uid()` so front-end inserts without passing user_id still satisfy the INSERT policy.
- SELECT is open to anon so the marketplace feed works without login.
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric,
  price_label text NOT NULL DEFAULT 'بالاتفاق',
  type text NOT NULL DEFAULT 'sale',
  type_label text NOT NULL DEFAULT 'للبيع',
  category text NOT NULL DEFAULT 'handcraft',
  image text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  badge text,
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  user_name text NOT NULL DEFAULT '',
  user_avatar text NOT NULL DEFAULT '',
  user_city text NOT NULL DEFAULT '',
  user_rating numeric NOT NULL DEFAULT 4.5,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_listings" ON listings;
CREATE POLICY "public_select_listings" ON listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_listings" ON listings;
CREATE POLICY "owner_insert_listings" ON listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_listings" ON listings;
CREATE POLICY "owner_update_listings" ON listings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_listings" ON listings;
CREATE POLICY "owner_delete_listings" ON listings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id);
CREATE INDEX IF NOT EXISTS listings_city_idx ON listings (city);
CREATE INDEX IF NOT EXISTS listings_type_idx ON listings (type);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings (created_at DESC);
