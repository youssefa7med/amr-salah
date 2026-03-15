-- Complete fix for clients table with proper camelCase columns

-- First, backup existing data
CREATE TABLE clients_backup AS SELECT * FROM clients;

-- Drop the old table
DROP TABLE IF EXISTS clients CASCADE;

-- Create clients table with correct schema
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  birthday DATE,
  notes TEXT,
  "totalVisits" INTEGER DEFAULT 0,
  "totalSpent" DECIMAL(10, 2) DEFAULT 0,
  "isVIP" BOOLEAN DEFAULT FALSE,
  "lastVisit" DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restore data if it exists
INSERT INTO clients (id, name, phone, birthday, notes, "totalVisits", "totalSpent", "isVIP", "lastVisit", "createdAt", "updatedAt")
SELECT 
  id, 
  name, 
  phone, 
  COALESCE(birthday, NULL),
  COALESCE(notes, NULL),
  COALESCE("totalVisits", 0),
  COALESCE("totalSpent", 0),
  COALESCE("isVIP", FALSE),
  COALESCE("lastVisit", NULL),
  COALESCE("createdAt", NOW()),
  COALESCE("updatedAt", NOW())
FROM clients_backup;

-- Drop backup
DROP TABLE clients_backup;

-- Create indexes
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_isVIP ON clients("isVIP");

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON clients;
DROP POLICY IF EXISTS "Enable insert access for all users" ON clients;
DROP POLICY IF EXISTS "Enable update access for all users" ON clients;
DROP POLICY IF EXISTS "Enable delete access for all users" ON clients;

CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY column_name;
