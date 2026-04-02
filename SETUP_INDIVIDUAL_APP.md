# ✂️ Amr Salah Barber Shop - Individual App Setup Guide

**Status:** Individual Single-Shop Application (Converted from Multi-Tenant SaaS)

---

## 📋 Overview

This is an **individual barber shop management application** specifically built for **Amr Salah Barber Shop**. It includes:

✅ **Point-of-Sale (POS) System** - Complete invoice management  
✅ **Booking System** - Smart scheduling with queue management  
✅ **Client Management** - Track customer visits and spending  
✅ **Staff Management** - Manage barbers and their assignments  
✅ **Analytics Dashboard** - Revenue tracking and KPIs  
✅ **Customer Portal** - Allow clients to book appointments independently  
✅ **Service Management** - Configure services and pricing  
✅ **Expense Tracking** - Monitor business costs  
✅ **Arabic & English** - Full bilingual support with RTL/LTR

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and **npm** (or yarn)
- **Supabase Account** (create at https://supabase.com)
- **Vercel Account** (for deployment, optional)
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/amrsalahbarber/Amr-Salah.git
cd Amr-Salah
npm install
```

### Step 2: Create Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a **new project** (name: "amr-salah-barber" or similar)
3. Go to **SQL Editor** → **New Query**
4. Copy the schema from the `supabase-schema.sql` file in this repository
5. Click **Run** to create all tables

**Note:** This individual app uses simplified tables without `shop_id` columns. Tables now include:
- `clients` - Customer information
- `services` - Available services
- `barbers` - Staff members
- `bookings` - Appointments
- `transactions` - Sales records
- `expenses` - Business costs
- `visit_logs` - Customer visit history
- `settings` - App configuration
- `customer_users` - Portal user accounts

### Step 3: Set Up Environment Variables

Create `.env.local` file in the root directory:

```bash
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

Get these values from Supabase:
- Project Settings → API
- Copy the URL and `anon (public)` key

### Step 4: Create Admin Account

1. Go to Supabase Auth (Authentication → Users)
2. Click **"Add new user"**
3. Enter:
   - Email: `your-email@example.com`
   - Password: `strong-password-here`
4. Click **Create user**

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Authentication

### Admin/Shop Owner Login

1. Visit `http://localhost:5173/login`
2. Enter your Supabase Auth credentials
3. Access dashboard at `/dashboard`

### Customer Portal

1. Visit `http://localhost:5173/login` (portal shares same auth)
2. Or navigate to `/register` to create new customer account
3. Phone-based authentication (independent from admin)
4. Customers can book appointments at `/portal/bookings`

---

## 📚 Features Breakdown

### Dashboard (`/dashboard`)
- Real-time revenue tracking
- Client statistics
- Recent transactions
- Manual refresh capability

### Point-of-Sale (`/pos`)
- Search clients by name/phone
- Add services to cart
- Apply discounts (percentage or fixed)
- Payment methods: Cash, Card, Wallet
- Receipt printing
- Auto-complete bookings on sale

### Bookings (`/bookings`)
- Create new appointments
- Smart barber assignment (least busy)
- Check available time slots
- Edit/delete bookings
- Track booking status

### Queue Display (`/queue`)
- Real-time queue information
- People ahead counter
- Expected wait time
- Estimated completion time
- Live clock

### Clients (`/clients`)
- Add new customer
- View customer history
- Track VIP status
- Update details

### Services (`/services`)
- Add/edit services
- Set pricing and duration
- Categorize services
- Enable/disable services

### Barbers (`/barbers`)
- Manage staff members
- Set active/inactive status
- Track barber workload

### Analytics (`/analytics`)
- Revenue trends
- Customer metrics
- Expense breakdowns
- KPI charts

### Settings (`/settings`)
- App configuration
- Language preferences (AR/EN)
- Theme (Dark/Light)

### Customer Portal
- `/login` - Sign in
- `/register` - Create account
- `/portal/dashboard` - View upcoming appointments
- `/portal/bookings` - Book new appointment
- `/portal/history` - View past visits
- `/portal/profile` - Edit customer profile

---

## 🗄️ Database Schema (Simplified)

No multi-tenancy features - direct queries without `shop_id` filtering:

```sql
-- All tables use direct shop context (single shop)
-- Example queries:
SELECT * FROM clients;  -- All clients for this shop
SELECT * FROM bookings WHERE date = TODAY();  -- Today's bookings
```

---

## 🛠️ Development

### Project Structure

```
src/
├── App.tsx                  # Main router
├── pages/
│   ├── Dashboard.tsx
│   ├── POS.tsx
│   ├── Bookings.tsx
│   ├── Clients.tsx
│   ├── Services.tsx
│   ├── Barbers.tsx
│   ├── Analytics.tsx
│   ├── Expenses.tsx
│   ├── Settings.tsx
│   └── portal/              # Customer portal pages
├── components/
│   ├── layout/              # Navigation & layout
│   ├── ui/                  # Reusable components
│   └── receipt/             # Invoice printing
├── db/
│   ├── supabase.ts          # Supabase client
│   └── hooks/               # Database hooks (no shop_id)
├── hooks/
│   ├── useAuth.ts           # Simplified auth
│   ├── usePortalAuth.ts     # Portal auth
│   ├── useLanguage.ts       # i18n
│   └── useTheme.ts          # Theme
└── locales/
    ├── ar.json              # Arabic translations
    └── en.json              # English translations
```

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional
VITE_APP_NAME=Amr Salah Barber Shop
```

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
tsc -b
```

---

## 📱 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **"New Project"**
4. Select your GitHub repository
5. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

### Vercel Environment Setup

In Vercel Project Settings → Environment Variables, add:

```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
```

Deploy URL will be automatically generated.

---

## 🔧 Troubleshooting

### "Auth user not found" Error

**Solution:** Database doesn't have a record for this auth user. Create manually:

```sql
-- Manually create a user record if needed
-- (Usually only needed for first-time setup)
```

### Missing Images or Assets

**Solution:** Clear cache and rebuild:

```bash
rm -r node_modules dist .vite
npm install
npm run build
```

### Supabase Connection Issues

**Solution:** Verify environment variables:

```bash
# In browser DevTools console:
console.log(import.meta.env.VITE_SUPABASE_URL)
```

Must show your Supabase URL.

### Portal Login Not Working

**Solution:** Check that `customer_users` table is created. Run migration if missing.

---

## 📞 Support

For issues or questions:

1. Check console errors (F12 → Console tab)
2. Verify Supabase credentials in `.env.local`
3. Ensure Supabase tables are created
4. Check network requests (F12 → Network tab)

---

## 🚀 Key Differences from SaaS Version

| Feature | SaaS | Individual |
|---------|------|-----------|
| Multi-Tenant | ✅ | ❌ |
| Admin Dashboard | ✅ | ❌ |
| Billing/Subscription | ✅ | ❌ |
| shop_id filtering | ✅ | ❌ |
| Multi-language | ✅ | ✅ |
| Portal | ✅ | ✅ |
| POS System | ✅ | ✅ |
| Analytics | ✅ | ✅ |

---

## 📝 Notes

- This is a **single-shop** application (no multi-tenancy)
- All data is for one barber shop only
- Portal uses independent localStorage-based auth
- Database queries do NOT filter by shop_id (removed)
- Subscription/billing system is NOT included

---

## 🎯 Next Steps

1. ✅ Set up Supabase database
2. ✅ Configure environment variables
3. ✅ Create admin account
4. ✅ Run `npm run dev`
5. ✅ Test POS, Bookings, Portal
6. ✅ Deploy to Vercel or your hosting

**Happy barbering! 💈**
