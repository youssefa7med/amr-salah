-- Add service variants/types table

CREATE TABLE IF NOT EXISTS service_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "serviceId" UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  "nameAr" VARCHAR(255) NOT NULL,
  "nameEn" VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_service_variants_serviceId ON service_variants("serviceId");
CREATE INDEX IF NOT EXISTS idx_service_variants_active ON service_variants("isActive");

-- Enable RLS
ALTER TABLE service_variants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON service_variants FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON service_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON service_variants FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON service_variants FOR DELETE USING (true);

-- Verify table was created
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'service_variants'
ORDER BY column_name;
