# 🚀 QUICK START - Restaurant Management System

## ⚡ 3-Minute Setup

### Step 1: Database Setup (90 seconds)
1. Visit [supabase.com](https://supabase.com) → Sign in/Sign up
2. Click "New Project" → Name: "restaurant-inventory"
3. Choose a password → Click "Create Project"
4. Wait 2 minutes for database to provision

### Step 2: Run Database Schema (30 seconds)
1. In Supabase: Click **SQL Editor** (left sidebar)
2. Open file: `supabase-comprehensive-schema.sql` (in your project folder)
3. Copy **entire contents** of the file
4. Paste into SQL Editor
5. Click **RUN** button (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 3: Get API Credentials (15 seconds)
1. In Supabase: Click **Settings** → **API**
2. Copy **Project URL** (e.g., `https://abcdefgh.supabase.co`)
3. Copy **anon public** key (long string starting with `eyJ...`)

### Step 4: Configure Environment (15 seconds)
1. Open `.env.local` file in your project
2. Replace the placeholders:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp... (your actual key)
```
3. Save the file

### Step 5: Start the Application (10 seconds)
Open terminal in project folder and run:
```bash
npm run dev
```

Wait 5 seconds, then open: **http://localhost:3000**

---

## 📥 Import Sample Data (2 Minutes)

Once the app is running:

1. Click **"Import Data"** button on dashboard
2. Click **"Initialize"** button (sets up 35 ingredients)
3. Upload CSV files **in this order**:

**File 1: Menu Items**
- File: `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Menu (1).csv`
- Wait for "Success" message

**File 2: Daily Sales**
- File: `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Item_Sales.csv`
- Wait for "Success" message (might take 10-15 seconds)

**File 3: Daily Summaries**
- File: `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Summary.csv`
- Wait for "Success" message

**File 4: Cashbook**
- File: `Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Cashbook_Audit.csv`
- Wait for "Success" message

4. Click **"Back to Dashboard"**
5. **Refresh the page** to see all data!

---

## 🎯 What You'll See

### Dashboard (Home Page)
- **Today's Performance:** Sales, Profit, Covers, Low Stock
- **Month to Date:** Total Sales, Profit, Covers
- **Top Selling Items:** Top 5 by revenue
- **Recent Performance:** Last 7 days trend
- **Period Summary:** 90-day overview

### Menu Management
- 60+ menu items in beautiful cards
- Filter by section (Pizza, Drinks, etc.)
- Search functionality
- View prices, costs, margins

### Sales Analytics
- Daily sales breakdown
- Top 20 performing items
- Customizable date ranges
- Profit tracking

### Financial Reports
- Complete P&L statement
- Revenue & expense breakdown
- Cashbook transactions
- Export-ready format

### Legacy Inventory
- Stock tracking with batches
- Expiry date alerts
- Low stock warnings
- FIFO stock usage

---

## 🔧 Troubleshooting

### "Failed to fetch" or "Network Error"
**Fix:** Check `.env.local` file has correct credentials
```bash
# Should look like:
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### Import Not Working
**Fix 1:** Make sure CSV files are in project root folder
**Fix 2:** Click "Initialize Ingredients" first before uploading CSVs
**Fix 3:** Upload files one at a time, wait for success

### No Data Showing on Dashboard
**Fix 1:** After importing, **refresh the browser page** (F5)
**Fix 2:** Check Supabase Table Editor to verify data imported:
- Go to Supabase → Table Editor
- Click on "menu_items" table
- Should see 60+ rows

### Dev Server Won't Start
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
# Then open http://localhost:3001
```

---

## 📱 Navigation Guide

```
🏠 Dashboard (/)
├── 📊 Sales Analytics (/sales)
├── 🍕 Menu Management (/menu)
├── 📦 Legacy Inventory (/inventory)
├── 📈 Financial Reports (/reports)
└── 📥 Import Data (/import)
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Dashboard shows data (not all zeros)
- [ ] "Today's Performance" cards have values
- [ ] "Top Selling Items" shows 5 items
- [ ] Menu page shows 60+ items in cards
- [ ] Sales page shows daily breakdown
- [ ] Reports page shows P&L statement
- [ ] Can filter by date range
- [ ] Can search menu items
- [ ] All navigation links work

---

## 📞 Need More Help?

1. **Read:** `COMPLETE_SETUP.md` - Detailed instructions
2. **Read:** `IMPLEMENTATION_SUMMARY.md` - What's been built
3. **Check:** Supabase dashboard for database issues
4. **Verify:** CSV files are in correct location

---

## 🎉 You're Ready!

Once you see data on the dashboard, you're all set! The system is fully functional with:
- ✅ 60+ menu items
- ✅ 4,455 sales transactions
- ✅ 89 days of P&L data
- ✅ 217 cashbook entries
- ✅ Beautiful, responsive UI
- ✅ Real-time calculations

**Enjoy your restaurant management system!** 🍽️

---

**Questions? Check the troubleshooting section above or review the comprehensive documentation.**
