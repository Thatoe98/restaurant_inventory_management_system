# Customer Ordering System

## Overview
This is a customer-facing ordering system integrated into the restaurant management workspace. Customers can browse the menu, add items to cart, and place orders. Staff can manage orders in real-time.

## Features

### Customer Menu (`/menu-order`)
- **Browse Menu**: View all menu items organized by category
- **Search**: Find items quickly by name
- **Category Filter**: Filter by Pizza Grande, Pizza Petite, Bruschetta, Pub Snacks, Desserts, Drinks, etc.
- **Shopping Cart**: Add/remove items, adjust quantities
- **Place Order**: Submit order to kitchen (currently Table 1)

### Staff Order Management (`/orders`)
- **Real-time Updates**: Orders appear instantly when placed
- **Order Status Tracking**: Pending → Preparing → Ready → Completed
- **Status Filters**: View orders by status
- **Audio Notifications**: Optional sound alerts for new orders
- **Order Actions**:
  - Start Preparing
  - Mark as Ready
  - Complete Order
  - Cancel Order
  - Delete completed/cancelled orders

## Database Setup

Run the SQL migration to create the orders table:

```sql
-- File: supabase-orders-schema.sql
-- Execute this in your Supabase SQL Editor
```

The schema creates:
- `active_orders` table with columns: id, table_number, order_number, items (JSONB), total_amount, status, notes, timestamps
- Indexes for performance
- Row Level Security policies
- Real-time subscription support

## Usage

### For Customers
1. Navigate to `/menu-order`
2. Browse menu by category or search
3. Click "+" to add items to cart
4. Click cart icon to review order
5. Adjust quantities or remove items
6. Click "Place Order"

### For Staff
1. Navigate to `/orders`
2. Enable notifications (bell icon) for audio alerts
3. New orders appear automatically
4. Update order status as you prepare food:
   - Click "Start Preparing" when you begin cooking
   - Click "Mark as Ready" when food is ready
   - Click "Complete Order" when served
5. Delete completed orders to keep the list clean

## Technical Details

### Order Flow
1. Customer adds items to cart (local state)
2. Customer places order → Creates record in `active_orders` table
3. Real-time subscription notifies staff page
4. Staff updates status through mutations
5. Orders persist until manually deleted (not saved long-term)

### Real-time Implementation
- Uses Supabase real-time subscriptions
- Polls every 5 seconds as backup
- Audio notifications using Web Audio API

### Data Structure

Order items stored as JSONB:
```json
[
  {
    "id": "F-001",
    "name": "Margherita Pizza",
    "quantity": 2,
    "unit_price": 12000,
    "subtotal": 24000,
    "notes": ""
  }
]
```

## Future Enhancements

### QR Code Table System
Currently hardcoded to Table 1. To add QR codes:

1. Generate QR codes for each table linking to `/menu-order?table=X`
2. Update `menu-order/page.tsx` to read table number from URL params:
```typescript
const searchParams = useSearchParams();
const tableNumber = parseInt(searchParams.get('table') || '1');
```
3. Pass `tableNumber` to order creation mutation

### Suggested Features
- Order history for customers
- Bill splitting
- Special requests/notes per item
- Estimated wait time
- Table service call button
- Kitchen display system (separate view)
- Order analytics

## Navigation

Access pages from:
- **Dashboard**: Two new cards in Quick Navigation section
  - "Customer Menu" (amber card)
  - "Order Management" (rose card)
- **Direct URLs**:
  - Customer: `http://localhost:3000/menu-order`
  - Staff: `http://localhost:3000/orders`

## Notes

- Orders are temporary (cleared after completion)
- No authentication required (internal restaurant use)
- Mobile-responsive design
- Real-time updates work best with WebSocket support enabled in Supabase
