# ✅ Quick Start Checklist

Follow this checklist to get your Restaurant Inventory System running in 10 minutes.

## Prerequisites
- [ ] Node.js 18+ installed ([download](https://nodejs.org/))
- [ ] A Supabase account ([sign up](https://supabase.com))
- [ ] Basic terminal/command line knowledge

---

## Setup Steps

### 1. Supabase Setup (5 minutes)
- [ ] Go to [supabase.com](https://supabase.com) and sign in
- [ ] Click "New Project"
- [ ] Name it: `restaurant-inventory`
- [ ] Choose a database password (save it!)
- [ ] Wait for project to provision (~2 minutes)

### 2. Database Configuration (2 minutes)
- [ ] In Supabase dashboard, open **SQL Editor**
- [ ] Open `supabase-schema.sql` file from this project
- [ ] Copy entire contents
- [ ] Paste into SQL Editor
- [ ] Click **Run** (or Ctrl/Cmd + Enter)
- [ ] Verify "Success" message appears

### 3. Get API Credentials (1 minute)
- [ ] In Supabase, go to **Settings** > **API**
- [ ] Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
- [ ] Copy **anon public key** (long string starting with `eyJ...`)

### 4. Configure Environment (1 minute)
- [ ] Open `.env.local` file in this project
- [ ] Paste your Project URL after `NEXT_PUBLIC_SUPABASE_URL=`
- [ ] Paste your anon key after `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
- [ ] Save the file

### 5. Install & Run (1 minute)
Open terminal in this folder and run:

```bash
npm install
npm run dev
```

- [ ] Wait for "Ready" message
- [ ] Open browser to [http://localhost:3000](http://localhost:3000)

---

## Quick Test (Optional)

Test that everything works:

- [ ] Click "Stock In" button
- [ ] Create a test item:
  - Name: `Test Item`
  - Category: `Test`
  - Unit: `kg`
  - Quantity: `10`
- [ ] Click "Add Stock"
- [ ] See it appear in dashboard
- [ ] Click "Use" button
- [ ] Deduct 3 units
- [ ] Verify stock updates to 7

---

## Troubleshooting

### ❌ "Failed to fetch" errors
**Fix**: Check your `.env.local` has correct credentials with no extra spaces

### ❌ Blank dashboard / no items showing
**Fix**: 
1. Open browser console (F12)
2. Look for errors
3. Verify SQL schema ran successfully in Supabase

### ❌ "Cannot find module" errors
**Fix**: Run `npm install` again

### ❌ Port 3000 already in use
**Fix**: Either:
- Kill the process using port 3000, or
- Run `npm run dev -- -p 3001` to use port 3001

---

## ✅ Success!

If you see the dashboard with stats cards and the inventory table, you're all set!

**Next Steps:**
1. Read [README.md](README.md) for full documentation
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details

---

## Need Help?

1. Check browser console (F12) for errors
2. Check Supabase logs in dashboard
3. Verify all steps above were completed
4. Review the troubleshooting section in README.md

---

**Happy inventory managing! 🎉**
