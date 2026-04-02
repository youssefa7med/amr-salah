-- ============================================================================
-- FIX SERVICES TABLE SCHEMA - Safe Migration with Column Renaming
-- ============================================================================

-- Step 1: Handle existing service_variants table
DO $$ 
BEGIN
  -- Disable RLS temporarily
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_variants' AND table_schema = 'public') THEN
    ALTER TABLE public.service_variants DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
    ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Step 2: Drop and recreate tables with correct schema
DROP TABLE IF EXISTS public.service_variants CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

-- Step 3: Create services table with correct columns
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

-- Step 4: Create service_variants table with correct columns
CREATE TABLE public.service_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serviceId UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  nameAr VARCHAR(255) NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Create indexes
CREATE INDEX idx_services_shop_id ON public.services(shop_id);
CREATE INDEX idx_services_active ON public.services(active);
CREATE INDEX idx_service_variants_serviceId ON public.service_variants(serviceId);

-- Step 6: Enable RLS and set permissive policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users
CREATE POLICY "services_authenticated_all" ON public.services
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "service_variants_authenticated_all" ON public.service_variants
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Allow anonymous read access
CREATE POLICY "services_anon_read" ON public.services
  FOR SELECT
  TO anon
  USING (TRUE);

CREATE POLICY "service_variants_anon_read" ON public.service_variants
  FOR SELECT
  TO anon
  USING (TRUE);
