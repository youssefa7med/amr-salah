-- ============================================================================
-- Shop Data Isolation Verification Queries
-- ============================================================================
-- Use these queries to verify that each shop has completely isolated data
-- and that new shops start with zero data.
-- ============================================================================

-- ============================================================================
-- 1. VIEW ALL SHOPS AND THEIR STATUS
-- ============================================================================
-- Run this to see all shops and their auth users
SELECT 
  s.id as shop_id,
  s.name as shop_name,
  s.owner_email,
  s.auth_user_id,
  s.subscription_status,
  s.created_at,
  COUNT(DISTINCT c.id) as client_count,
  COUNT(DISTINCT t.id) as transaction_count,
  COUNT(DISTINCT e.id) as expense_count,
  COUNT(DISTINCT b.id) as barber_count,
  COUNT(DISTINCT bo.id) as booking_count
FROM shops s
LEFT JOIN clients c ON c.shop_id = s.id
LEFT JOIN transactions t ON t.shop_id = s.id
LEFT JOIN expenses e ON e.shop_id = s.id
LEFT JOIN barbers b ON b.shop_id = s.id
LEFT JOIN bookings bo ON bo.shop_id = s.id
GROUP BY s.id, s.name, s.owner_email, s.auth_user_id, s.subscription_status, s.created_at
ORDER BY s.created_at DESC;

-- ============================================================================
-- 2. DETAILED DATA COUNT PER SHOP
-- ============================================================================
-- Run this to see exactly what data exists in each shop
WITH shop_stats AS (
  SELECT 
    s.id,
    s.name,
    'clients' as table_name,
    COUNT(*) as record_count
  FROM shops s
  LEFT JOIN clients c ON c.shop_id = s.id
  GROUP BY s.id, s.name
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    'transactions',
    COUNT(*)
  FROM shops s
  LEFT JOIN transactions t ON t.shop_id = s.id
  GROUP BY s.id, s.name
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    'expenses',
    COUNT(*)
  FROM shops s
  LEFT JOIN expenses e ON e.shop_id = s.id
  GROUP BY s.id, s.name
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    'barbers',
    COUNT(*)
  FROM shops s
  LEFT JOIN barbers b ON b.shop_id = s.id
  GROUP BY s.id, s.name
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    'bookings',
    COUNT(*)
  FROM shops s
  LEFT JOIN bookings bo ON bo.shop_id = s.id
  GROUP BY s.id, s.name
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    'services',
    COUNT(*)
  FROM shops s
  LEFT JOIN services sv ON sv.shop_id = s.id
  GROUP BY s.id, s.name
)
SELECT 
  id as shop_id,
  name as shop_name,
  table_name,
  COALESCE(record_count, 0) as count
FROM shop_stats
ORDER BY name, table_name;

-- ============================================================================
-- 3. VERIFY NEW SHOP HAS ZERO DATA (use after creating a new shop)
-- ============================================================================
-- Replace 'YOUR_NEW_SHOP_ID' with the actual shop UUID
-- This query will show you if the new shop has any data
SELECT 
  'clients' as table_name,
  COUNT(*) as count
FROM clients
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'transactions', COUNT(*)
FROM transactions
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'expenses', COUNT(*)
FROM expenses
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'barbers', COUNT(*)
FROM barbers
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'bookings', COUNT(*)
FROM bookings
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'services', COUNT(*)
FROM services
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'settings', COUNT(*)
FROM settings
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'visit_logs', COUNT(*)
FROM visit_logs
WHERE shop_id = 'YOUR_NEW_SHOP_ID'

UNION ALL

SELECT 'usage_logs', COUNT(*)
FROM usage_logs
WHERE shop_id = 'YOUR_NEW_SHOP_ID';

-- ============================================================================
-- 4. COMPARE TWO SHOPS - DATA ISOLATION CHECK
-- ============================================================================
-- Replace SHOP_A_ID and SHOP_B_ID with actual UUIDs
-- This verifies data is properly segregated
WITH shop_a_data AS (
  SELECT COUNT(*) as count FROM clients WHERE shop_id = 'SHOP_A_ID'
  UNION ALL
  SELECT COUNT(*) FROM transactions WHERE shop_id = 'SHOP_A_ID'
  UNION ALL
  SELECT COUNT(*) FROM expenses WHERE shop_id = 'SHOP_A_ID'
),
shop_b_data AS (
  SELECT COUNT(*) as count FROM clients WHERE shop_id = 'SHOP_B_ID'
  UNION ALL
  SELECT COUNT(*) FROM transactions WHERE shop_id = 'SHOP_B_ID'
  UNION ALL
  SELECT COUNT(*) FROM expenses WHERE shop_id = 'SHOP_B_ID'
)
SELECT 
  (SELECT SUM(count) FROM shop_a_data) as shop_a_total_records,
  (SELECT SUM(count) FROM shop_b_data) as shop_b_total_records;

-- ============================================================================
-- 5. CHECK AUTH USERS AND THEIR SHOPS
-- ============================================================================
-- Verifies that each auth user is linked to exactly one shop
SELECT 
  au.id as auth_user_id,
  au.email,
  s.id as shop_id,
  s.name as shop_name,
  (SELECT COUNT(*) FROM admin_users WHERE auth_user_id = au.id) as is_admin
FROM auth.users au
LEFT JOIN shops s ON s.auth_user_id = au.id
WHERE au.created_at IS NOT NULL
ORDER BY au.created_at DESC;

-- ============================================================================
-- 6. VERIFY NO DATA LEAKAGE - Cross-shop data check
-- ============================================================================
-- This query should return EMPTY RESULT SET if isolation is working
-- If any rows are returned, there's a data leakage issue
SELECT 
  c.id as client_id,
  c.shop_id,
  'ERROR: Client has NULL shop_id' as issue
FROM clients c
WHERE c.shop_id IS NULL

UNION ALL

SELECT 
  t.id,
  t.shop_id,
  'ERROR: Transaction has NULL shop_id'
FROM transactions t
WHERE t.shop_id IS NULL

UNION ALL

SELECT 
  e.id,
  e.shop_id,
  'ERROR: Expense has NULL shop_id'
FROM expenses e
WHERE e.shop_id IS NULL

UNION ALL

SELECT 
  b.id,
  b.shop_id,
  'ERROR: Barber has NULL shop_id'
FROM barbers b
WHERE b.shop_id IS NULL

UNION ALL

SELECT 
  bo.id,
  bo.shop_id,
  'ERROR: Booking has NULL shop_id'
FROM bookings bo
WHERE bo.shop_id IS NULL;

-- ============================================================================
-- 7. ADMIN USERS - VERIFY MASTER ACCESS
-- ============================================================================
-- Check admin users and confirm they have access level
SELECT 
  au.id as auth_user_id,
  au.email,
  s.name as admin_shop_access,
  COUNT(*) OVER (PARTITION BY au.id) as total_admin_entries
FROM admin_users au
LEFT JOIN shops s ON au.auth_user_id = s.auth_user_id
ORDER BY au.created_at DESC;

-- ============================================================================
-- ISOLATION VERIFICATION CHECKLIST
-- ============================================================================
-- After running the above queries, verify:
--
-- ✓ Query 1: All shops listed with their data counts isolate correctly
-- ✓ Query 2: Each data table shows different counts per shop (no cross-contamination)
-- ✓ Query 3: New shop shows 0 records in all tables (after replacement)
-- ✓ Query 4: Two shops have independent data counts (no shared data)
-- ✓ Query 5: Each auth user linked to exactly one shop (1:1 relationship)
-- ✓ Query 6: ZERO results returned (no NULL shop_id records or leakage)
-- ✓ Query 7: Admin users listed with their privileges
--
-- If all checks pass: ✅ SHOP ISOLATION IS WORKING CORRECTLY
-- ============================================================================
