# RestaurantOS - Complete Restaurant Management System

A comprehensive, production-ready restaurant management platform built with Next.js, TypeScript, and Supabase. Designed for both technical and non-technical users to manage inventory, track sales, analyze performance, and generate financial reports.

## 🌟 Features

### 📊 Dashboard
- Real-time performance metrics (sales, profit, covers)
- Today's performance vs. month-to-date comparison
- Top selling items ranking
- Low stock alerts
- Quick navigation to all modules

### 🍕 Menu Management
- Browse 60+ menu items with filtering
- View pricing, costs, and profit margins
- Search functionality
- Cost percentage analysis
- Filter by section (Pizza, Drinks, Snacks, etc.)

### 📈 Sales Analytics
- Daily sales breakdown with trends
- Top 20 performing items
- Custom date range filtering
- Profit margin calculations
- Visual performance indicators

### 📦 Ingredients Management
- Track 35+ ingredients with stock levels
- Low stock alerts and thresholds
- Stock in/out with one click
- Real-time stock value calculation
- Supplier tracking

### 💰 Financial Reports
- Complete P&L statements
- Revenue and expense breakdown
- Cashbook transaction history
- Operating profit analysis
- Export-ready format

### 📥 Data Import
- CSV file import support
- Bulk data upload
- Validation and error handling
- Progress feedback

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| State | TanStack Query v5 |
| Icons | Lucide React |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone or download the project
cd restaurant-inventory

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy contents of `supabase-comprehensive-schema.sql`
4. Run the query
5. Copy your API credentials from Settings > API

## 📁 Project Structure

```
restaurant-inventory/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── menu/              # Menu management
│   │   ├── sales/             # Sales analytics
│   │   ├── ingredients/       # Ingredient tracking
│   │   ├── reports/           # Financial reports
│   │   ├── import/            # Data import
│   │   └── inventory/         # Legacy inventory
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navigation.tsx     # App navigation
│   │   └── dialogs/           # Modal dialogs
│   └── lib/
│       ├── supabase.ts        # Database client
│       ├── csv-import.ts      # Import utilities
│       └── database.types.ts  # TypeScript types
├── docs/                       # Documentation
│   ├── DEVELOPER_GUIDE.md     # Technical documentation
│   ├── USER_MANUAL.md         # Staff instructions
│   ├── TESTING_PROCEDURES.md  # QA guidelines
│   └── BUSINESS_PROPOSAL.md   # Sales document
└── supabase-comprehensive-schema.sql
```

## 📖 Documentation

- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical documentation for developers
- **[User Manual](docs/USER_MANUAL.md)** - Step-by-step guide for restaurant staff
- **[Testing Procedures](docs/TESTING_PROCEDURES.md)** - QA and testing guidelines
- **[Business Proposal](docs/BUSINESS_PROPOSAL.md)** - System benefits and ROI

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Support

For technical support or feature requests, please refer to the documentation or contact the development team.

## 📄 License

Private - All rights reserved.
