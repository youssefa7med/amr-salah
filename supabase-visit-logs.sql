-- Add visit_logs table for detailed visit history

CREATE TABLE IF NOT EXISTS visit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientId" UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  "clientName" VARCHAR(255) NOT NULL,
  "visitDate" DATE NOT NULL,
  "visitTime" VARCHAR(5) NOT NULL,
  "servicesCount" INTEGER DEFAULT 0,
  "totalSpent" DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_visit_logs_clientId ON visit_logs("clientId");
CREATE INDEX idx_visit_logs_visitDate ON visit_logs("visitDate");

-- Enable RLS
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON visit_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON visit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON visit_logs FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON visit_logs FOR DELETE USING (true);

-- Verify table was created
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'visit_logs'
ORDER BY column_name;
