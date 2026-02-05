-- Active Orders Table (for customer ordering system)
-- Orders only persist during dining session, not permanent storage

CREATE TABLE IF NOT EXISTS active_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL DEFAULT 1,
  order_number TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_active_orders_status ON active_orders(status);
CREATE INDEX IF NOT EXISTS idx_active_orders_table ON active_orders(table_number);
CREATE INDEX IF NOT EXISTS idx_active_orders_created ON active_orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE active_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since it's for internal restaurant use)
CREATE POLICY "Enable read access for all users" ON active_orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON active_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON active_orders
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON active_orders
  FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_active_orders_updated_at
  BEFORE UPDATE ON active_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data structure for items field:
-- [
--   {
--     "id": "F-001",
--     "name": "Margherita Pizza",
--     "quantity": 2,
--     "unit_price": 12000,
--     "subtotal": 24000,
--     "notes": "No basil"
--   }
-- ]

COMMENT ON TABLE active_orders IS 'Temporary orders table for customer ordering system. Orders cleared after completion.';
COMMENT ON COLUMN active_orders.status IS 'pending, preparing, ready, completed, cancelled';
COMMENT ON COLUMN active_orders.items IS 'JSON array of order items with quantities and prices';
