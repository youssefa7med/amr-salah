-- Check what columns actually exist in clients table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY column_name;
