# Quick Setup Guide

Follow these steps to get your Restaurant Inventory Management System up and running.

## Step 1: Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create an account)
4. Click "New Project"
5. Fill in:
   - **Name**: restaurant-inventory (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free (sufficient for getting started)
6. Click "Create new project"
7. Wait 2-3 minutes for provisioning

## Step 2: Set Up Database

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click "New query"
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click "Run" (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

## Step 3: Get API Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon at bottom left)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: Copy this (looks like: `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (long string starting with `eyJ...`)
4. Keep this tab open, you'll need these values next

## Step 4: Configure Environment

1. In the project folder, locate `.env.local.example`
2. Create a new file called `.env.local` (remove the `.example` part)
3. Open `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxx...
   ```
4. Save the file

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 5: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Next.js, Supabase, React Query, etc.)

## Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

## Step 7: Test the Application

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see the Restaurant Inventory dashboard
3. Click "Stock In" to add your first item
4. Try these test items:

### Test Item 1: Wagyu Beef (High Value)
- **Item Type**: New Item
- **Name**: Wagyu Beef
- **Category**: Meat
- **Unit**: kg
- **High Value Item**: ✓ Checked
- **Min Stock Alert**: 2
- **Quantity**: 10
- **Cost Price**: 120.00
- **Expiry Date**: (7 days from today)

### Test Item 2: Olive Oil (Regular)
- **Item Type**: New Item
- **Name**: Extra Virgin Olive Oil
- **Category**: Condiments
- **Unit**: bottle
- **High Value Item**: ✗ Unchecked
- **Min Stock Alert**: 5
- **Quantity**: 15
- **Cost Price**: 12.50
- **Expiry Date**: (leave empty - doesn't expire soon)

## Step 8: Test Features

### Test Stock Out (FIFO)
1. Click "Use" button next to Wagyu Beef
2. Enter quantity: 3
3. Notes: "Used for dinner service"
4. Click "Use Stock"
5. Notice the stock count updated to 7

### Test Audit Feature
1. Click "Audit" button in header
2. You'll see Wagyu Beef (it's high value)
3. Expected shows: 7
4. Enter Actual Count: 6
5. Discrepancy shows: -1 kg (in red)
6. Reason field appears (required)
7. Enter: "Spillage during prep"
8. Click "Submit Audit"

### Test Alerts
1. Add an item with stock below threshold
2. Notice the "Low Stock" badge appears
3. Add an item with expiry date within 7 days
4. Notice the "Expiring Soon" badge appears

## Verification Checklist

- [ ] Dashboard loads without errors
- [ ] Can add new items
- [ ] Can add stock to existing items
- [ ] Stock Out works and updates counts
- [ ] Audit feature works for high-value items
- [ ] Low stock alerts appear when appropriate
- [ ] Expiry alerts appear for items expiring soon
- [ ] Stats cards show correct numbers

## Troubleshooting

### Problem: "Failed to fetch" or CORS errors

**Solution**:
1. Check that `.env.local` has correct credentials
2. Verify no extra spaces in the env file
3. Restart the dev server (`npm run dev`)

### Problem: SQL errors when running schema

**Solution**:
1. Make sure you copied the ENTIRE schema file
2. Run each CREATE TABLE statement separately if needed
3. Check for any existing tables (drop them first if testing)

### Problem: "Items not showing" or blank dashboard

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Go to Network tab, refresh page
4. Look for failed requests to Supabase
5. Verify RLS policies were created (check schema includes them)

### Problem: Can't add items - nothing happens

**Solution**:
1. Open browser console (F12)
2. Look for error messages
3. Common issue: Missing required fields
4. Ensure all "required" fields have values

## Next Steps

Once everything is working:

1. **Customize Categories**: Adjust categories to match your restaurant
2. **Set Thresholds**: Configure min_stock_threshold for each item type
3. **Add Your Inventory**: Input your actual restaurant inventory
4. **Train Staff**: Show team how to use Stock In/Out features
5. **Schedule Audits**: Set up nightly audits for high-value items
6. **Review Logs**: Check transaction_logs table in Supabase for audit trail

## Production Deployment

When ready to deploy:

1. **Vercel** (Recommended):
   ```bash
   npm install -g vercel
   vercel
   ```
   Add environment variables in Vercel dashboard

2. **Other Platforms**:
   - Ensure environment variables are set
   - Build command: `npm run build`
   - Start command: `npm start`
   - Node version: 18+

## Support

If you encounter issues:

1. Check this guide first
2. Review the main README.md
3. Check Supabase logs (Logs & Analytics section)
4. Inspect browser console for errors
5. Verify database schema was applied correctly

---

**You're all set! Happy inventory management! 🎉**
