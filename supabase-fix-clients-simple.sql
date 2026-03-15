-- Simple fix: Add missing columns with lowercase names, then rename to camelCase

-- Add missing columns to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS totalvisits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS totalspent DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS isvip BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lastvisit DATE;

-- Rename lowercase columns to camelCase
ALTER TABLE clients RENAME COLUMN totalvisits TO "totalVisits";
ALTER TABLE clients RENAME COLUMN totalspent TO "totalSpent";
ALTER TABLE clients RENAME COLUMN isvip TO "isVIP";
ALTER TABLE clients RENAME COLUMN lastvisit TO "lastVisit";

-- Verify the structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY column_name;
