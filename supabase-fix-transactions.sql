-- Fix transactions table - rename lowercase columns to camelCase

-- Columns that need renaming:
ALTER TABLE transactions RENAME COLUMN barberid TO "barberId";
ALTER TABLE transactions RENAME COLUMN clientid TO "clientId";
ALTER TABLE transactions RENAME COLUMN clientname TO "clientName";
ALTER TABLE transactions RENAME COLUMN clientphone TO "clientPhone";
ALTER TABLE transactions RENAME COLUMN discounttype TO "discountType";
ALTER TABLE transactions RENAME COLUMN paymentmethod TO "paymentMethod";
ALTER TABLE transactions RENAME COLUMN visitnumber TO "visitNumber";

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions'
ORDER BY column_name;
