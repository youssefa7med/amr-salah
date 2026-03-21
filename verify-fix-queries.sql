-- ============================================
-- VERIFICATION QUERIES FOR AMBIGUOUS COLUMN FIX
-- ============================================
-- Run these queries in Supabase SQL Editor to verify the fix

-- 1. Verify the function was updated correctly
-- Should show v_price_per_unit in the routine definition
SELECT routine_name, 
       routine_definition,
       created_time
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'log_transaction_usage'
LIMIT 1;

-- 2. Check recent usage_logs entries (should have new entries from successful transactions)
SELECT 
  id,
  shop_id,
  action_type,
  quantity,
  billable_amount,
  reference_id,
  year_month,
  created_at
FROM usage_logs
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check for other potential naming conflicts in functions
-- Look for variables that shadow table columns
SELECT routine_name, 
       routine_schema,
       routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_definition LIKE '%SELECT%INTO%'
ORDER BY routine_name;

-- 4. Verify function compiles without errors
-- Try to call the function on a sample transaction (won't break anything since nothing will trigger the action)
-- SELECT log_transaction_usage();

-- 5. Check the trigger is still attached
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table = 'transactions';

-- 6. Verify recent transactions with usage logs created
SELECT 
  t.id as transaction_id,
  t.clientId,
  t.clientName,
  t.total,
  t.createdAt,
  ul.id as usage_log_id,
  ul.quantity,
  ul.billable_amount,
  ul.created_at as logged_at
FROM transactions t
LEFT JOIN usage_logs ul ON t.id = ul.reference_id
ORDER BY t.createdAt DESC
LIMIT 10;
