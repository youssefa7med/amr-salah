-- Fix Settings Table: Rename columns to camelCase and update RLS

-- Rename columns to camelCase if they still exist as lowercase
ALTER TABLE settings 
RENAME COLUMN updatedat TO "updatedAt";

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON settings;

-- Create proper RLS policies for settings table
CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON settings FOR DELETE USING (true);

-- Verify the settings table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'settings'
ORDER BY column_name;
