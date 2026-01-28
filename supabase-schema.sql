-- Restaurant Inventory Database Schema

-- 1. Items (The definition of a product)
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Vegetable', 'Alcohol', 'Meat'
  unit TEXT NOT NULL, -- e.g., 'kg', 'bottle', 'can'
  is_high_value BOOLEAN DEFAULT false, -- TRUE for Whisky/Wagyu
  min_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Batches (The actual stock sitting on the shelf)
-- This enables Expiry Tracking. When stock is added, a batch is created.
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity_remaining NUMERIC NOT NULL CHECK (quantity_remaining >= 0),
  expiry_date DATE, -- Nullable for non-perishables (like napkins)
  cost_price NUMERIC, -- For financial tracking
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Audit Logs (Theft Prevention & History)
-- Every time stock changes (Used, Added, Spilled, Stolen), it goes here.
CREATE TABLE transaction_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  action_type TEXT NOT NULL, -- 'INBOUND', 'USAGE', 'AUDIT_CORRECTION', 'WASTE'
  quantity_change NUMERIC NOT NULL, -- Positive for IN, Negative for OUT
  performed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_batches_item_id ON batches(item_id);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_transaction_logs_item_id ON transaction_logs(item_id);
CREATE INDEX idx_transaction_logs_created_at ON transaction_logs(created_at);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow authenticated users to perform all operations)
CREATE POLICY "Enable all for authenticated users" ON items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON batches
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON transaction_logs
  FOR ALL USING (auth.role() = 'authenticated');
