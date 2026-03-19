# Barber Shop SaaS Platform - Complete Documentation

## 🎯 Project Overview

A production-ready multi-tenant SaaS platform built with **React 18 + Vite + Supabase + TypeScript**. Enables barbershop owners to manage their business with automatic billing, subscription management, and admin controls.

**Status**: ✅ **PRODUCTION READY**

---

## 🏗️ Architecture

### Multi-Tenant Model

- **Shops**: Independent barbershop instances with their own data
- **Admin Users**: System administrators managing all shops and billing
- **Data Isolation**: Row-Level Security (RLS) policies enforce shop-level access

```
┌─────────────────────────────────────┐
│   Barber Shop SaaS System           │
├─────────────────────────────────────┤
│                                     │
│  Admin Panel             Shop 1     │  Shop N
│  ┌──────────────┐   ┌──────────┐   │
│  │ Dashboard    │   │Dashboard │   │
│  │ Shops Mgmt   │   │POS       │   │
│  │ Plans Mgmt   │   │Bookings  │   │
│  └──────────────┘   └──────────┘   │
│                                     │
└─────────────────────────────────────┘
     ↓ (Supabase PostgreSQL + RLS)
   Database with shop_id isolation
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS + Glassmorphism |
| **State Management** | React Hooks |
| **Forms** | React Hook Form + Zod |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Authorization** | Row-Level Security (RLS) |
| **i18n** | i18next (Arabic/English RTL/LTR) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **UI Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## ✨ Features

### 🔐 Authentication System (STEP 1 - COMPLETE)

```
┌─────────────────────────────────────┐
│         Login Page                  │
│  ┌──────────────────────────────┐   │
│  │ Email: yaa2003ya@gmail.com   │   │
│  │ Password: ••••••••••         │   │
│  └──────────────────────────────┘   │
│         Sign In Button              │
└─────────────────────────────────────┘
          ↓ (Auto Role Detection)
    ┌─────────────┬────────────┐
    ↓             ↓            
Admin Routes   Shop Routes
/admin         /dashboard
/admin/shops   /pos
/admin/plans   /clients
```

**Features:**
- ✅ Unified login for admins & shop owners
- ✅ Auto role detection via database queries
- ✅ Route protection with loading states
- ✅ Session management with logout
- ✅ Error handling & user feedback

**Files:**
- `src/hooks/useAuth.ts` - Auth logic + role detection
- `src/pages/Login.tsx` - Login form + validation
- `src/App.tsx` - Route guards (Protected/Admin/Shop)

---

### 🏪 Shop Management (STEP 2 - COMPLETE)

**Features:**
- ✅ All queries automatically filter by `shop_id`
- ✅ Users see only their shop's data
- ✅ Automatic multitenancy via RLS

**Updated Hooks:**
```typescript
// Before:
const { data } = await supabase.from('clients').select('*')

// After:
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('shop_id', shopId)  // ← Auto-filtered
```

**Updated Hooks:**
- ✅ `useClients.ts` - Clients management
- ✅ `useBookings.ts` - Bookings with shop filtering
- ✅ `useServices.ts` - Services list
- ✅ `useBarbers.ts` - Barber profiles
- ✅ `useTransactions.ts` - Transaction history
- ✅ `useExpenses.ts` - Expense tracking
- ✅ `useVisitLogs.ts` - Visit analytics

---

### 📊 Dashboard Enhancements (STEP 3 - COMPLETE)

**Subscription Alert Component:**
```
┌────────────────────────────────────┐
│ ⚠️  Subscription Expiring Soon     │
│    Your subscription ends in 3 days │
│    View Billing Details →           │
└────────────────────────────────────┘
```

**Features:**
- ✅ Real-time subscription status
- ✅ Color-coded alerts (Green/Yellow/Orange/Red)
- ✅ Automatic refresh every minute
- ✅ Displays quota usage for quota plans
- ✅ Shows days remaining until expiration

**Implemented:**
- `src/components/subscription/SubscriptionAlert.tsx` - Alert UI
- `src/utils/subscriptionChecker.ts` - Status logic
- Alert integrated into Dashboard

---

### 👨‍💼 Admin Panel (STEP 4 - COMPLETE)

#### Admin Dashboard
```
┌─────────────────────────────────┐
│   Admin Dashboard               │
│                                 │
│ Total Shops: 5  Active: 4      │
│ Total Revenue: ج.م 15,000      │
│ Monthly Revenue: ج.م 3,200     │
└─────────────────────────────────┘
```

**Features:**
- ✅ System-wide statistics
- ✅ Revenue tracking
- ✅ Shop count & status

**File:** `src/pages/AdminDashboard.tsx`

#### Shop Management
```
┌─────────────────────────────────┐
│ Manage Shops                    │
│                                 │
│ Shop Name  │ Owner │ Status    │
│ ────────────────────────────    │
│ Barber 1   │ ...   │ Active ✓ │
│ Barber 2   │ ...   │ Active ✓ │
└─────────────────────────────────┘
```

**Features:**
- ✅ View all shops
- ✅ Update subscription status
- ✅ Delete shops
- ✅ View shop details

**File:** `src/pages/AdminShops.tsx`

#### Pricing Plans Manager
```
┌──────────────────────────────────┐
│ Pricing Plans                    │
│                                  │
│ Plan Name │ Type    │ Price    │
│ ──────────────────────────────── │
│ Basic     │ Per Tx  │ ج.م 5    │
│ Pro       │ Quota   │ ج.م 99/mo│
└──────────────────────────────────┘
```

**Features:**
- ✅ Create new pricing plans
- ✅ Edit existing plans
- ✅ Delete unused plans
- ✅ Support for 3 pricing models:
  - Per Transaction
  - Per Service
  - Quota (Monthly)

**File:** `src/pages/AdminPlans.tsx`

**Routes:**
- `/admin` - Admin Dashboard
- `/admin/shops` - Manage Shops
- `/admin/plans` - Manage Plans

---

### 💳 Billing & Subscription (STEP 5-6 - COMPLETE)

#### Subscription Status Detector

```typescript
const status = await checkSubscriptionStatus(shopId)

// Returns:
{
  isActive: true,
  status: 'active',  // active|inactive|suspended|expired
  daysRemaining: 7,
  isExpiringSoon: true,
  currentPlan: 'Pro Quota',
  quotaUsed: 85,
  quotaLimit: 100,
  usagePercentage: 85
}
```

#### Pricing Models

| Model | Description | Example |
|-------|------------|---------|
| **Per Transaction** | Charge $X per booking | $5 per transaction |
| **Per Service** | Charge $X per service item | $8 per service |
| **Quota** | Fixed monthly price for N transactions | $99/month for 100 transactions |

#### Usage Tracking

- **Automatic Logging**: Each transaction inserts into `usage_logs`
- **Database Trigger**: Calculates billable amounts
- **Monthly Grouping**: Easy billing by year_month
- **Shop Isolation**: Each shop's usage tracked separately

```sql
INSERT INTO usage_logs (shop_id, action_type, quantity, billable_amount, year_month)
VALUES ('shop_123', 'transaction', 1, 5.00, '2026-03')
```

#### Subscription Features

**Features:**
- ✅ Check subscription status
- ✅ Detect expiration (7+ days warning)
- ✅ Display quota usage
- ✅ Block access on suspension
- ✅ Alert on quota exceeded
- ✅ Get billing information

**Files:**
- `src/utils/subscriptionChecker.ts` - Subscription logic
- `src/components/subscription/SubscriptionAlert.tsx` - UI components

---

## 📁 Project Structure

```
d:\Barber Shop\
├── src/
│   ├── pages/
│   │   ├── Login.tsx              ✅ Auth
│   │   ├── Dashboard.tsx          ✅ Shop dashboard
│   │   ├── AdminDashboard.tsx     ✅ Admin overview
│   │   ├── AdminShops.tsx         ✅ Manage shops
│   │   ├── AdminPlans.tsx         ✅ Manage plans
│   │   ├── POS.tsx                ✅ Point of sale
│   │   ├── Clients.tsx            ✅ Client management
│   │   ├── Barbers.tsx            ✅ Barber profiles
│   │   ├── Bookings.tsx           ✅ Booking system
│   │   ├── Services.tsx           ✅ Service menu
│   │   ├── Expenses.tsx           ✅ Expense tracking
│   │   ├── Analytics.tsx          ✅ Reports
│   │   ├── Settings.tsx           ✅ App settings
│   │   └── DailyLogs.tsx          ✅ Daily logs
│   │
│   ├── hooks/
│   │   ├── useAuth.ts             ✅ Auth state + role detection
│   │   ├── useTheme.ts            ✅ Dark/light mode
│   │   └── useLanguage.ts         ✅ i18n (AR/EN)
│   │
│   ├── db/
│   │   ├── supabase.ts            ✅ Supabase client
│   │   └── hooks/
│   │       ├── useClients.ts      ✅ Shop-filtered
│   │       ├── useBookings.ts     ✅ Shop-filtered
│   │       ├── useServices.ts     ✅ Shop-filtered
│   │       ├── useBarbers.ts      ✅ Shop-filtered
│   │       ├── useTransactions.ts ✅ Shop-filtered
│   │       ├── useExpenses.ts     ✅ Shop-filtered
│   │       ├── useVisitLogs.ts    ✅ Shop-filtered
│   │       └── ...others
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         ✅ + logout menu
│   │   │   ├── Sidebar.tsx        ✅ + admin nav
│   │   │   └── Layout.tsx         ✅ + react-router
│   │   ├── subscription/
│   │   │   └── SubscriptionAlert.tsx  ✅ NEW
│   │   └── ui/
│   │       ├── GlassCard.tsx
│   │       ├── Modal.tsx
│   │       └── ...others
│   │
│   ├── utils/
│   │   ├── subscriptionChecker.ts ✅ NEW
│   │   ├── egyptTime.ts
│   │   ├── formatCurrency.ts
│   │   ├── exportCSV.ts
│   │   └── eventEmitter.ts
│   │
│   └── App.tsx                     ✅ React Router v6 + Admin routes
│
├── vite.config.ts                  ✅ + path aliases
├── vite.config.js                  ✅ + path aliases
├── tsconfig.json                   ✅ + path aliases
├── package.json                    ✅ + dependencies
└── README.md                        ✅ THIS FILE
```

---

## 🗄️ Database Schema

### Tables

#### Core Tables
- **shops** - Barbershop instances with subscription info
- **admin_users** - System administrators
- **plans** - Pricing plans

#### Data Tables (with shop_id)
- **clients** → shop_id (multi-tenant)
- **services** → shop_id (multi-tenant)
- **barbers** → shop_id (multi-tenant)
- **transactions** → shop_id (multi-tenant)
- **bookings** → shop_id (multi-tenant)
- **expenses** → shop_id (multi-tenant)
- **visit_logs** → shop_id (multi-tenant)

#### Billing Tables
- **usage_logs** - Transaction tracking for billing
  - Columns: shop_id, action_type, quantity, billable_amount, year_month

### RLS Policies

**Shop Access (SHOP OWNER)**
```sql
-- Can read/write only their own data
WHERE shop_id = (
  SELECT id FROM shops WHERE auth_user_id = auth.uid()
)
```

**Admin Access (ADMIN)**
```sql
-- Can read/write all data
WHERE EXISTS (
  SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()
)
```

---

## 🔒 Security Features

### Multi-Tenancy
- ✅ Shop-level data isolation via `shop_id`
- ✅ RLS policies enforce access control
- ✅ Database triggers for audit trails

### Authentication
- ✅ Supabase Auth (email + password)
- ✅ JWT tokens via session management
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with automatic redirects

### Authorization
- ✅ Frontend route guards (Protected/Admin/Shop)
- ✅ Backend RLS policies
- ✅ No service role key in frontend
- ✅ User context via `auth.uid()`

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 16+
# npm or yarn
# Supabase account
```

### Installation

```bash
# 1. Clone/open project
cd "d:\Barber Shop"

# 2. Install dependencies
npm install

# 3. Configure environment
# Create .env.local with Supabase credentials:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

# 4. Start development server
npm run dev

# 5. Open browser
http://localhost:5173
```

### Test Credentials

**Admin User:**
```
Email: yaa2003ya@gmail.com
Password: (configured in Supabase)
Role: Administrator
```

**Shop Owner:**
```
Email: shop1@gmail.com
Password: (configured in Supabase)
Role: Shop Owner
```

---

## 📝 Usage Workflows

### Shop Owner Workflow

```
1. Login with email/password
   ↓
2. Auto-detect role → Redirect to /dashboard
   ↓
3. View subscript ion status & quota usage
   ↓
4. Manage business:
   - Create bookings
   - Track transactions
   - Manage clients
   - View analytics
   ↓
5. Logout (clears session)
```

### Admin Workflow

```
1. Login with admin email
   ↓
2. Auto-detect admin role → Redirect to /admin
   ↓
3. Manage system:
   - View all shops
   - Update subscription status
   - Manage pricing plans
   - View revenue analytics
   ↓
4. Logout
```

---

## 🔧 Configuration

### Enable/Disable Features

**Subscription Alerts:**
```typescript
// Disable in Dashboard
// src/pages/Dashboard.tsx
// Comment out: <SubscriptionAlert />
```

**Admin Routes:**
```typescript
// Fully enabled in App.tsx
// Routes: /admin, /admin/shops, /admin/plans
```

### Customize Pricing

1. Open Admin Panel → Pricing Plans
2. Create/Edit plans:
   - Per Transaction: $5 per booking
   - Per Service: $8 per service
   - Quota: $99/month for 100 transactions

---

## 🧪 Testing Scenarios

### Scenario 1: Shop Owner Login
```
1. Go to http://localhost:5173
2. Enter: shop1@gmail.com / password
3. Should appear: Shop Dashboard with shop data only
4. Sidebar shows shop menu
5. Try accessing /admin → Redirected to /dashboard
```

### Scenario 2: Admin Login
```
1. Go to http://localhost:5173
2. Enter: yaa2003ya@gmail.com / password
3. Should appear: Admin Dashboard
4. Sidebar shows Admin menu
5. Try accessing /dashboard → Redirected to /admin
```

### Scenario 3: Subscription Alert
```
1. Login as shop owner
2. If subscription ending < 7 days → Yellow alert
3. If quota exceeded → Orange alert
4. If expired → Red alert
5. Click "View Billing Details" → Settings page
```

### Scenario 4: Multi-Tenancy
```
1. Add client in Shop 1
2. Login as Shop 2 owner
3. Client list should be EMPTY (not visible)
4. Complete isolation verified ✓
```

---

## 📊 Billing Calculation Example

### Scenario: Pay Per Transaction Plan ($5)

```
Transaction 1: $5.00
Transaction 2: $5.00
Transaction 3: $5.00
─────────────────────
Month Bill: $15.00
```

### Scenario: Quota Plan ($99/month for 100)

```
Month: March 2026
Transactions: 85/100
Usage: 85%
Price: $99.00 (fixed)
Status: Active (quota available)
```

### Scenario: Over Quota

```
Month: March 2026
Transactions: 105/100
Over Quota: 5 transactions
Status: SUSPENDED (billing alert)
Action: Contact admin to upgrade
```

---

## 📈 Analytics & Metrics

**Subscription Status Tracking**
- Active shops
- Expiring subscriptions
- Suspended accounts
- Revenue by plan type

**Usage Analytics**
- Transactions per shop per month
- Average transaction value
- Quota utilization rates
- Plan distribution

**Access Logs**
- Login timestamps
- Failed auth attempts
- Admin actions

---

## 🐛 Troubleshooting

### Issue: "Shop ID is required"
**Cause:** useAuth hook returned null shopId  
**Fix:** Wait for auth to complete, check useAuth loading state

### Issue: "404 Not Found" on routes
**Cause:** Route not defined  
**Fix:** Check React Router paths in App.tsx

### Issue: RLS policy denies access
**Cause:** Wrong shop_id or missing auth.uid()  
**Fix:** Verify RLS policies in Supabase, check auth session

### Issue: Data not appearing
**Cause:** shop_id filter too restrictive  
**Fix:** Verify shop_id in database, check useAuth returns correct ID

---

## 🔄 Deployment

### Prerequisites
- Supabase project running
- Environment variables configured
- Database migrations applied

### Production Build

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
npm run build && npm deploy
```

### Environment Variables (Production)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
```

---

## 📚 Development Guidelines

### Adding New Features

1. **Create a new page:**
   ```typescript
   // src/pages/NewPage.tsx
   export const NewPage = () => {
     const { shopId } = useAuth()  // Get user's shop
     // Always filter by shopId
   }
   ```

2. **Update hooks if needed:**
   ```typescript
   // In database hooks
   .eq('shop_id', shopId)  // Always add
   ```

3. **Protect routes:**
   ```typescript
   // In App.tsx
   <Route path="/newpage" element={
     <ShopRoute><Layout><NewPage /></Layout></ShopRoute>
   } />
   ```

### Code Standards

- ✅ TypeScript for all new code
- ✅ Always filter by shop_id in queries
- ✅ Use useAuth hook for authentication
- ✅ Provide error handling with toast notifications
- ✅ Add loading states
- ✅ Comment complex logic
- ✅ Follow component naming (PascalCase)
- ✅ Use Tailwind CSS for styling

---

## 📦 Dependencies

```json
{
  "react": "18.x",
  "react-router-dom": "6.x",
  "react-hook-form": "7.x",
  "@hookform/resolvers": "latest",
  "zod": "latest",
  "@supabase/supabase-js": "latest",
  "react-hot-toast": "latest",
  "react-i18next": "latest",
  "framer-motion": "latest",
  "recharts": "latest",
  "lucide-react": "latest",
  "tailwindcss": "3.x"
}
```

---

## 📞 Support

- Database: Supabase Docs https://supabase.com/docs
- Frontend: React Docs https://react.dev
- Styling: Tailwind CSS https://tailwindcss.com
- Authentication: Supabase Auth https://supabase.com/docs/guides/auth

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-19 | ✅ Complete SaaS system with all STEPs 1-6 |
| 0.1.0 | 2026-03-19 | Initial multi-tenant schema design |

---

## ✅ Completion Checklist

- ✅ **STEP 1**: Authentication System (useAuth, Login, Route Guards)
- ✅ **STEP 2**: Multi-Tenancy (shop_id filtering in all hooks)
- ✅ **STEP 3**: Dashboard Enhancements (Subscription alerts)
- ✅ **STEP 4**: Admin Panel (Dashboard, Shops, Plans)
- ✅ **STEP 5**: Usage Tracking (Billing triggers)
- ✅ **STEP 6**: Subscription Management (Status checker)
- ✅ **Production Ready**: Error handling, loading states, validation
- ✅ **Fully Documented**: README, code comments, examples
- ✅ **Type Safe**: Full TypeScript coverage
- ✅ **Responsive**: Mobile-first design
- ✅ **i18n Support**: Arabic/English with RTL

---

**🎉 The system is now production-ready and fully operational!**

For questions or issues, refer to the troubleshooting section or review the source code comments.
