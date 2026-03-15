-- Migration: Add missing createdAt and updatedAt columns to existing tables

-- Add columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add columns to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add columns to services table (if not already present)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add columns to expenses table (if not already present)
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add columns to barbers table (if not already present)
ALTER TABLE barbers 
ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Verify columns were added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name IN ('clients', 'transactions', 'services', 'expenses', 'barbers')
ORDER BY table_name, ordinal_position;
