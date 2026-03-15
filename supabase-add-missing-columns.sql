-- Add missing columns to clients table

ALTER TABLE clients
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS totalVisits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS totalSpent DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS isVIP BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lastVisit DATE;

-- Verify the clients table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY column_name;
