-- ============================================================================
-- DEBUG: Check portal user email format issue
-- ============================================================================

-- Query 1: Check the exact email stored for portal users
SELECT 
  id,
  shop_id,
  phone,
  email,
  name,
  created_at,
  updated_at
FROM portal_users
WHERE phone = '01000139411'
LIMIT 5;

-- Query 2: Check all portal users and their email formats
SELECT 
  id,
  phone,
  email,
  CASE 
    WHEN email LIKE '%@%.portal' THEN '✅ Correct format: phone@shopId.portal'
    WHEN email LIKE 'google@gmail.com%' THEN '❌ Old format: google@gmail.com (needs fix)'
    ELSE '❓ Other: ' || email
  END as email_format_check,
  shop_id
FROM portal_users
ORDER BY created_at;

-- Query 3: Check auth users (in case metadata helps)
-- Note: You may not have direct access to auth.users, but we can verify via portal_users linkage
SELECT 
  id as portal_user_id,
  phone,
  email,
  name
FROM portal_users
WHERE shop_id = 'ef8f12b6-de83-4043-84e6-f3a386262a5e'
ORDER BY created_at;
