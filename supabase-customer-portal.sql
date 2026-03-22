-- ============================================================================
-- Customer Portal Database Schema
-- ============================================================================
-- Creates tables and structures for the multi-template customer portal system.
-- Each shop can have its own portal with custom branding and templates.
-- ============================================================================

-- ============================================================================
-- 1. PORTAL_SETTINGS TABLE
-- ============================================================================
-- Stores portal configuration for each shop (colors, template, status, etc.)
CREATE TABLE IF NOT EXISTS portal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  
  -- Portal Status
  is_active BOOLEAN DEFAULT false,
  
  -- Template Selection (1-5)
  template_id INTEGER DEFAULT 1 CHECK (template_id >= 1 AND template_id <= 5),
  
  -- Color Customization (Hex colors)
  primary_color VARCHAR(7) DEFAULT '#FFD700', -- Gold default
  secondary_color VARCHAR(7) DEFAULT '#1E1E2E', -- Dark default
  accent_color VARCHAR(7) DEFAULT '#FF6B6B', -- Red default
  text_color VARCHAR(7) DEFAULT '#FFFFFF', -- White default
  
  -- Portal Branding
  logo_url TEXT,
  banner_url TEXT,
  welcome_message TEXT,
  
  -- Portal Metadata
  portal_slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(shop_id) -- One portal settings per shop
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_portal_settings_slug ON portal_settings(portal_slug);
CREATE INDEX IF NOT EXISTS idx_portal_settings_shop_id ON portal_settings(shop_id);

-- ============================================================================
-- 2. CUSTOMER_USERS TABLE
-- ============================================================================
-- Stores customer portal accounts linked to auth.users
CREATE TABLE IF NOT EXISTS customer_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Auth Relationship
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Shop Relationship
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  
  -- Customer Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  birth_date DATE,
  
  -- Link to existing client (if any)
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Profile Picture
  avatar_url TEXT,
  
  -- Preferences
  notifications_enabled BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'ar', -- 'ar' or 'en'
  
  -- Status
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate registrations per shop
  UNIQUE(shop_id, email),
  UNIQUE(shop_id, phone)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_users_auth_user_id ON customer_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customer_users_shop_id ON customer_users(shop_id);
CREATE INDEX IF NOT EXISTS idx_customer_users_client_id ON customer_users(client_id);
CREATE INDEX IF NOT EXISTS idx_customer_users_email ON customer_users(email);
CREATE INDEX IF NOT EXISTS idx_customer_users_phone ON customer_users(phone);

-- ============================================================================
-- 3. CUSTOMER_BOOKINGS TABLE
-- ============================================================================
-- Stores customer portal bookings (separate from staff bookings)
-- Links to bookings table where applicable
CREATE TABLE IF NOT EXISTS customer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  customer_user_id UUID NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  
  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  service_name VARCHAR(255) NOT NULL, -- Store name in case service is deleted
  barber_name VARCHAR(255),
  
  -- Status: pending | confirmed | cancelled | completed | no_show
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  booking_completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_bookings_shop_id ON customer_bookings(shop_id);
CREATE INDEX IF NOT EXISTS idx_customer_bookings_customer_user_id ON customer_bookings(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_customer_bookings_booking_date ON customer_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_customer_bookings_status ON customer_bookings(status);

-- ============================================================================
-- 4. PORTAL_TEMPLATE_VARS TABLE
-- ============================================================================
-- Stores template-specific customization variables per shop
CREATE TABLE IF NOT EXISTS portal_template_vars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationship
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL CHECK (template_id >= 1 AND template_id <= 5),
  
  -- Template-specific variables (stored as JSON for flexibility)
  variables JSONB DEFAULT '{}',
  
  -- Examples for variables:
  -- {
  --   "hero_title": "اسم المحل",
  --   "hero_subtitle": "رحباً بك",
  --   "button_bg_color": "#FFD700",
  --   "button_text_color": "#000000",
  --   "card_bg_opacity": 0.9,
  --   "font_style": "cairo", -- cairo, rubik, tajawal
  --   "layout_direction": "rtl",
  --   "feature_1_title": "Feature text",
  --   "show_testimonials": true
  -- }
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(shop_id, template_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_portal_template_vars_shop_id ON portal_template_vars(shop_id);

-- ============================================================================
-- 5. CUSTOMER_REVIEWS TABLE
-- ============================================================================
-- Stores customer reviews and ratings for the portal
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  customer_user_id UUID NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES customer_bookings(id) ON DELETE SET NULL,
  
  -- Review Data
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_reviews_shop_id ON customer_reviews(shop_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_customer_user_id ON customer_reviews(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_is_approved ON customer_reviews(is_approved);

-- ============================================================================
-- 6. PORTAL_ANALYTICS TABLE
-- ============================================================================
-- Tracks portal usage analytics (page views, conversions, etc.)
CREATE TABLE IF NOT EXISTS portal_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationship
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  
  -- Analytics Data
  event_type VARCHAR(100) NOT NULL, -- pageview, signup, login, booking, etc
  event_date DATE NOT NULL,
  event_timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Optional Customer Reference
  customer_user_id UUID REFERENCES customer_users(id) ON DELETE SET NULL,
  
  -- Event Metadata (stored as JSON)
  metadata JSONB DEFAULT '{}',
  
  -- Examples:
  -- pageview: { page: '/shop/slug/dashboard', device: 'mobile', browser: 'chrome' }
  -- signup: { method: 'email', from_page: '/shop/slug' }
  -- booking: { service_id: '...', barber_id: '...' }
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portal_analytics_shop_id ON portal_analytics(shop_id);
CREATE INDEX IF NOT EXISTS idx_portal_analytics_event_type ON portal_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_portal_analytics_event_date ON portal_analytics(event_date);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on portal tables
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_template_vars ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_analytics ENABLE ROW LEVEL SECURITY;

-- PORTAL_SETTINGS: Shop sees own portal settings
DROP POLICY IF EXISTS "shop_sees_own_portal_settings" ON portal_settings;
CREATE POLICY "shop_sees_own_portal_settings" ON portal_settings
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "shop_updates_own_portal_settings" ON portal_settings;
CREATE POLICY "shop_updates_own_portal_settings" ON portal_settings
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- CUSTOMER_USERS: Customers see own profile, shops see their customers
DROP POLICY IF EXISTS "customer_sees_own_profile" ON customer_users;
CREATE POLICY "customer_sees_own_profile" ON customer_users
FOR SELECT TO authenticated
USING (
  auth_user_id = auth.uid()
  OR
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "customer_updates_own_profile" ON customer_users;
CREATE POLICY "customer_updates_own_profile" ON customer_users
FOR UPDATE TO authenticated
USING (
  auth_user_id = auth.uid()
)
WITH CHECK (
  auth_user_id = auth.uid() AND
  shop_id = (SELECT shop_id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "shop_manages_customer_users" ON customer_users;
CREATE POLICY "shop_manages_customer_users" ON customer_users
FOR ALL TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- CUSTOMER_BOOKINGS: Customers see own bookings, shops see their bookings
DROP POLICY IF EXISTS "customer_sees_own_bookings" ON customer_bookings;
CREATE POLICY "customer_sees_own_bookings" ON customer_bookings
FOR SELECT TO authenticated
USING (
  customer_user_id = (SELECT id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "customer_creates_own_bookings" ON customer_bookings;
CREATE POLICY "customer_creates_own_bookings" ON customer_bookings
FOR INSERT TO authenticated
WITH CHECK (
  customer_user_id = (SELECT id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
);

DROP POLICY IF EXISTS "customer_updates_own_bookings" ON customer_bookings;
CREATE POLICY "customer_updates_own_bookings" ON customer_bookings
FOR UPDATE TO authenticated
USING (
  customer_user_id = (SELECT id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  customer_user_id = (SELECT id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- CUSTOMER_REVIEWS: Customers see own reviews, shops see their reviews
DROP POLICY IF EXISTS "customer_sees_own_reviews" ON customer_reviews;
CREATE POLICY "customer_sees_own_reviews" ON customer_reviews
FOR SELECT TO authenticated
USING (
  customer_user_id = (SELECT id FROM customer_users WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

-- PORTAL_ANALYTICS: Shops and admins only
DROP POLICY IF EXISTS "shop_sees_own_analytics" ON portal_analytics;
CREATE POLICY "shop_sees_own_analytics" ON portal_analytics
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "system_logs_analytics" ON portal_analytics;
CREATE POLICY "system_logs_analytics" ON portal_analytics
FOR INSERT TO authenticated
WITH CHECK (true); -- System can log any analytics

-- ============================================================================
-- 8. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Customer view with joined shop data
CREATE OR REPLACE VIEW customer_profile_view AS
SELECT 
  cu.id,
  cu.auth_user_id,
  cu.shop_id,
  cu.full_name,
  cu.email,
  cu.phone,
  cu.birth_date,
  cu.client_id,
  cu.notifications_enabled,
  cu.language,
  cu.verified,
  s.name as shop_name,
  ps.portal_slug,
  ps.template_id,
  ps.is_active as portal_active
FROM customer_users cu
JOIN shops s ON cu.shop_id = s.id
JOIN portal_settings ps ON cu.shop_id = ps.shop_id;

-- Customer bookings with full details
CREATE OR REPLACE VIEW customer_booking_details_view AS
SELECT 
  cb.id,
  cb.shop_id,
  cb.customer_user_id,
  cb.booking_date,
  cb.booking_time,
  cb.service_name,
  cb.barber_name,
  cb.status,
  cb.customer_notes,
  cb.created_at,
  cu.full_name as customer_name,
  cu.phone as customer_phone,
  s.name as shop_name,
  sv."nameAr" as service_name_ar,
  sv."nameEn" as service_name_en,
  b.name as barber_full_name
FROM customer_bookings cb
JOIN customer_users cu ON cb.customer_user_id = cu.id
JOIN shops s ON cb.shop_id = s.id
LEFT JOIN services sv ON cb.service_id = sv.id
LEFT JOIN barbers b ON cb.barber_id = b.id;

-- ============================================================================
-- 9. SUMMARY
-- ============================================================================
-- Tables created:
-- ✓ portal_settings - Portal configuration per shop
-- ✓ customer_users - Portal customer accounts
-- ✓ customer_bookings - Customer portal bookings
-- ✓ portal_template_vars - Template customization
-- ✓ customer_reviews - Customer reviews and ratings
-- ✓ portal_analytics - Usage analytics
-- ✓ RLS Policies - Full multi-tenant security
-- ✓ Views - Common query helpers
-- ============================================================================
