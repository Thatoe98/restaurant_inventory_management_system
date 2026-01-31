# RestaurantOS Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Setup & Installation](#setup--installation)
6. [Development Workflow](#development-workflow)
7. [Key Components](#key-components)
8. [API Integration](#api-integration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## Architecture Overview

RestaurantOS follows a modern JAMstack architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│    Supabase     │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  TanStack Query │     │  Row Level      │
│  (State Mgmt)   │     │  Security       │
└─────────────────┘     └─────────────────┘
```

### Key Principles
- **Server-First Rendering**: Next.js App Router with React Server Components where possible
- **Real-Time State**: TanStack Query for server state synchronization
- **Type Safety**: Full TypeScript coverage with strict mode
- **Security**: Row Level Security (RLS) on all database tables

---

## Technology Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.4 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | latest | Accessible component library |
| Lucide React | 0.562.0 | Icon library |
| date-fns | 4.1.0 | Date manipulation |

### Backend & State
| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | 2.91.0 | Database client |
| @tanstack/react-query | 5.90.19 | Server state management |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Dashboard (home page)
│   ├── globals.css              # Global styles
│   ├── menu/
│   │   └── page.tsx             # Menu management
│   ├── sales/
│   │   └── page.tsx             # Sales analytics
│   ├── ingredients/
│   │   └── page.tsx             # Ingredient tracking
│   ├── reports/
│   │   └── page.tsx             # Financial reports
│   ├── import/
│   │   └── page.tsx             # CSV data import
│   └── inventory/
│       └── page.tsx             # Legacy inventory system
│
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── table.tsx
│   ├── navigation.tsx           # App navigation bar
│   ├── stock-in-dialog.tsx      # Stock addition modal
│   ├── stock-out-dialog.tsx     # Stock removal modal (FIFO)
│   └── audit-dialog.tsx         # High-value audit modal
│
└── lib/
    ├── supabase.ts              # Supabase client initialization
    ├── database.types.ts        # TypeScript type definitions
    ├── csv-import.ts            # CSV parsing & import utilities
    ├── query-provider.tsx       # TanStack Query provider
    └── utils.ts                 # Utility functions (cn helper)
```

---

## Database Schema

### Core Tables

#### 1. `ingredients`
Tracks raw ingredients for recipes.
```sql
- id: UUID (PK)
- name: TEXT (unique)
- unit: TEXT (g, ml, count)
- cost_per_unit: NUMERIC
- current_stock: NUMERIC
- min_stock_threshold: NUMERIC
- category: TEXT
```

#### 2. `menu_items`
Restaurant menu with pricing.
```sql
- id: TEXT (PK) - e.g., 'F-001', 'D-001'
- name: TEXT
- menu_type: TEXT (Food/Drink)
- section: TEXT
- unit_price: NUMERIC
- unit_cost: NUMERIC
- unit_gp: NUMERIC (gross profit)
- cost_percentage: NUMERIC
- is_active: BOOLEAN
```

#### 3. `daily_item_sales`
Item-level sales tracking.
```sql
- id: UUID (PK)
- date: DATE
- item_id: TEXT (FK → menu_items)
- quantity_sold: INTEGER
- sales_amount: NUMERIC
- cogs_amount: NUMERIC
- gross_profit: NUMERIC
```

#### 4. `daily_summaries`
Daily P&L aggregations.
```sql
- id: UUID (PK)
- date: DATE (unique)
- covers: INTEGER
- net_sales: NUMERIC
- cogs: NUMERIC
- gross_profit: NUMERIC
- [expense columns...]
- operating_profit: NUMERIC
```

#### 5. `cashbook_transactions`
Financial transaction log.
```sql
- id: UUID (PK)
- txn_id: TEXT
- date: DATE
- description: TEXT
- inflow: NUMERIC
- outflow: NUMERIC
- category: TEXT
- running_balance: NUMERIC
```

### Entity Relationships

```
ingredients ──────────────────────────────────────────┐
                                                      │
menu_items ◄──────── recipe_ingredients ◄─────────────┘
     │
     ▼
daily_item_sales ──────────► daily_summaries
                                    │
                                    ▼
                          cashbook_transactions
```

---

## Setup & Installation

### Prerequisites
```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version
```

### Step-by-Step Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Supabase Configuration
1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-comprehensive-schema.sql` in SQL Editor
3. Get API credentials from Settings > API

#### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Start Development Server
```bash
npm run dev
```

---

## Development Workflow

### Adding a New Page

1. Create folder in `src/app/`:
```bash
mkdir src/app/new-feature
touch src/app/new-feature/page.tsx
```

2. Use the standard page template:
```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewFeaturePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['feature-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table_name')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Feature</h1>
        {/* Page content */}
      </div>
    </div>
  );
}
```

### Adding a New UI Component

1. Use shadcn CLI:
```bash
npx shadcn@latest add [component-name]
```

2. Or create custom component in `src/components/`:
```tsx
interface Props {
  // Define props
}

export function CustomComponent({ ...props }: Props) {
  return (
    // JSX
  );
}
```

### Database Queries

Always use the Supabase client with TanStack Query:

```tsx
// Read data
const { data, isLoading, error } = useQuery({
  queryKey: ['unique-key', dependencies],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('column', value);
    if (error) throw error;
    return data;
  },
});

// Write data
const mutation = useMutation({
  mutationFn: async (newData) => {
    const { error } = await supabase
      .from('table')
      .insert(newData);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['unique-key'] });
  },
});
```

---

## Key Components

### Query Provider
Location: `src/lib/query-provider.tsx`

Wraps the app with TanStack Query provider for state management.

### Supabase Client
Location: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### CSV Import Utilities
Location: `src/lib/csv-import.ts`

Functions:
- `parseCSV(csvString, keyColumn)` - Parse CSV with quote handling
- `parseNumber(value)` - Clean and parse numeric values
- `importMenuItems(csvData)` - Import menu items
- `importDailySales(csvData)` - Import daily sales
- `importDailySummaries(csvData)` - Import P&L data
- `importCashbookTransactions(csvData)` - Import transactions
- `initializeIngredients()` - Seed ingredient list

---

## API Integration

### Supabase Queries

All database operations go through the Supabase client:

```typescript
// SELECT
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2, related_table(column)')
  .gte('date', startDate)
  .lte('date', endDate)
  .order('column', { ascending: false })
  .limit(50);

// INSERT
const { error } = await supabase
  .from('table_name')
  .insert({ column1: value1, column2: value2 });

// UPDATE
const { error } = await supabase
  .from('table_name')
  .update({ column: newValue })
  .eq('id', recordId);

// UPSERT (insert or update)
const { error } = await supabase
  .from('table_name')
  .upsert(data, { onConflict: 'id' });

// DELETE
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId);
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms

Build and start commands:
```bash
npm run build    # Creates .next/ production build
npm start        # Starts production server on port 3000
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Troubleshooting

### Common Issues

#### "Failed to fetch" errors
- Check `.env.local` has correct Supabase credentials
- Verify no extra spaces in environment variables
- Ensure Supabase project is active (not paused)

#### Build errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Type errors
```bash
# Regenerate types from database
npm run dev  # Types are inferred from Supabase
```

#### RLS Policy errors
- Ensure RLS policies allow anonymous access
- Check `supabase-comprehensive-schema.sql` for policy definitions

---

## Maintenance

### Regular Tasks

1. **Database Backups**: Supabase provides automatic backups
2. **Dependency Updates**: Run `npm update` monthly
3. **Security Patches**: Watch for Next.js and Supabase updates
4. **Performance Monitoring**: Check Supabase dashboard for slow queries

### Log Locations

- Browser Console: Client-side errors
- Terminal: Server-side errors during development
- Vercel Dashboard: Production logs

### Health Checks

1. Dashboard loads without errors
2. All navigation links work
3. Data imports successfully
4. Date filters function correctly

---

## Code Style Guidelines

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type when possible

### React
- Use functional components with hooks
- Implement proper loading and error states
- Memoize expensive computations

### CSS
- Use Tailwind utility classes
- Follow mobile-first approach
- Use CSS variables for theming

### Git
- Meaningful commit messages
- Feature branches for new work
- Review before merging to main
