-- Fix services table column names to camelCase

-- Rename lowercase name columns to camelCase
ALTER TABLE services RENAME COLUMN namear TO "nameAr";
ALTER TABLE services RENAME COLUMN nameen TO "nameEn";

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services'
ORDER BY column_name;
