# Restaurant Inventory Management System

A secure, scalable inventory management web application built specifically for restaurants. Features include general stock tracking, high-value asset monitoring, expiry date tracking, and FIFO (First In, First Out) stock management.

## 🚀 Features

### Core Functionality
- **Inventory Dashboard**: Real-time view of all inventory items with alerts
- **Stock In**: Add new items or replenish existing inventory with batch tracking
- **Stock Out (FIFO)**: Deduct stock using First In, First Out methodology
- **High-Value Audit**: Nightly audit mode for expensive items (Whisky, Wagyu, etc.)
- **Expiry Tracking**: Automatic alerts for items expiring within 7 days
- **Low Stock Alerts**: Visual warnings when inventory falls below threshold
- **Transaction Logging**: Complete audit trail of all inventory movements

### Technical Highlights
- **Mobile-First Design**: Optimized for staff using tablets/phones in kitchen/storage
- **Real-Time Updates**: React Query for instant UI updates after mutations
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Secure**: Supabase Row Level Security (RLS) enabled
- **Scalable**: PostgreSQL backend with proper indexing

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: Tanstack Query (React Query)
- **Icons**: Lucide React
- **Utilities**: date-fns

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic understanding of React and Next.js

## 🔧 Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Navigate to **SQL Editor** in the left sidebar
4. Copy the contents of `supabase-schema.sql` and run it in the SQL Editor
5. Navigate to **Settings > API** and copy:
   - Project URL
   - Anon/Public Key

### 2. Environment Configuration

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Adding New Inventory (Stock In)

1. Click the **"Stock In"** button in the header
2. Choose between:
   - **Existing Item**: Add to an item already in the system
   - **New Item**: Create a brand new inventory item
3. For new items, fill in:
   - Name (e.g., "Wagyu Beef")
   - Category (e.g., "Meat")
   - Unit (e.g., "kg")
   - Check "High Value Item" for expensive items
   - Set minimum stock threshold for alerts
4. Enter batch details:
   - Quantity
   - Cost price (optional, for financial tracking)
   - Expiry date (optional, leave blank for non-perishables)
5. Click **"Add Stock"**

### Using Stock (Stock Out)

1. Find the item in the inventory table
2. Click the **"Use"** button
3. Enter the quantity to deduct
4. Add optional notes (e.g., "Used for dinner service")
5. Click **"Use Stock"**

The system automatically applies FIFO logic, deducting from the oldest batches first.

### Running an Audit

1. Click the **"Audit"** button in the header
2. You'll see all high-value items with expected counts
3. Perform a physical count and enter the **Actual Count**
4. If there's a discrepancy, the **Reason** field becomes required
5. Click **"Submit Audit"**

All discrepancies are logged in the transaction history with the "AUDIT_CORRECTION" type.

## 🗂️ Database Schema

### Tables

**items**
- Stores item definitions (name, category, unit, etc.)
- `is_high_value`: Flags items for audit tracking
- `min_stock_threshold`: Triggers low stock alerts

**batches**
- Represents physical stock on shelves
- Enables expiry tracking (FIFO)
- Links to items via `item_id`

**transaction_logs**
- Complete audit trail
- Action types: INBOUND, USAGE, AUDIT_CORRECTION, WASTE
- Tracks who performed action (when auth is enabled)

## 🎨 Project Structure

```
restaurant-inventory/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with QueryProvider
│   │   ├── page.tsx            # Main dashboard
│   │   └── globals.css         # Tailwind + Shadcn styles
│   ├── components/
│   │   ├── ui/                 # Shadcn/UI components
│   │   ├── stock-in-dialog.tsx # Stock In feature
│   │   ├── stock-out-dialog.tsx# Stock Out with FIFO
│   │   └── audit-dialog.tsx    # High-value audit
│   └── lib/
│       ├── supabase.ts         # Supabase client
│       ├── database.types.ts   # TypeScript types
│       ├── query-provider.tsx  # React Query setup
│       └── utils.ts            # Utility functions
├── supabase-schema.sql         # Database schema
├── .env.local                  # Environment variables
└── package.json
```

## 🚦 Key Features Explained

### FIFO Stock Management
When staff use stock, the system automatically deducts from the oldest batches first. This ensures proper stock rotation and minimizes waste from expired items.

### Expiry Alerts
Items with batches expiring within 7 days are highlighted with an orange badge. Staff can prioritize using these items first.

### Low Stock Alerts
When total stock falls below the configured threshold, a red badge appears to prompt reordering.

### Audit Trail
Every inventory movement (additions, usage, corrections) is logged with:
- Timestamp
- Action type
- Quantity change
- Optional notes
- User ID (when authentication is enabled)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Currently configured for authenticated users only
- Ready to integrate Supabase Auth when needed
- No sensitive data exposed in client code

## 🎯 Future Enhancements

- [ ] Barcode scanner integration
- [ ] User authentication with Supabase Auth
- [ ] Advanced reporting and analytics
- [ ] Multi-location support
- [ ] Automatic reorder suggestions
- [ ] Export to CSV/PDF
- [ ] Push notifications for critical alerts
- [ ] Recipe costing based on inventory prices

## 📝 Notes

- The app is mobile-first but works great on desktop too
- All buttons are finger-friendly (minimum 44x44px touch targets)
- React Query handles caching and optimistic updates
- TypeScript ensures type safety throughout the stack

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check that your Supabase URL and Anon Key are correct in `.env.local`
- Ensure you ran the SQL schema in Supabase
- Verify RLS policies are enabled

### Stock Out fails with "Insufficient stock"
- Check that the item has available batches
- Verify `quantity_remaining` is greater than 0 in the batches table

### Items not showing in dashboard
- Ensure items were created successfully
- Check browser console for errors
- Verify Supabase connection is working

## 📄 License

MIT License - Feel free to use for your restaurant or modify as needed.

---

**Built with ❤️ for restaurant efficiency**
