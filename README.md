# 💈 Barber Shop Management System

A professional, production-ready barber shop management and point-of-sale (POS) system built with **React + Framer Motion** and powered by **Supabase** (PostgreSQL).

🎨 **Features**: Modern glassmorphism design, Arabic/English localization (i18n), real-time analytics, receipt printing, VIP client tracking, expense management, and more.

🇪🇬 **Designed for Egyptian barbershops** with Egyptian locale defaults (currency: ج.م, phone format, date formatting).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A Supabase account (free tier available at https://supabase.com)

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account
2. Create a new project
3. Once created, go to **Settings > API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### 2. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the entire content of `supabase-schema.sql` file from the project root
3. Click "Run" to execute the schema

### 3. Configure Environment

1. Open `.env.local` in the project root
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, Layout wrapper
│   ├── ui/              # Reusable UI components (GlassCard, Modal, Badge, etc.)
│   ├── charts/          # Recharts visualizations
│   └── receipt/         # Receipt printing template
├── pages/
│   ├── Dashboard.tsx    # Overview & KPIs
│   ├── POS.tsx          # Point of Sale (cashier)
│   ├── Clients.tsx      # Client management
│   ├── Services.tsx     # Service & pricing management
│   ├── Expenses.tsx     # Expense tracking
│   ├── Analytics.tsx    # Revenue & analytics reports
│   └── Settings.tsx     # App settings & preferences
├── db/
│   ├── supabase.ts      # Supabase client setup
│   └── hooks/           # Database hooks (useClients, useServices, etc.)
├── hooks/               # Custom React hooks (useTheme, useLanguage, etc.)
├── utils/               # Utility functions (formatting, CSV export, etc.)
├── locales/             # i18next translation files (ar.json, en.json)
├── App.tsx              # Main app component with routing
└── index.css            # Global styles + glassmorphism utilities
```

---

## 🎯 Core Features

### 1. **Point of Sale (POS)** — `/pos`
- **Phone-first client search**: Type phone number to instantly find returning clients
- **Service grid**: Browse services by category with one-click add to cart
- **Dynamic cart**: Quantity controls, discount (% or fixed), payment method selection
- **Receipt generation**: Formatted for 80mm thermal printers
- **Auto-tracking**: Updates client visit count, total spent, favorite services
- **VIP automation**: Automatically marks clients as VIP when threshold reached

### 2. **Dashboard** — `/`
- **KPI Cards**: Today's revenue, clients, expenses with animated counters
- **Recent Transactions**: Last 5 sales with details
- **Birthday Reminders**: Clients with upcoming birthdays
- **Inactive Alerts**: Clients who haven't visited in 30+ days

### 3. **Client Management** — `/clients`
- Search & filter (by name, phone, VIP status)
- Full client profiles: name, phone, birthday, notes, visit history
- Total spent & visit count tracking
- VIP status with progress indicators
- Add/edit/delete clients

### 4. **Services & Pricing** — `/services`
- Browse services by category (haircut, beard, skincare, kids, packages)
- Quick inline price editing
- Bulk price updates (% increase/decrease)
- Active/inactive toggle
- Add/edit/delete service management

### 5. **Expenses** — `/expenses`
- Category-based expense tracking (supplies, rent, utilities, salary, etc.)
- Date-based filtering & search
- Monthly summary with category breakdown
- Add/edit/delete expenses

### 6. **Analytics** — `/analytics`
- Date range selector (week, month, quarter)
- KPI dashboard: revenue, expenses, net profit, transaction count, avg ticket
- Revenue trend line chart (interactive Recharts)
- Payment method breakdown
- Top services & clients leaderboards

### 7. **Settings** — `/settings`
- Barbershop profile (name, phone, address)
- Display preferences (language: العربية/English, theme: dark/light)
- VIP threshold configuration
- Data management (export/import JSON backups, reset data)

---

## 🌐 Language & Theme

### Switching Language
Click the **language toggle** in the top header to switch between:
- **العربية** (Arabic) — RTL layout, Egyptian locale
- **English** — LTR layout

Language preference is saved to `localStorage`.

### Dark/Light Mode
Click the **theme toggle** (🌙/☀️) in the top header. Dark mode is the default.

Theme preference is saved to `localStorage`.

---

## 📊 Database Schema

All data is stored in Supabase PostgreSQL tables:

- **clients**: Name, phone, birthday, VIP status, visit history
- **services**: Arabic/English names, price, duration, category
- **transactions**: Sales records with items, discount, total, payment method
- **expenses**: Category, amount, date, notes
- **settings**: App configuration (barbershop name, themes, VIP thresholds)
- **barbers**: Barber information (optional multi-barber support)

---

## 🖨️ Printing

### Receipt Printing
1. Complete a sale in POS
2. A receipt modal appears with all transaction details
3. Click the print button or press `Ctrl+P`
4. Your printer will open with the 80mm-formatted receipt
5. Print to a thermal receipt printer for best results

### Report Printing
Any page with a report (client history, expenses, analytics) includes a print button:
- Page layouts automatically hide UI elements when printing
- Charts are replaced with clean text summaries
- Reports are formatted for A4 paper

---

## ⌨️ Keyboard Shortcuts

- **N** — New Sale (open POS)
- **C** — Clients page
- **E** — Expenses page
- **Ctrl+P** — Print current view
- **Esc** — Close any modal

---

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling & glassmorphism utilities |
| **Framer Motion** | Smooth animations & transitions |
| **Supabase** | Backend database (PostgreSQL) |
| **i18next** | Arabic/English translations |
| **Recharts** | Data visualization (charts) |
| **react-hot-toast** | Toast notifications |
| **Fuse.js** | Fuzzy search (clients/services) |
| **Lucide React** | Icon library |

---

## 🎨 Design System

### Color Palette
- **Primary (Gold)**: `#D4AF37` — Accent color for buttons, active states
- **Dark Background**: `#0A0F1E` — Main background (dark mode)
- **Secondary Dark**: `#111827` — Sidebar, cards
- **Glass**: `rgba(255,255,255,0.1)` with `backdrop-blur(20px)` — Card backgrounds

### Typography
- **Cairo** (Google Fonts) — Arabic text, beautiful for Arabic UI
- **Outfit** — English/numbers, modern sans-serif
- **Font Sizes**: 12px (small), 14px (body), 16px (labels), 20px+ (headings)

### Border Radius
- `16px` — Cards & major components
- `12px` — Buttons & inputs
- `8px` — Small elements

### Animations
- Page transitions: `slide + fade` 
- Card entrance: `stagger + scale-up`
- Modal open/close: Spring animation
- Hover effects: Lift effect on cards (+shadow, -4px translate Y)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click "Deploy"

### Deploy to Other Platforms

The app is a static React app that can be deployed to:
- **Netlify**: Drag & drop `dist/` folder or connect GitHub
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Run `npm run build` and deploy `dist/`
- **Any static host** (AWS S3, Cloudflare Pages, etc.)

---

## 🔐 Security Notes

- The `VITE_SUPABASE_ANON_KEY` is **intentionally public** (it's designed for client-side use)
- For production, enable **Row Level Security (RLS)** in Supabase to restrict data access
- Never commit `.env.local` with real credentials to version control
- Supabase provides free SSL/HTTPS by default

---

## 📱 Mobile & Tablet Support

The app is fully responsive:
- **Mobile** (< 768px): Single-column layout, collapsible sidebar
- **Tablet** (768px–1024px): Two-column, touchscreen optimized
- **Desktop** (> 1024px): Full layout with sidebar

**Install as PWA**:
1. Open the app in Chrome/Edge
2. Click the install icon (usually in address bar)
3. Run the app like a native app on your device

---

## ❓ Troubleshooting

### Supabase Connection Issues
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Verify RLS policies allow public read/write (see `supabase-schema.sql`)
- Check Supabase project status in the dashboard

### Missing Data After Reload
- Sample data is seeded on first load
- Check Supabase **Database** > navigate to tables to verify data exists
- If missing, manually run `supabase-schema.sql` again

### Print Not Working
- Ensure your browser allows pop-ups for printing
- Check that `@media print` CSS is applied
- Use Chrome or Edge for best thermal printer compatibility

### Language Not Switching
- Clear `localStorage` in browser DevTools
- Refresh the page after toggling language
- Check that `src/locales/ar.json` and `en.json` exist

---

## 📝 License

This project is created for Egyptian barbershops. Feel free to customize and use.

---

## 🇪🇬 شكراً!

Made with ❤️ for the Egyptian business community.

**Barber Shop Management System** — *Professional solutions for modern barbershops*
