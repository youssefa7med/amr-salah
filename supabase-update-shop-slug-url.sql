-- ============================================================================
-- Fix shop slug - Use shop ID as permanent, static slug
-- ============================================================================

-- Set slug = shop ID (permanent, unique, never changes)
UPDATE shops
SET slug = id::text
WHERE slug IS NULL OR slug = 'ef8f12b6-de83-4043-84e6-f3a386262a5e';

-- Update portal_settings to use shop ID as portal_slug
UPDATE portal_settings
SET portal_slug = shop_id::text
WHERE portal_slug IS NULL OR portal_slug = 'ef8f12b6-de83-4043-84e6-f3a386262a5e';

-- Verify the changes
SELECT id, name, slug FROM shops;
SELECT shop_id, portal_slug FROM portal_settings;
