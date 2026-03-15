-- Fix: Rename lowercase columns to camelCase

-- Clients table
ALTER TABLE clients 
RENAME COLUMN createdat TO "createdAt";

ALTER TABLE clients 
RENAME COLUMN updatedat TO "updatedAt";

-- Transactions table
ALTER TABLE transactions 
RENAME COLUMN createdat TO "createdAt";

ALTER TABLE transactions 
RENAME COLUMN updatedat TO "updatedAt";

-- Services table
ALTER TABLE services 
RENAME COLUMN createdat TO "createdAt";

ALTER TABLE services 
RENAME COLUMN updatedat TO "updatedAt";

-- Expenses table
ALTER TABLE expenses 
RENAME COLUMN createdat TO "createdAt";

ALTER TABLE expenses 
RENAME COLUMN updatedat TO "updatedAt";

-- Barbers table
ALTER TABLE barbers 
RENAME COLUMN createdat TO "createdAt";

ALTER TABLE barbers 
RENAME COLUMN updatedat TO "updatedAt";

-- Verify the rename worked
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'clients' 
AND column_name IN ('"createdAt"', '"updatedAt"')
ORDER BY column_name;
