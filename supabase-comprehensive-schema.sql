-- =====================================================
-- COMPREHENSIVE RESTAURANT MANAGEMENT SCHEMA
-- Includes: Inventory, Menu, Sales, Financials, Reports
-- =====================================================

-- Drop existing tables
DROP TABLE IF EXISTS daily_item_sales CASCADE;
DROP TABLE IF EXISTS daily_summaries CASCADE;
DROP TABLE IF EXISTS cashbook_transactions CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS transaction_logs CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS items CASCADE;

-- =====================================================
-- 1. INGREDIENTS TABLE
-- Core inventory ingredients with tracking info
-- =====================================================
CREATE TABLE ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL, -- g, ml, count, etc.
  cost_per_unit NUMERIC(10,2) DEFAULT 0, -- Cost in MMK per unit
  current_stock NUMERIC(10,2) DEFAULT 0,
  min_stock_threshold NUMERIC(10,2) DEFAULT 0,
  category TEXT, -- Dairy, Meat, Vegetable, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. MENU ITEMS TABLE
-- Restaurant menu with pricing and metadata
-- =====================================================
CREATE TABLE menu_items (
  id TEXT PRIMARY KEY, -- e.g., 'F-001', 'D-001'
  name TEXT NOT NULL,
  menu_type TEXT NOT NULL, -- 'Food' or 'Drink'
  section TEXT NOT NULL, -- 'Pizza Grande', 'Beer Bottles', etc.
  unit_price NUMERIC(10,2) NOT NULL,
  unit_cost NUMERIC(10,2) NOT NULL,
  unit_gp NUMERIC(10,2) NOT NULL,
  cost_percentage NUMERIC(5,2), -- e.g., 35.00 for 35%
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. RECIPE INGREDIENTS (Junction Table)
-- Links menu items to their ingredient requirements
-- =====================================================
CREATE TABLE recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL, -- Matches ingredient column names from CSV
  quantity NUMERIC(10,2) NOT NULL, -- Amount needed per serving
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 4. DAILY ITEM SALES TABLE
-- Tracks sales of each menu item by date
-- =====================================================
CREATE TABLE daily_item_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  item_id TEXT REFERENCES menu_items(id),
  quantity_sold INTEGER DEFAULT 0,
  sales_amount NUMERIC(12,2) DEFAULT 0,
  cogs_amount NUMERIC(12,2) DEFAULT 0,
  gross_profit NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, item_id)
);

-- =====================================================
-- 5. DAILY SUMMARIES TABLE
-- Daily P&L and operational summary
-- =====================================================
CREATE TABLE daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  day_of_week TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_hours TEXT,
  hours_open NUMERIC(4,2),
  covers INTEGER DEFAULT 0, -- Number of customers
  net_sales NUMERIC(12,2) DEFAULT 0,
  cogs NUMERIC(12,2) DEFAULT 0,
  gross_profit NUMERIC(12,2) DEFAULT 0,
  
  -- Fixed Costs
  rent NUMERIC(12,2) DEFAULT 0,
  waiters_salaries NUMERIC(12,2) DEFAULT 0,
  chefs_salaries NUMERIC(12,2) DEFAULT 0,
  other_staff_salaries NUMERIC(12,2) DEFAULT 0,
  electricity_grid NUMERIC(12,2) DEFAULT 0,
  generator_fuel NUMERIC(12,2) DEFAULT 0,
  marketing_social NUMERIC(12,2) DEFAULT 0,
  maintenance_sanitation NUMERIC(12,2) DEFAULT 0,
  consumables NUMERIC(12,2) DEFAULT 0,
  fixed_opex_total NUMERIC(12,2) DEFAULT 0,
  
  -- Variable Costs
  card_fees NUMERIC(12,2) DEFAULT 0,
  bank_charges NUMERIC(12,2) DEFAULT 0,
  total_opex NUMERIC(12,2) DEFAULT 0,
  
  operating_profit NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. CASHBOOK TRANSACTIONS TABLE
-- Complete financial transaction log
-- =====================================================
CREATE TABLE cashbook_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  txn_id TEXT UNIQUE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  inflow NUMERIC(12,2) DEFAULT 0,
  outflow NUMERIC(12,2) DEFAULT 0,
  category TEXT NOT NULL, -- Sales Deposit, Rent, Suppliers, etc.
  reference TEXT,
  running_balance NUMERIC(14,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. LEGACY TABLES (Keep for backward compatibility)
-- =====================================================

-- Items table (original inventory system)
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  is_high_value BOOLEAN DEFAULT false,
  min_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Batches table (stock tracking)
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity_remaining NUMERIC NOT NULL CHECK (quantity_remaining >= 0),
  expiry_date DATE,
  cost_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transaction logs (audit trail)
CREATE TABLE transaction_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  action_type TEXT NOT NULL,
  quantity_change NUMERIC NOT NULL,
  performed_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_menu_items_section ON menu_items(section);
CREATE INDEX idx_recipe_ingredients_menu_item ON recipe_ingredients(menu_item_id);
CREATE INDEX idx_daily_item_sales_date ON daily_item_sales(date);
CREATE INDEX idx_daily_item_sales_item ON daily_item_sales(item_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);
CREATE INDEX idx_cashbook_date ON cashbook_transactions(date);
CREATE INDEX idx_cashbook_category ON cashbook_transactions(category);
CREATE INDEX idx_batches_item_id ON batches(item_id);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_transaction_logs_item_id ON transaction_logs(item_id);
CREATE INDEX idx_transaction_logs_created_at ON transaction_logs(created_at);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_item_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashbook_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES (Allow all for internal system)
-- =====================================================

-- Ingredients
CREATE POLICY "ingredients_all" ON ingredients FOR ALL USING (true) WITH CHECK (true);

-- Menu Items
CREATE POLICY "menu_items_all" ON menu_items FOR ALL USING (true) WITH CHECK (true);

-- Recipe Ingredients
CREATE POLICY "recipe_ingredients_all" ON recipe_ingredients FOR ALL USING (true) WITH CHECK (true);

-- Daily Item Sales
CREATE POLICY "daily_item_sales_all" ON daily_item_sales FOR ALL USING (true) WITH CHECK (true);

-- Daily Summaries
CREATE POLICY "daily_summaries_all" ON daily_summaries FOR ALL USING (true) WITH CHECK (true);

-- Cashbook Transactions
CREATE POLICY "cashbook_transactions_all" ON cashbook_transactions FOR ALL USING (true) WITH CHECK (true);

-- Items
CREATE POLICY "items_all" ON items FOR ALL USING (true) WITH CHECK (true);

-- Batches
CREATE POLICY "batches_all" ON batches FOR ALL USING (true) WITH CHECK (true);

-- Transaction Logs
CREATE POLICY "transaction_logs_all" ON transaction_logs FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to calculate ingredient consumption based on sales
CREATE OR REPLACE FUNCTION calculate_ingredient_consumption(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE(
  ingredient_name TEXT,
  total_consumption NUMERIC,
  unit TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ri.ingredient_name,
    SUM(dis.quantity_sold * ri.quantity) as total_consumption,
    i.unit
  FROM daily_item_sales dis
  JOIN recipe_ingredients ri ON dis.item_id = ri.menu_item_id
  LEFT JOIN ingredients i ON ri.ingredient_name = i.name
  WHERE dis.date BETWEEN start_date AND end_date
  GROUP BY ri.ingredient_name, i.unit
  ORDER BY total_consumption DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily sales summary
CREATE OR REPLACE FUNCTION get_sales_summary(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE(
  date DATE,
  total_sales NUMERIC,
  total_cogs NUMERIC,
  total_gp NUMERIC,
  gp_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dis.date,
    SUM(dis.sales_amount) as total_sales,
    SUM(dis.cogs_amount) as total_cogs,
    SUM(dis.gross_profit) as total_gp,
    CASE 
      WHEN SUM(dis.sales_amount) > 0 
      THEN (SUM(dis.gross_profit) / SUM(dis.sales_amount) * 100)
      ELSE 0 
    END as gp_percentage
  FROM daily_item_sales dis
  WHERE dis.date BETWEEN start_date AND end_date
  GROUP BY dis.date
  ORDER BY dis.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get top selling items
CREATE OR REPLACE FUNCTION get_top_items(
  start_date DATE,
  end_date DATE,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  item_id TEXT,
  item_name TEXT,
  total_quantity INTEGER,
  total_sales NUMERIC,
  total_profit NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dis.item_id,
    mi.name as item_name,
    SUM(dis.quantity_sold)::INTEGER as total_quantity,
    SUM(dis.sales_amount) as total_sales,
    SUM(dis.gross_profit) as total_profit
  FROM daily_item_sales dis
  JOIN menu_items mi ON dis.item_id = mi.id
  WHERE dis.date BETWEEN start_date AND end_date
  GROUP BY dis.item_id, mi.name
  ORDER BY total_sales DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
