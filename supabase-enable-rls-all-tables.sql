-- ============================================================================
-- Row Level Security (RLS) Configuration for Multi-Tenant SaaS
-- ============================================================================
-- This file enables comprehensive RLS for all tables in the barber shop system.
-- Each shop can only access its own data, while admins have full visibility.
-- ============================================================================

-- ============================================================================
-- CLIENTS TABLE - Shop sees only its own clients
-- ============================================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_clients" ON clients;
DROP POLICY IF EXISTS "shop_insert_own_clients" ON clients;
DROP POLICY IF EXISTS "shop_update_own_clients" ON clients;
DROP POLICY IF EXISTS "shop_delete_own_clients" ON clients;

CREATE POLICY "shop_select_own_clients" ON clients
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_clients" ON clients
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_clients" ON clients
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_clients" ON clients
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- TRANSACTIONS TABLE - Shop sees only its own transactions
-- ============================================================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_transactions" ON transactions;
DROP POLICY IF EXISTS "shop_insert_own_transactions" ON transactions;
DROP POLICY IF EXISTS "shop_update_own_transactions" ON transactions;
DROP POLICY IF EXISTS "shop_delete_own_transactions" ON transactions;

CREATE POLICY "shop_select_own_transactions" ON transactions
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_transactions" ON transactions
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_transactions" ON transactions
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_transactions" ON transactions
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- EXPENSES TABLE - Shop sees only its own expenses
-- ============================================================================
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_expenses" ON expenses;
DROP POLICY IF EXISTS "shop_insert_own_expenses" ON expenses;
DROP POLICY IF EXISTS "shop_update_own_expenses" ON expenses;
DROP POLICY IF EXISTS "shop_delete_own_expenses" ON expenses;

CREATE POLICY "shop_select_own_expenses" ON expenses
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_expenses" ON expenses
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_expenses" ON expenses
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_expenses" ON expenses
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- BOOKINGS TABLE - Shop sees only its own bookings
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_bookings" ON bookings;
DROP POLICY IF EXISTS "shop_insert_own_bookings" ON bookings;
DROP POLICY IF EXISTS "shop_update_own_bookings" ON bookings;
DROP POLICY IF EXISTS "shop_delete_own_bookings" ON bookings;

CREATE POLICY "shop_select_own_bookings" ON bookings
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_bookings" ON bookings
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_bookings" ON bookings
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_bookings" ON bookings
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- BARBERS TABLE - Shop sees only its own barbers
-- ============================================================================
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_barbers" ON barbers;
DROP POLICY IF EXISTS "shop_insert_own_barbers" ON barbers;
DROP POLICY IF EXISTS "shop_update_own_barbers" ON barbers;
DROP POLICY IF EXISTS "shop_delete_own_barbers" ON barbers;

CREATE POLICY "shop_select_own_barbers" ON barbers
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_barbers" ON barbers
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_barbers" ON barbers
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_barbers" ON barbers
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- SETTINGS TABLE - Shop sees only its own settings
-- ============================================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_settings" ON settings;
DROP POLICY IF EXISTS "shop_insert_own_settings" ON settings;
DROP POLICY IF EXISTS "shop_update_own_settings" ON settings;
DROP POLICY IF EXISTS "shop_delete_own_settings" ON settings;

CREATE POLICY "shop_select_own_settings" ON settings
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_settings" ON settings
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_settings" ON settings
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_settings" ON settings
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- VISIT_LOGS TABLE - Shop sees only its own visit logs
-- ============================================================================
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_visit_logs" ON visit_logs;
DROP POLICY IF EXISTS "shop_insert_own_visit_logs" ON visit_logs;
DROP POLICY IF EXISTS "shop_update_own_visit_logs" ON visit_logs;
DROP POLICY IF EXISTS "shop_delete_own_visit_logs" ON visit_logs;

CREATE POLICY "shop_select_own_visit_logs" ON visit_logs
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_visit_logs" ON visit_logs
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_visit_logs" ON visit_logs
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_visit_logs" ON visit_logs
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- USAGE_LOGS TABLE - Shop sees only its own usage logs
-- ============================================================================
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_select_own_usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "shop_insert_own_usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "shop_update_own_usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "shop_delete_own_usage_logs" ON usage_logs;

CREATE POLICY "shop_select_own_usage_logs" ON usage_logs
FOR SELECT TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "shop_insert_own_usage_logs" ON usage_logs
FOR INSERT TO authenticated
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_update_own_usage_logs" ON usage_logs
FOR UPDATE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
)
WITH CHECK (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "shop_delete_own_usage_logs" ON usage_logs
FOR DELETE TO authenticated
USING (
  shop_id = (SELECT id FROM shops WHERE auth_user_id = auth.uid() LIMIT 1)
);

-- ============================================================================
-- PLANS TABLE - All authenticated users can READ, admins manage
-- ============================================================================
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "all_can_read_plans" ON plans;
DROP POLICY IF EXISTS "admin_manage_plans" ON plans;

CREATE POLICY "all_can_read_plans" ON plans
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "admin_manage_plans" ON plans
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- SHOPS TABLE - Each shop sees own row, admins see all
-- ============================================================================
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_sees_own_data" ON shops;
DROP POLICY IF EXISTS "admin_manage_shops" ON shops;

CREATE POLICY "shop_sees_own_data" ON shops
FOR SELECT TO authenticated
USING (
  auth_user_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "admin_manage_shops" ON shops
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- ADMIN_USERS TABLE - Admins only
-- ============================================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_manage_admin_users" ON admin_users;

CREATE POLICY "admin_manage_admin_users" ON admin_users
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- Summary of RLS Configuration
-- ============================================================================
-- ✓ clients - Shop sees only own data (+ admin sees all)
-- ✓ transactions - Shop sees only own data (+ admin sees all)
-- ✓ expenses - Shop sees only own data (+ admin sees all)
-- ✓ bookings - Shop sees only own data (+ admin sees all)
-- ✓ barbers - Shop sees only own data (+ admin sees all)
-- ✓ settings - Shop sees only own data (+ admin sees all)
-- ✓ visit_logs - Shop sees only own data (+ admin sees all)
-- ✓ usage_logs - Shop sees only own data (+ admin sees all)
-- ✓ plans - All authenticated users can read (admins manage)
-- ✓ shops - Shop sees own row (admin sees all)
-- ✓ admin_users - Admins only
-- ============================================================================
