-- =====================================================
-- UNIFIED RESTAURANT MANAGEMENT SCHEMA
-- Complete schema supporting all CSV files and frontend
-- Created: 2026-02-09
-- =====================================================

-- =====================================================
-- DROP ALL EXISTING TABLES (Clean slate)
-- =====================================================
DROP TABLE IF EXISTS inventory_daily_status CASCADE;
DROP TABLE IF EXISTS inventory_alerts CASCADE;
DROP TABLE IF EXISTS daily_ingredient_usage CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS active_orders CASCADE;
DROP TABLE IF EXISTS cashbook_transactions CASCADE;
DROP TABLE IF EXISTS daily_item_sales CASCADE;
DROP TABLE IF EXISTS daily_summaries CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS transaction_logs CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS items CASCADE;

-- =====================================================
-- 1. MENU ITEMS TABLE
-- Source: Menu (1).csv
-- Frontend: menu page, sales entry, menu-order
-- =====================================================
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid(),
  item_id TEXT PRIMARY KEY, -- 'F-001', 'D-001' from CSV
  menu_code TEXT NOT NULL,
  name TEXT NOT NULL,
  menu_type TEXT NOT NULL, -- 'Food' or 'Drink'
  section TEXT NOT NULL, -- 'Pizza Grande (11")', 'Pub Snacks', etc.
  portion_size TEXT,
  unit_price INTEGER NOT NULL, -- Price in MMK
  unit_cost INTEGER NOT NULL, -- Cost in MMK
  -- Auto-calculated fields
  unit_gp INTEGER GENERATED ALWAYS AS (unit_price - unit_cost) STORED,
  cost_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN unit_price > 0 THEN (unit_cost::NUMERIC / unit_price::NUMERIC * 100) ELSE 0 END
  ) STORED,
  is_high_value BOOLEAN DEFAULT false,
  has_expiry_tracking BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  storage_location TEXT,
  prep_station TEXT,
  lead_time_days INTEGER DEFAULT 2,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. INGREDIENTS TABLE
-- Source: inventory setting.csv
-- Frontend: ingredients page, dashboard
-- =====================================================
CREATE TABLE ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- e.g., 'Flour_g', 'Beef_g'
  category TEXT, -- 'Dry_Pantry', 'Protein_Fresh', 'Dairy_Egg', etc.
  unit TEXT NOT NULL, -- 'g', 'ml', 'count'
  current_stock NUMERIC(12,2) DEFAULT 0,
  min_stock_threshold NUMERIC(12,2) DEFAULT 0,
  max_stock_threshold NUMERIC(12,2) DEFAULT 0,
  unit_cost NUMERIC(10,2) DEFAULT 0,
  supplier_name TEXT,
  -- From inventory settings CSV
  avg_daily_usage NUMERIC(10,2),
  lead_time_days INTEGER DEFAULT 3,
  safety_stock_days INTEGER DEFAULT 7,
  reorder_point NUMERIC(12,2),
  target_stock_days INTEGER,
  target_stock_qty NUMERIC(12,2),
  shelf_life_days INTEGER,
  expiry_warn_days INTEGER DEFAULT 7,
  local_supplier_risk_note TEXT,
  last_restocked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. RECIPE INGREDIENTS (Junction Table)
-- Source: recipe assumptions.csv
-- Links menu items to ingredient requirements
-- =====================================================
CREATE TABLE recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL, -- References menu_items.item_id
  ingredient TEXT NOT NULL, -- Ingredient name like 'Flour_g'
  quantity_needed NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recipe_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_id, ingredient)
);

-- =====================================================
-- 4. DAILY ITEM SALES TABLE
-- Source: Daily_Item_Sales.csv
-- Frontend: dashboard, sales analytics
-- =====================================================
CREATE TABLE daily_item_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  item_id TEXT, -- References menu_items.item_id
  quantity_sold INTEGER DEFAULT 0,
  sales_amount NUMERIC(12,2) DEFAULT 0,
  cogs_amount NUMERIC(12,2) DEFAULT 0,
  gross_profit NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, item_id)
);

-- =====================================================
-- 5. DAILY SUMMARIES TABLE
-- Source: Daily_Summary.csv
-- Frontend: dashboard, sales analytics, reports
-- =====================================================
CREATE TABLE daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  day_of_week TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_hours TEXT,
  hours_open NUMERIC(4,2),
  covers INTEGER DEFAULT 0, -- Number of customers
  
  -- Revenue & COGS
  net_sales NUMERIC(12,2) DEFAULT 0,
  cogs NUMERIC(12,2) DEFAULT 0,
  gross_profit NUMERIC(12,2) DEFAULT 0,
  
  -- Fixed Operating Expenses
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
  
  -- Variable Expenses
  card_fees NUMERIC(12,2) DEFAULT 0,
  bank_charges NUMERIC(12,2) DEFAULT 0,
  total_opex NUMERIC(12,2) DEFAULT 0,
  
  -- Bottom Line
  operating_profit NUMERIC(12,2) DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. CASHBOOK TRANSACTIONS TABLE
-- Source: For future cashbook CSV imports
-- Frontend: reports page
-- =====================================================
CREATE TABLE cashbook_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  category TEXT NOT NULL, -- 'Revenue', 'Expense', 'Opening Balance', etc.
  subcategory TEXT,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT, -- 'Cash', 'KBZPay', 'Bank Transfer', etc.
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. DAILY INGREDIENT USAGE TABLE
-- Source: daily ingredi usage.csv
-- Tracks actual ingredient consumption per day
-- =====================================================
CREATE TABLE daily_ingredient_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  ingredient TEXT NOT NULL, -- e.g., 'Flour_g'
  uom TEXT NOT NULL, -- 'g', 'ml', 'count'
  total_qty NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, ingredient)
);

-- =====================================================
-- 8. INVENTORY ALERTS TABLE
-- Source: inventory alert.csv
-- Reorder alerts and expiry warnings
-- =====================================================
CREATE TABLE inventory_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  ingredient TEXT NOT NULL,
  closing_on_hand NUMERIC(12,2),
  on_order_qty NUMERIC(12,2) DEFAULT 0,
  reorder_point NUMERIC(12,2),
  qty_expiring_soon NUMERIC(12,2) DEFAULT 0,
  earliest_expiry_date DATE,
  suggested_action TEXT, -- 'REORDER', 'REORDER; SPOILAGE_WRITE_OFF', 'USE_FAST/DISCOUNT'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, ingredient)
);

-- =====================================================
-- 9. INVENTORY DAILY STATUS TABLE
-- Source: inventory daily status.csv
-- Complete daily inventory snapshot
-- =====================================================
CREATE TABLE inventory_daily_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  ingredient TEXT NOT NULL,
  uom TEXT NOT NULL,
  usage_today NUMERIC(12,2) DEFAULT 0,
  wastage_today NUMERIC(12,2) DEFAULT 0,
  closing_on_hand NUMERIC(12,2),
  on_order_qty NUMERIC(12,2) DEFAULT 0,
  reorder_point NUMERIC(12,2),
  reorder_flag BOOLEAN DEFAULT false,
  earliest_expiry_date DATE,
  qty_expiring_within_warn INTEGER DEFAULT 0,
  expiry_warn_days INTEGER,
  expiry_flag BOOLEAN DEFAULT false,
  suggested_action TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, ingredient)
);

-- =====================================================
-- 10. PURCHASE ORDERS TABLE
-- Source: purchase orders.csv
-- Tracks ingredient reordering
-- =====================================================
CREATE TABLE purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id TEXT UNIQUE NOT NULL, -- e.g., 'PO-20260201-Bread_g'
  ordered_date DATE NOT NULL,
  ingredient TEXT NOT NULL,
  qty NUMERIC(12,2) NOT NULL,
  uom TEXT NOT NULL,
  eta DATE,
  reason TEXT, -- 'Reorder point', 'Special order', etc.
  status TEXT DEFAULT 'ordered', -- 'ordered', 'received', 'cancelled'
  received_date DATE,
  received_qty NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 11. PAYROLL TABLE
-- Source: Payroll_Roster.csv
-- Employee salary information
-- =====================================================
CREATE TABLE payroll (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  headcount INTEGER NOT NULL,
  monthly_salary_per_person NUMERIC(12,2) NOT NULL,
  monthly_total NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 12. ACTIVE ORDERS TABLE (Customer ordering system)
-- Source: Frontend order management
-- Frontend: orders page, menu-order page
-- =====================================================
CREATE TABLE active_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  table_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'completed', 'cancelled'
  items JSONB NOT NULL, -- Array of {item_id, name, quantity, price}
  total_amount NUMERIC(12,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- LEGACY TABLES (for old stock management dialogs)
-- These support existing stock-in/stock-out components
-- =====================================================

-- Items (Legacy inventory)
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  is_high_value BOOLEAN DEFAULT false,
  min_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Batches (Legacy inventory with expiry)
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity_remaining NUMERIC NOT NULL CHECK (quantity_remaining >= 0),
  expiry_date DATE,
  cost_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transaction Logs (Legacy audit trail)
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

-- Menu Items
CREATE INDEX idx_menu_items_section ON menu_items(section);
CREATE INDEX idx_menu_items_menu_type ON menu_items(menu_type);
CREATE INDEX idx_menu_items_active ON menu_items(is_active);

-- Ingredients
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_name ON ingredients(name);

-- Recipe Ingredients
CREATE INDEX idx_recipe_item_id ON recipe_ingredients(item_id);
CREATE INDEX idx_recipe_ingredient ON recipe_ingredients(ingredient);

-- Daily Sales
CREATE INDEX idx_daily_item_sales_date ON daily_item_sales(date);
CREATE INDEX idx_daily_item_sales_item ON daily_item_sales(item_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);

-- Cashbook
CREATE INDEX idx_cashbook_date ON cashbook_transactions(date);
CREATE INDEX idx_cashbook_category ON cashbook_transactions(category);

-- Inventory Tracking
CREATE INDEX idx_daily_usage_date ON daily_ingredient_usage(date);
CREATE INDEX idx_daily_usage_ingredient ON daily_ingredient_usage(ingredient);
CREATE INDEX idx_inventory_alerts_date ON inventory_alerts(date);
CREATE INDEX idx_inventory_status_date ON inventory_daily_status(date);

-- Purchase Orders
CREATE INDEX idx_purchase_orders_date ON purchase_orders(ordered_date);
CREATE INDEX idx_purchase_orders_ingredient ON purchase_orders(ingredient);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- Active Orders
CREATE INDEX idx_active_orders_status ON active_orders(status);
CREATE INDEX idx_active_orders_created ON active_orders(created_at);

-- Legacy
CREATE INDEX idx_batches_item_id ON batches(item_id);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_transaction_logs_item_id ON transaction_logs(item_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
-- =====================================================

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_item_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashbook_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ingredient_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_daily_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Allow ALL operations (internal system)
-- =====================================================

-- Menu Items
CREATE POLICY "menu_items_all" ON menu_items FOR ALL USING (true) WITH CHECK (true);

-- Ingredients
CREATE POLICY "ingredients_all" ON ingredients FOR ALL USING (true) WITH CHECK (true);

-- Recipe Ingredients
CREATE POLICY "recipe_ingredients_all" ON recipe_ingredients FOR ALL USING (true) WITH CHECK (true);

-- Daily Sales
CREATE POLICY "daily_item_sales_all" ON daily_item_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "daily_summaries_all" ON daily_summaries FOR ALL USING (true) WITH CHECK (true);

-- Cashbook
CREATE POLICY "cashbook_all" ON cashbook_transactions FOR ALL USING (true) WITH CHECK (true);

-- Inventory Tracking
CREATE POLICY "daily_usage_all" ON daily_ingredient_usage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "inventory_alerts_all" ON inventory_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "inventory_status_all" ON inventory_daily_status FOR ALL USING (true) WITH CHECK (true);

-- Purchase Orders
CREATE POLICY "purchase_orders_all" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);

-- Payroll
CREATE POLICY "payroll_all" ON payroll FOR ALL USING (true) WITH CHECK (true);

-- Active Orders
CREATE POLICY "active_orders_all" ON active_orders FOR ALL USING (true) WITH CHECK (true);

-- Legacy Tables
CREATE POLICY "items_all" ON items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "batches_all" ON batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "transaction_logs_all" ON transaction_logs FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- DONE! Schema ready for all CSV imports
-- =====================================================
-- Tables created: 15 total
-- - 3 core (menu_items, ingredients, recipe_ingredients)
-- - 2 sales (daily_item_sales, daily_summaries)
-- - 5 inventory tracking (daily_usage, alerts, status, purchase_orders, payroll)
-- - 2 financial (cashbook_transactions, payroll)
-- - 1 ordering (active_orders)
-- - 3 legacy (items, batches, transaction_logs)
-- =====================================================
