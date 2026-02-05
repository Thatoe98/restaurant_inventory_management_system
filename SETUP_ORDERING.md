# Quick Setup Instructions

## 1. Create the Orders Table in Supabase

Copy and run the SQL from `supabase-orders-schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Create a new query
4. Paste the contents of `supabase-orders-schema.sql`
5. Click "Run"

## 2. Start the Development Server

If not already running:
```powershell
npm run dev
```

## 3. Test the System

### Test Customer Ordering:
1. Open `http://localhost:3000/menu-order`
2. Browse menu items
3. Add items to cart
4. Place an order

### Test Staff Order Management:
1. Open `http://localhost:3000/orders` (in another tab/window)
2. Enable notifications
3. Watch for the order you just placed
4. Update order status through the workflow

## 4. Access from Dashboard

From the main dashboard (`http://localhost:3000`):
- Click "Customer Menu" card (amber colored)
- Click "Order Management" card (rose colored)

## QR Code Setup (Optional - Future)

To add table-specific QR codes:

1. Generate QR codes pointing to:
   - Table 1: `http://localhost:3000/menu-order?table=1`
   - Table 2: `http://localhost:3000/menu-order?table=2`
   - etc.

2. Update the menu-order page to read table number from URL

That's it! The system is ready to use.
