# RestaurantOS User Manual

## For Restaurant Staff & Managers

Welcome to RestaurantOS! This guide will help you use the system effectively to manage your restaurant's daily operations.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Viewing the Menu](#viewing-the-menu)
4. [Checking Sales Performance](#checking-sales-performance)
5. [Managing Ingredients](#managing-ingredients)
6. [Financial Reports](#financial-reports)
7. [Importing Data](#importing-data)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Quick Reference](#quick-reference)

---

## Getting Started

### Accessing the System

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Go to: `http://localhost:3000` (or your server address)
3. The Dashboard will load automatically

### System Requirements

- Any modern web browser
- Internet connection
- Works on desktop, tablet, or mobile phone

---

## Dashboard Overview

The Dashboard is your home screen. It shows everything at a glance.

### What You'll See

#### Top Section - Quick Navigation
Four clickable cards to navigate to different areas:
- **Sales Analytics** - View detailed sales data
- **Menu Management** - Browse menu items
- **Ingredients** - Check stock levels
- **Financial Reports** - View P&L and cashbook

#### Today's Performance
Four metrics showing today's numbers:
| Metric | What It Means |
|--------|---------------|
| Sales Today | Total revenue today in MMK |
| Profit Today | Operating profit after expenses |
| Covers Today | Number of customers served |
| Low Stock Items | Ingredients that need restocking |

#### Month to Date
Three large colored cards showing monthly totals:
- **Green Card** - Total Sales for the month
- **Blue Card** - Total Profit for the month
- **Purple Card** - Total Customers served

#### Top Selling Items
Shows your 5 best-selling menu items with:
- Ranking number (1-5)
- Item name and category
- Total sales amount
- Quantity sold

#### Recent Performance
Shows the last 7 days with:
- Date
- Sales amount
- Profit (green = positive, red = negative)

---

## Viewing the Menu

### How to Access
1. Click **"Menu Management"** on the Dashboard
2. Or go directly to: `/menu`

### Features

#### Searching
1. Type in the search box
2. Results filter as you type
3. Clear the box to see all items

#### Filtering by Section
1. Click the section buttons (All, Pizza, Drinks, etc.)
2. Only items from that section will show
3. Click "All" to see everything

#### Understanding the Cards

Each menu item shows:
```
┌─────────────────────────────────┐
│ Item Name              [Food]  │
│ Section Name                    │
├─────────────────────────────────┤
│ Price:         85,000 MMK      │
│ Cost:          25,500 MMK      │
│ Gross Profit:  59,500 MMK      │
├─────────────────────────────────┤
│ Cost %:            30.0%       │
└─────────────────────────────────┘
```

#### Cost % Color Guide
- **Green** (< 30%) - Excellent margin
- **Yellow** (30-40%) - Good margin
- **Red** (> 40%) - High cost, review pricing

#### Summary Statistics
At the bottom, you'll see:
- Total Items in the filter
- Average Price
- Average Cost %
- Average Gross Profit

---

## Checking Sales Performance

### How to Access
1. Click **"Sales Analytics"** on the Dashboard
2. Or go directly to: `/sales`

### Setting Date Range

1. Find the "Date Range" card
2. Click on "Start Date" and select a date
3. Click on "End Date" and select a date
4. Data updates automatically

### Summary Cards

Four colored cards show totals for your date range:
- **Total Sales** (green) - All revenue
- **Operating Profit** (blue) - After expenses
- **Total Covers** (purple) - Customer count
- **Profit Margin** (orange) - Percentage

### Top Selling Items Table

Shows your best 20 items with:
| Column | Description |
|--------|-------------|
| # | Ranking position |
| Item Name | Name and type (Food/Drink) |
| Section | Category (Pizza, Drinks, etc.) |
| Qty Sold | Number of items sold |
| Sales | Total revenue in MMK |
| Profit | Gross profit in MMK |

### Daily Sales Table

Detailed day-by-day breakdown:
| Column | Description |
|--------|-------------|
| Date | The day |
| Day | Day of week |
| Status | Open or Closed |
| Covers | Customer count |
| Sales | Total revenue |
| Profit | With arrow indicator |
| Margin % | Profit as percentage |

**Tip:** Look for red arrows (▼) which indicate days with losses.

---

## Managing Ingredients

### How to Access
1. Click **"Ingredients"** on the Dashboard
2. Or go directly to: `/ingredients`

### Summary Cards

Three cards at the top:
- **Total Ingredients** - How many different ingredients you track
- **Low Stock Items** (red) - Items that need ordering
- **Stock Value** - Total value of all inventory

### Searching Ingredients
1. Type the ingredient name in the search box
2. Results filter automatically

### Understanding the Table

| Column | What It Means |
|--------|---------------|
| Ingredient | Name and supplier |
| Current Stock | How much you have now |
| Min Threshold | Reorder point |
| Max Threshold | Maximum storage |
| Unit Cost | Price per unit |
| Stock Value | Current stock × unit cost |
| Status | "In Stock" (green) or "Low Stock" (red) |
| Actions | + and - buttons |

### Adding Stock (Stock In)

1. Find the ingredient in the table
2. Click the **+** button
3. Enter the quantity to add
4. See the new stock level preview
5. Click **Confirm**

### Removing Stock (Stock Out)

1. Find the ingredient in the table
2. Click the **-** button
3. Enter the quantity to remove
4. See the new stock level preview
5. Click **Confirm**

### Low Stock Alert

When an ingredient falls below its minimum threshold:
- A red "Low Stock" badge appears
- It's counted in the "Low Stock Items" card
- Consider reordering soon!

---

## Financial Reports

### How to Access
1. Click **"Financial Reports"** on the Dashboard
2. Or go directly to: `/reports`

### Setting Report Period

1. Find the "Report Period" card
2. Set Start Date and End Date
3. All reports update automatically

### Profit & Loss Statement

Shows your complete P&L:

#### Revenue Section
- Net Sales (total revenue)
- Number of Covers (customers)

#### Cost of Sales Section
- COGS (cost of goods sold)
- Gross Profit
- Gross Margin %

#### Operating Expenses Section
All your costs:
- Rent
- Salaries (waiters, chefs, other staff)
- Utilities (electricity, generator)
- Marketing & Social Media
- Maintenance & Sanitation
- Consumables
- Card Fees
- Bank Charges
- **Total Operating Expenses**

#### Bottom Line
- **Operating Profit** - Your actual profit/loss
- **Margin %** - Profit as percentage of sales

### Cashbook Transactions

Shows your last 50 financial transactions:
| Column | Description |
|--------|-------------|
| Date | Transaction date |
| Txn ID | Reference number |
| Description | What it was for |
| Category | Type of transaction |
| Inflow | Money received (green) |
| Outflow | Money paid out (red) |
| Balance | Running balance |

---

## Importing Data

### How to Access
1. Click **"Import Data"** on the Dashboard
2. Or go directly to: `/import`

### Step 1: Initialize Ingredients

**Do this first before any other imports!**

1. Click the **"Initialize"** button
2. Wait for "Success" message
3. This creates all 35 basic ingredients

### Step 2: Import Menu Items

1. Find "Menu Items & Recipes" section
2. Click "Choose file"
3. Select your Menu CSV file
4. Wait for success message
5. Check the result shows number of items imported

### Step 3: Import Daily Sales

1. Find "Daily Item Sales" section
2. Click "Choose file"
3. Select your Daily_Item_Sales CSV file
4. Wait for success (may take 10-15 seconds)
5. Should show ~4000+ records

### Step 4: Import Daily Summaries

1. Find "Daily Summaries" section
2. Click "Choose file"
3. Select your Daily_Summary CSV file
4. Wait for success message

### Step 5: Import Cashbook

1. Find "Cashbook Transactions" section
2. Click "Choose file"
3. Select your Cashbook_Audit CSV file
4. Wait for success message

### After Importing

1. Click "Back to Dashboard"
2. Refresh the page (F5 or Ctrl+R)
3. You should now see all your data!

---

## Common Tasks

### Check Today's Sales
1. Go to Dashboard
2. Look at "Sales Today" card

### Find a Low-Profit Item
1. Go to Menu
2. Look for items with red Cost %
3. Consider raising prices or finding cheaper ingredients

### See Best Sellers
1. Go to Dashboard
2. Check "Top Selling Items" section
3. Or go to Sales for top 20

### Check if Need to Order
1. Go to Ingredients
2. Look at "Low Stock Items" count
3. Sort by Status to see all low stock items

### Generate Monthly Report
1. Go to Reports
2. Set date range to first and last day of month
3. View the P&L statement
4. Click Export if needed

### Compare Two Time Periods
1. Go to Sales Analytics
2. Set first date range, note the totals
3. Change to second date range
4. Compare the numbers

---

## Troubleshooting

### Page Shows "Loading..." Forever

**Try:**
1. Refresh the page (F5)
2. Check your internet connection
3. Clear browser cache (Ctrl+Shift+Delete)

### Numbers Show as 0

**Possible Causes:**
- Data hasn't been imported yet → Go to Import page
- Date range doesn't have data → Adjust the dates
- Database connection issue → Refresh page

### Can't Find a Menu Item

**Try:**
1. Clear the search box
2. Click "All" filter button
3. Check if item exists in database

### Import Failed

**Try:**
1. Make sure you imported in correct order (Ingredients first)
2. Check the CSV file is the correct one
3. Try importing one file at a time
4. Check for error message details

### Low Stock Not Showing

**Check:**
1. Ingredient has a min_stock_threshold set
2. Current stock is actually below threshold
3. Refresh the page

---

## Quick Reference

### Navigation

| Button/Link | Where It Goes |
|-------------|--------------|
| Dashboard card | Home page |
| Sales Analytics | /sales |
| Menu Management | /menu |
| Ingredients | /ingredients |
| Financial Reports | /reports |
| Import Data | /import |
| Back to Dashboard | Home page |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| F5 | Refresh page |
| Ctrl+F | Search on page |
| Tab | Move between fields |
| Enter | Submit/Confirm |
| Esc | Close dialogs |

### Color Meanings

| Color | Meaning |
|-------|---------|
| Green | Good/Profit/In Stock |
| Red | Warning/Loss/Low Stock |
| Blue | Information |
| Yellow/Orange | Caution/Attention |
| Purple | Customer/Covers data |

### Status Badges

| Badge | Meaning |
|-------|---------|
| Open (green) | Restaurant was open |
| Closed (red) | Restaurant was closed |
| In Stock (green) | Ingredient level OK |
| Low Stock (red) | Need to reorder |
| Food (green) | Food menu item |
| Drink (blue) | Beverage item |

---

## Need Help?

If you encounter issues not covered in this manual:

1. **Refresh the page** - Solves most temporary issues
2. **Try a different browser** - Chrome usually works best
3. **Contact your manager** - They can reach technical support
4. **Check the Developer Guide** - For technical issues

---

*RestaurantOS - Making Restaurant Management Simple*
