-- Hikaya platform schema (target). Not applied automatically.
-- Apply with a managed Postgres (e.g. Neon) when Phase 1 is activated.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  locale TEXT NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  age_years INT CHECK (age_years BETWEEN 3 AND 12),
  interests TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('parental_image', 'terms', 'marketing')),
  policy_version TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('reference_photo', 'character_base', 'scene_page', 'export_pdf', 'export_video')),
  storage_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  width_px INT,
  height_px INT,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('uploading', 'ready', 'processing', 'failed', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  purge_after TIMESTAMPTZ
);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  catalog_id TEXT,
  title TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ar', 'en')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'ordered', 'archived')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  page_index INT NOT NULL,
  text_ar TEXT,
  text_en TEXT,
  scene_asset_id UUID REFERENCES assets(id),
  UNIQUE (story_id, page_index)
);

CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('character_base', 'scene_pages', 'story_draft', 'tts', 'video')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'ready', 'failed', 'cancelled')),
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('digital', 'print', 'video', 'bundle')),
  price_omr_fils INT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE RESTRICT,
  product_id TEXT NOT NULL REFERENCES products(id),
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'awaiting_payment', 'paid', 'fulfilled', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded')),
  currency TEXT NOT NULL DEFAULT 'OMR',
  amount_fils INT NOT NULL,
  shipping JSONB,
  provider_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

INSERT INTO products (id, name_ar, name_en, kind, price_omr_fils) VALUES
  ('digital', 'الحكاية الرقمية', 'Digital story', 'digital', 4900),
  ('print', 'كتاب الحكاية المطبوع', 'Printed storybook', 'print', 14900),
  ('video', 'الحكاية السينمائية', 'Cinematic story', 'video', 9900),
  ('bundle', 'حزمة الذكرى', 'Keepsake bundle', 'bundle', 24900)
ON CONFLICT (id) DO NOTHING;
