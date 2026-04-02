-- ============================================================================
-- FIX SERVICES TABLE SCHEMA - Convert to camelCase columns
-- ============================================================================
-- This migration ensures services table has the correct column names
-- that match the TypeScript code expectations

DO $$ 
BEGIN
  -- First, disable RLS to allow modifications
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
    ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop service_variants table first (has foreign key to services)
DROP TABLE IF EXISTS public.service_variants CASCADE;

-- Drop and recreate services table with correct schema
DROP TABLE IF EXISTS public.services CASCADE;

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID,
  nameAr VARCHAR(255) NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER DEFAULT 30,
  category VARCHAR(50) DEFAULT 'haircut',
  active BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create service_variants table with correct schema
CREATE TABLE public.service_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  nameAr VARCHAR(255) NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_services_shop_id ON public.services(shop_id);
CREATE INDEX idx_services_active ON public.services(active);
CREATE INDEX idx_service_variants_service_id ON public.service_variants(service_id);

-- Add RLS policies (no shop_id check for now - can add later)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;

-- Allow all operations (permissive - can restrict later)
CREATE POLICY "services_allow_all" ON public.services
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "service_variants_allow_all" ON public.service_variants
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Also allow anonymous (for public pages)
CREATE POLICY "services_allow_anonymous" ON public.services
  FOR SELECT
  TO anon
  USING (TRUE);

CREATE POLICY "service_variants_allow_anonymous" ON public.service_variants
  FOR SELECT
  TO anon
  USING (TRUE);
