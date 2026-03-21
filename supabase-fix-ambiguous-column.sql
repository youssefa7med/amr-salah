-- ============================================
-- FIX: Resolve Ambiguous Column Reference Error
-- ============================================
-- Root Cause: Local variable 'price_per_unit' conflicts with column 'price_per_unit' in plans table
-- PostgreSQL cannot determine which one to use in the SELECT INTO statement
-- Solution: Rename local variable to v_price_per_unit

CREATE OR REPLACE FUNCTION log_transaction_usage()
RETURNS TRIGGER AS $$
DECLARE
  plan_pricing_type VARCHAR(50);
  v_price_per_unit DECIMAL(10, 2);  -- FIXED: Renamed from price_per_unit to v_price_per_unit
  unit_count INTEGER;
  billable_amount DECIMAL(10, 2);
  year_month VARCHAR(7);
BEGIN
  -- Get shop's plan pricing type
  SELECT pricing_type, price_per_unit
  INTO plan_pricing_type, v_price_per_unit  -- FIXED: Now stores into v_price_per_unit
  FROM plans
  WHERE id = (
    SELECT plan_id FROM shops WHERE id = NEW.shop_id LIMIT 1
  );

  -- Calculate year_month for grouping
  year_month := TO_CHAR(NEW.date::TIMESTAMP, 'YYYY-MM');

  -- Calculate units based on pricing type
  IF plan_pricing_type = 'per_transaction' THEN
    unit_count := 1;
    billable_amount := v_price_per_unit * 1;  -- FIXED: Using v_price_per_unit
    
  ELSIF plan_pricing_type = 'per_service' THEN
    -- Count items in transaction (from JSONB items array)
    unit_count := COALESCE(jsonb_array_length(NEW.items), 0);
    billable_amount := v_price_per_unit * unit_count;  -- FIXED: Using v_price_per_unit
    
  ELSIF plan_pricing_type = 'quota' THEN
    -- For quota, track as 1 unit per transaction
    unit_count := 1;
    billable_amount := 0;  -- Not used in quota billing
  ELSE
    unit_count := 1;
    billable_amount := 0;
  END IF;

  -- Insert into usage_logs
  INSERT INTO usage_logs (
    shop_id,
    action_type,
    quantity,
    billable_amount,
    reference_id,
    year_month,
    created_at
  ) VALUES (
    NEW.shop_id,
    'transaction',
    unit_count,
    billable_amount,
    NEW.id,
    year_month,
    CURRENT_TIMESTAMP
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify the fix
-- SELECT routine_name, routine_definition FROM information_schema.routines 
-- WHERE routine_schema = 'public' AND routine_name = 'log_transaction_usage';
