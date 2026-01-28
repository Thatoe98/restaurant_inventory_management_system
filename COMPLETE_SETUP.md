# 🍽️ Restaurant Management System - Complete Setup Guide

## ✨ What's Been Built

A comprehensive restaurant management system with:

### 📊 **Dashboard** - Real-time Business Intelligence
- Today's sales, profit, and customer count
- Month-to-date performance metrics
- Top-selling menu items
- Recent sales trends
- 90-day period analysis
- Quick navigation to all modules

### 📋 **Menu Management**
- Browse all menu items (60+ items)
- Filter by section (Pizza, Drinks, Pub Snacks, etc.)
- Search functionality
- View pricing, costs, and profit margins
- Cost percentage analysis
- Summary statistics

### 💰 **Sales Analytics**
- Daily sales breakdown
- Top 20 performing items
- Customizable date ranges
- Sales vs profit analysis
- Customer cover tracking
- Profit margin calculations

### 📈 **Financial Reports**
- Complete P&L statements
- Revenue analysis
- Cost of sales breakdown
- Operating expenses detail
- Cashbook transactions (last 50)
- Exportable reports

### 📦 **Legacy Inventory System**
- Stock tracking with batches
- Expiry date monitoring
- Low stock alerts
- High-value item audit
- FIFO stock usage
- Transaction logging

### 📥 **Data Import**
- CSV import functionality
- Menu items & recipes
- Daily sales data
- Daily summaries (P&L)
- Cashbook transactions
- Ingredient initialization

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project: "restaurant-inventory"
3. Wait ~2 minutes for provisioning
4. Open **SQL Editor** in Supabase dashboard
5. Copy entire contents of `supabase-comprehensive-schema.sql`
6. Paste and click **Run** (or Ctrl/Cmd + Enter)
7. Verify "Success" message

### 3. Configure Environment Variables

1. In Supabase, go to **Settings** → **API**
2. Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy **anon public** key (long string starting with `eyJ...`)
4. Open `.env.local` file
5. Replace placeholders with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Import Sample Data

The system includes 90 days of realistic restaurant data (Feb-Apr 2026):
- **60+ menu items** (pizzas, drinks, appetizers)
- **4,455 daily sales transactions**
- **89 daily P&L summaries**
- **217 cashbook entries**
- **35 ingredients** with recipes

### Import Steps:

1. Navigate to **Import Data** from dashboard
2. Click "Initialize Ingredients" button
3. Upload CSV files in this order:
   - `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Menu (1).csv`
   - `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Item_Sales.csv`
   - `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Summary.csv`
   - `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Cashbook_Audit.csv`

**Note:** CSV files are in your workspace root directory.

## 📁 Project Structure

```
restaurant-inventory/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main Dashboard
│   │   ├── menu/page.tsx         # Menu Management
│   │   ├── sales/page.tsx        # Sales Analytics
│   │   ├── reports/page.tsx      # Financial Reports
│   │   ├── inventory/page.tsx    # Legacy Inventory
│   │   └── import/page.tsx       # CSV Data Import
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── stock-in-dialog.tsx
│   │   ├── stock-out-dialog.tsx
│   │   └── audit-dialog.tsx
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       ├── database.types.ts     # TypeScript types
│       ├── csv-import.ts         # Import utilities
│       └── utils.ts
├── supabase-comprehensive-schema.sql  # NEW Database schema
├── supabase-schema-fixed.sql         # Old inventory schema
└── .env.local                         # Your credentials

```

## 🗄️ Database Schema

### Core Tables:

- **`ingredients`** - Ingredient inventory (flour, tomato sauce, etc.)
- **`menu_items`** - Restaurant menu (pizzas, drinks, etc.)
- **`recipe_ingredients`** - Recipe definitions (junction table)
- **`daily_item_sales`** - Item-level sales by date
- **`daily_summaries`** - Daily P&L statements
- **`cashbook_transactions`** - Financial transactions
- **`items`** - Legacy inventory items
- **`batches`** - Stock batches with expiry dates
- **`transaction_logs`** - Audit trail

### Helper Functions:

- `calculate_ingredient_consumption(start_date, end_date)`
- `get_sales_summary(start_date, end_date)`
- `get_top_items(start_date, end_date, limit)`

## 🎨 Features & UI Highlights

### Dashboard
- **Gradient design** with professional color scheme
- **Responsive layout** - works on mobile, tablet, desktop
- **Interactive cards** with hover effects
- **Real-time calculations** from live data
- **Quick navigation** to all modules

### Menu Management
- **Grid layout** with beautiful cards
- **Color-coded** by menu type (Food/Drink)
- **Cost percentage indicators** (green/yellow/red)
- **Filter by section** with button toggles
- **Search functionality**

### Sales Analytics
- **Sortable tables** with performance metrics
- **Date range filters**
- **Top 20 items** by revenue
- **Daily breakdown** with profit trends
- **Visual indicators** (arrows for up/down)

### Financial Reports
- **Professional P&L layout**
- **Organized by section** (Revenue, COGS, OpEx)
- **Color-coded** amounts (green profit, red expense)
- **Cashbook integration**
- **Export ready** structure

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui
- **State:** TanStack Query (React Query)
- **Icons:** Lucide React
- **Date:** date-fns

## 📈 Sample Data Insights

The imported data represents a mid-scale restaurant:
- **Period:** Feb 1 - Apr 30, 2026 (90 days)
- **Total Sales:** ~200M MMK
- **Total Profit:** ~23M MMK
- **Avg Daily Sales:** ~2.2M MMK
- **Operating Days:** 74/90 (closures for holidays)
- **Avg Covers:** 84 customers/day
- **Menu Items:** 60+ (pizzas, drinks, snacks)
- **Top Seller:** Varies (check dashboard!)

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Management

View/edit data in Supabase:
1. Go to your project dashboard
2. Click **Table Editor**
3. Select table to view/edit

Run SQL queries:
1. Click **SQL Editor**
2. Write/paste query
3. Click **Run**

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add user authentication
- [ ] Implement ingredient consumption calculations
- [ ] Add charts/graphs for visualization
- [ ] Build order management module
- [ ] Create staff management
- [ ] Add table/reservation system
- [ ] Implement real-time POS integration
- [ ] Add mobile app (React Native)
- [ ] Generate PDF reports
- [ ] Add email notifications for low stock

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is running
- Check RLS policies are enabled (should auto-apply from schema)

### Import fails
- Ensure CSVs are in workspace root
- Check file names match exactly
- Run "Initialize Ingredients" first
- Try importing one file at a time

### Styles not loading
```bash
rm -rf .next
npm run dev
```

### Database errors
- Re-run `supabase-comprehensive-schema.sql`
- Check Supabase project is not paused
- Verify API keys are correct

## 📝 License

This project is for educational/internal use.

## 💬 Support

For issues or questions:
1. Check this README
2. Review QUICKSTART.md
3. Check Supabase documentation
4. Review PROJECT_SUMMARY.md

---

**Built with ❤️ for restaurant management excellence**
