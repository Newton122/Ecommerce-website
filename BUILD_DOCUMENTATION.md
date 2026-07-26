# Blackphics E-Commerce — Full Build Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [How the Project Was Made — Challenges and Solutions](#how-the-project-was-made)
5. [Backend Deep Dive](#backend-deep-dive)
6. [Frontend Deep Dive](#frontend-deep-dive)
7. [Complete Component Reference](#complete-component-reference)
8. [Full Data Flow](#full-data-flow)
9. [SEO](#seo)
10. [System Structure & Design Architecture Guidance](#system-structure--design-architecture-guidance)
11. [Tools and Resources Used](#tools-and-resources-used)

---

## 1. Project Overview

**Blackphics** is a full-stack e-commerce platform for custom T-shirt printing and creative design services, built for the Algerian market. It is a **Next.js App Router frontend** with a **Node.js/Express backend** backed by **PostgreSQL** via **Prisma ORM**.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Node.js, Express, TypeScript, Prisma 5, PostgreSQL |
| Auth | JWT (jsonwebtoken) with bcryptjs password hashing |
| Deployment | Vercel (frontend), Render (backend + PostgreSQL) |
| Email | Resend API for transactional emails |
| File Upload | Cloudinary for image uploads |
| Payments | Cash on Delivery (Algeria-focused) |

### Key Numbers
- **Frontend pages**: ~40+ pages/routes (Shop, Product, Cart, Checkout, Admin, Account, etc.)
- **Backend controllers**: 13 controllers (auth, products, cart, orders, users, profile, reviews, collections, promo, upload, design requests, notifications, products-write)
- **Backend routes**: 17 route files
- **UI components**: ~70+ shadcn/ui components
- **Database tables**: 11 (User, Product, CartItem, Order, OrderItem, Collection, Review, DesignRequest, DesignRequestNote, Notification, Badge/OrderStatus enums)


## 2. Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite + React)               │
│  ┌─────────────┐  ┌──────────────────────────────────┐ │
│  │  AppRouter   │──│  AuthContext / CartContext / ... │ │
│  │  [client-    │  │  useAuth() / useCart() / use()  │ │
│  │   router]    │  │  useRequireAuth() / useSEO()     │ │
│  └──────┬──────┘  └──────────────┬───────────────────┘ │
│         │                        │                       │
│  ┌──────▼─────────────────────────▼───────────────────┐ │
│  │           shadcn/ui Components (70+)               │ │
│  │  Button, Card, Dialog, Form, Table, Navigation...  │ │
│  └──────┬────────────────────────────────────────────┘ │
│         │  fetch("/api/...")  or  fetch(API_BASE + "/api/...") │
└─────────┼──────────────────────────────────────────────┘
          │  HTTP (JSON)
          │  CORS (dev: wildcard, prod: specific origins)
          ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Express + TypeScript)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  server.ts  —  Express app, middleware, CORS       │ │
│  │  dotenv/config, express.json({limit: "10mb"})      │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │              Route Mounting                         │ │
│  │  /api/auth         → auth.routes                    │ │
│  │  /api/products     → products.routes (read)        │ │
│  │  /api/admin/products → products-write.routes        │ │
│  │  /api/cart         → cart.routes (auth required)   │ │
│  │  /api/orders       → orders.routes                 │ │
│  │  /api/admin/orders → orders-write.routes (admin)   │ │
│  │  /api/admin/users  → users.routes (admin)          │ │
│  │  /api/admin/promo  → promo.routes (admin)          │ │
│  │  /api/notifications→ notifications.routes          │ │
│  │  /api/design-requests → designRequests.routes      │ │
│  │  /api/upload       → upload.routes (admin)         │ │
│  │  /api/users/me     → profile.routes (auth)         │ │
│  │  /api/reviews      → reviews.routes                │ │
│  │  /api/collections  → collections.routes            │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │           Controllers (business logic)              │ │
│  │  auth.controller, products.controller, cart.controller││
│  │  orders.controller, users.controller, ...           │ │
│  └────────────────────┬───────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │           Prisma Client → PostgreSQL                │ │
│  │  schema.prisma defines all models and relations     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Project Directory Layout

```
ecommerce_extracted/
├── app/                        ← Next.js App Router artifacts (legacy)
│   ├── layout.tsx              ← Wraps Vite app in Next.js-like layout
│   ├── page.tsx                ← Re-exports Home page
│   ├── [...slug]/page.tsx      ← Catch-all that renders AppRouter
│   └── sitemap.xml/route.ts    ← Sitemap generation route
├── src/
│   ├── main.tsx                ← Vite entry point (ReactDOM.createRoot)
│   ├── app/
│   │   ├── App.tsx             ← Root provider: Theme + Cart context
│   │   ├── AppRouter.tsx       ← Client-side router (popstate-based)
│   │   ├── Layout.tsx          ← Shared layout with Navbar + Footer
│   │   ├── pages/              ← All page components (40+ files)
│   │   │   ├── Home.tsx
│   │   │   ├── Shop.tsx / ProductDetail.tsx
│   │   │   ├── Cart.tsx / Checkout.tsx
│   │   │   ├── Login.tsx / Signup.tsx
│   │   │   ├── AdminDashboard.tsx / AdminProducts.tsx / AdminOrders.tsx
│   │   │   ├── AdminUsers.tsx / AdminProductForm.tsx / AdminAnalytics.tsx
│   │   │   ├── ProfilePage.tsx / OrdersPage.tsx / ReturnsPage.tsx
│   │   │   ├── CustomDesign.tsx / Collections.tsx / CollectionDetail.tsx
│   │   │   └── ... (FAQ, About, Contact, Services, Mockup, etc.)
│   │   ├── components/
│   │   │   ├── Navbar.tsx / Navbar2.tsx   ← Navigation bars
│   │   │   ├── ProductCard.tsx            ← Product display card
│   │   │   ├── Footer.tsx                 ← Site footer
│   │   │   ├── PromoModal.tsx             ← Promotional popup
│   │   │   ├── ConfirmDialog.tsx          ← Confirmation dialogs
│   │   │   ├── ShareButtons.tsx           ← Social sharing
│   │   │   ├── WhatsAppLink.tsx           ← WhatsApp integration
│   │   │   ├── CollectionCTA.tsx          ← Collection call-to-action
│   │   │   ├── TestNav.tsx                ← Test navigation
│   │   │   ├── figma/ImageWithFallback.tsx← Figma image component
│   │   │   └── ui/                       ← 70+ shadcn/ui components
│   │   │       ├── button.tsx, card.tsx, dialog.tsx, input.tsx
│   │   │       ├── table.tsx, form.tsx, select.tsx, textarea.tsx
│   │   │       ├── avatar.tsx, badge.tsx, skeleton.tsx, tabs.tsx
│   │   │       ├── carousel.tsx, slider.tsx, progress.tsx
│   │   │       ├── dropdown-menu.tsx, context-menu.tsx, popover.tsx
│   │   │       ├── toast/sonner.tsx, alert.tsx, sheet.tsx
│   │   │       ├── sidebar.tsx, navigation-menu.tsx, menubar.tsx
│   │   │       ├── calendar.tsx, command.tsx, pagination.tsx
│   │   │       ├── drawer.tsx, hover-card.tsx, resizable.tsx
│   │   │       ├── scroll-area.tsx, separator.tsx, toggle.tsx
│   │   │       ├── toggle-group.tsx, radio-group.tsx, switch.tsx
│   │   │       ├── label.tsx, checkbox.tsx, aspect-ratio.tsx
│   │   │       ├── breadcrumb.tsx, chart.tsx, input-otp.tsx
│   │   │       ├──-accordion.tsx, alert-dialog.tsx, tooltip.tsx
│   │   │       └── utils.ts, use-mobile.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     ← JWT-based auth state
│   │   │   ├── CartContext.tsx     ← Shopping cart (localStorage)
│   │   │   ├── ThemeContext.tsx    ← Dark/light theme toggle
│   │   │   ├── PromoContext.tsx    ← Promotional content
│   │   │   ├── NotificationContext.tsx ← In-app notifications
│   │   │   └── AnalyticsContext.tsx ← Analytics tracking
│   │   ├── hooks/
│   │   │   ├── useRequireAuth.ts   ← Redirect to login if unauthenticated
│   │   │   └── useSEO.ts           ← Dynamic SEO meta tags
│   │   ├── data/
│   │   │   ├── types.ts            ← TypeScript interfaces (Product, User, Review)
│   │   │   └── reviews.ts          ← Review data
│   │   └── shims/
│   │       ├── next-link.tsx       ← Next.js Link shim (uses history API)
│   │       └── next-navigation.ts  ← Next.js useRouter shim
│   └── styles/
│       ├── index.css               ← Font imports + Tailwind + Theme
│       ├── tailwind.css             ← Tailwind v4 entry (@import 'tailwindcss')
│       ├── theme.css                ← CSS variables, dark mode, @theme inline
│       ├── fonts.css                ← Google Fonts (Inter, Manrope)
│       └── globals.css              ← (empty, global reset)
├── blackphics-backend/
│   ├── src/
│   │   ├── server.ts               ← Express app setup, CORS, route mounting
│   │   ├── lib/prisma.ts           ← PrismaClient singleton with hot-reload fix
│   │   ├── middleware/
│   │   │   ├── auth.ts             ← requireAuth + requireAdmin middleware
│   │   │   └── asyncHandler.ts     ← Wraps async route handlers for Express
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts       ← signup, login
│   │   │   ├── products.controller.ts   ← list, get single
│   │   │   ├── products-write.controller.ts ← create, update, delete (admin)
│   │   │   ├── cart.controller.ts       ← CRUD cart items
│   │   │   ├── orders.controller.ts     ← create, list, update status, cancel
│   │   │   ├── users.controller.ts      ← list, update role, toggle, delete
│   │   │   ├── profile.controller.ts    ← update own profile
│   │   │   ├── reviews.controller.ts    ← list, create reviews
│   │   │   ├── collections.controller.ts← list collections
│   │   │   ├── promo.controller.ts      ← send promo emails (Resend)
│   │   │   ├── upload.controller.ts     ← image upload (Cloudinary)
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── auth.routes.ts           ← POST /signup, POST /login
│   │   │   ├── products.routes.ts       ← GET /products, GET /products/:id
│   │   │   ├── products-write.routes.ts ← POST/PUT/DELETE (admin)
│   │   │   ├── cart.routes.ts           ← GET/POST/PATCH/DELETE (auth)
│   │   │   ├── orders.routes.ts         ← GET /orders, POST /orders
│   │   │   ├── orders-write.routes.ts   ← GET all, PATCH status (admin)
│   │   │   ├── users.routes.ts          ← GET /admin/users (admin)
│   │   │   ├── profile.routes.ts        ← PATCH /users/me (auth)
│   │   │   ├── reviews.routes.ts        ← GET /reviews, POST /reviews
│   │   │   ├── collections.routes.ts    ← GET /collections
│   │   │   ├── promo.routes.ts          ← POST /admin/promo (admin)
│   │   │   ├── notifications.routes.ts  ← GET /notifications
│   │   │   ├── designRequests.routes.ts ← CRUD design requests
│   │   │   ├── upload.routes.ts         ← POST /upload (admin)
│   │   │   └── ...
│   │   └── prisma/
│   │       ├── schema.prisma    ← DB schema (11 models, 2 enums)
│   │       ├── seed.ts          ← Seeds 6 products
│   │       └── migrations/      ← Generated migration files
│   ├── .env                     ← DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN
│   ├── package.json             ← Express, Prisma, bcryptjs, jsonwebtoken, etc.
│   └── tsconfig.json
├── vite.config.ts               ← Vite config with aliases, Next.js shims, proxy
├── tsconfig.json                ← TypeScript config (Vite project)
└── index.html                   ← Vite HTML entry point
```


## 3. How Routing Works

This project uses **Next.js App Router** for the frontend. The `app/` directory at the project root is the Next.js App Router root.

### Root Layout & Metadata

- `app/layout.tsx` — Root layout wrapping all pages. It defines **metadata** (title, description, Open Graph, Twitter cards, robots, canonical URL) and injects **JSON-LD structured data** for the Organization schema.
- `app/page.tsx` — Renders the Home page (`src/app/pages/Home`).
- `app/error.tsx` — Error boundary for unexpected rendering errors.
- `app/not-found.tsx` — 404 page for unmatched routes.

### Catch-All Client Router

- `app/[...slug]/page.tsx` — A client-side catch-all page that renders `AppRouter`. It catches any URL not explicitly defined as a server-side route (e.g., `/shop/123`, `/collections/featured`).

### Client-Side Router (AppRouter.tsx)

`src/app/AppRouter.tsx` is a client component that uses `usePathname()` to determine which page to render for each URL. It handles:

1. **Auth redirects** — Sends logged-in users away from `/login`/`/signup`, and non-admin users away from `/admin/*`
2. **Page matching** — Matches pathname against known routes (exact and prefix-based) and renders the corresponding component
3. **Analytics tracking** — Fires a `page_view` event on every navigation

### Routing Flow

```
Browser navigates to https://ecommerce-blacphics-stigma.vercel.app/shop/42

1. Next.js matches "/shop/42" against app/page.tsx (doesn't match)
2. Next.js matches against app/[...slug]/page.tsx → renders AppRouter
3. AppRouter reads pathname = "/shop/42"
4. AppRouter matches pathname.startsWith("/shop/") → renders <ProductDetail />
5. React re-renders with the ProductDetail component
6. ProductDetail fetches product data from /api/products/:id
```

### Server-Side vs Client-Side Pages

| Route | Type | Rendered By |
|-------|------|-------------|
| `/` | Server Component (`app/page.tsx`) | Next.js at build time (static) |
| `/sitemap.xml` | Route Handler (`app/sitemap.xml/route.ts`) | Next.js at request time (dynamic) |
| All other routes | Client Component (`app/[...slug]/page.tsx`) | AppRouter client-side |

---

## 4. How the Project Was Made — Challenges and Solutions

### Challenge 1: PostgreSQL Not Connecting (Original Issue)

**Symptom**: The backend could not connect to the database.

**Root Cause — Multiple Issues Found**:

| # | Issue | How Found | Fix Applied |
|---|-------|-----------|-------------|
| 1 | **Prisma migrations never run** | `.env` had correct `DATABASE_URL` but no `prisma migrate dev` had been executed. The `blackphics` database and user existed but had no tables. | Ran `npx prisma generate` then `npx prisma migrate dev --name init` |
| 2 | **DB user lacks schema privileges** | Migration failed with `permission denied for schema public` | Connected as `postgres` user via `psql` and ran `GRANT ALL ON SCHEMA public TO blackphics` |
| 3 | **Prisma client not generated** | `node_modules/@prisma/client` existed but was stale | Re-ran `npx prisma generate` after migration |

**Key Lesson**: Having a valid PostgreSQL connection string is not enough. The Prisma client must be generated, migrations must be applied, and the database user must have schema permissions. The `prisma.ts` file had a soft catch-all that silently swallowed migration errors — it now fails loudly in non-production mode.

**Commands that fixed it**:
```bash
sudo -u postgres psql -d blackphics -c "GRANT ALL ON SCHEMA public TO blackphics; GRANT ALL ON DATABASE blackphics TO blackphics; ALTER USER blackphics CREATEDB;"
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### Challenge 2: Frontend "Not Loading" (Port Conflicts)

**Symptom**: Frontend dev server on port 5173 was not responding; Vite kept jumping to port 5174.

**Root Cause**: Another process (or a stale Vite instance) was holding port 5173. Vite's default behavior is to auto-increment to the next available port (5174, 5175, etc.).

**Fix**: Killed all stale Node processes on ports 4000, 5173, 3000:
```bash
lsof -ti:4000,5173,3000 | xargs kill -9 2>/dev/null
```

Then restarted both backend and frontend cleanly. The frontend now starts predictably on port 5173.

**Prevention**: Added `--host 0.0.0.0` to Vite dev server config so it binds to all interfaces (needed for phone/mobile access on the local network).

### Challenge 3: Signup Login "Unable to Reach Backend" (CORS + Hardcoded URL)

**Symptom**: The frontend signup button showed "Unable to reach the backend. Make sure the API is running on port 4000."

**Root Cause — Two Stacked Problems**:

**Problem A: Hardcoded API URL**
`Signup.tsx` and `Login.tsx` had:
```typescript
return "http://127.0.0.1:4000"
```
When a user opens the frontend on their **phone** at `http://192.168.8.147:5173`, the browser tries to reach `http://127.0.0.1:4000` — which points to the **phone itself**, not the PC running the backend. Connection refused.

**Fix**: Changed the default API URL to an empty string (`""`), making all API calls relative:
```typescript
return ""  // Now fetch("/api/auth/signup") uses same origin as the page
```

**Problem B: No Proxy for Relative API Paths**
Relative paths like `/api/auth/signup` would break in production unless a reverse proxy (Nginx) is configured. In development, there was no mechanism to forward `/api/*` requests to the Express backend.

**Fix**: Added a Vite dev server proxy in `vite.config.ts`:
```typescript
server: {
  host: '0.0.0.0',
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    },
  },
},
```

The proxy intercepts any request starting with `/api` and forwards it to `http://localhost:4000/api/...`. This works for both local development and phone access — the phone hits `192.168.8.147:5173/api/auth/signup`, Vite proxies it to `localhost:4000/api/auth/signup` on the same machine.

### Challenge 4: Backend CORS Blocking Frontend Origins

**Symptom**: Even with the hardcoded API fix, some origin combinations were blocked by CORS.

**Root Cause**: The backend CORS config was initially restrictive. In production mode (`NODE_ENV=production`), it only allows specific origins. In development, after fixing, it uses `origin: "*"` with a smart `isAllowedOrigin()` function that handles localhost, 127.0.0.1, the local network IP (`192.168.8.147`), and `.vercel.app` domains.

**Fix in `server.ts`** (lines 40-61):
- Dev mode allows any localhost/127.x/192.168.x origin
- Production mode allows only configured origins + `.vercel.app`
- The middleware is set to `origin: "*"` with `methods` and `allowedHeaders` explicitly listed for maximum dev flexibility

### Challenge 5: tsconfig.json Containing Next.js Artifacts

**Symptom**: TypeScript was checking Next.js-specific files that don't apply to a Vite project, and core source files were excluded from type checking.

**Root Cause**: The `tsconfig.json` was a leftover from when the project was set up as or alongside a Next.js app. It contained:
- `"plugins": [{ "name": "next" }]` — a Next.js language service plugin
- `"include": ["next-env.d.ts", ".next/types/**/*.ts"]` — Next.js type artifacts
- `"exclude": ["src/main.tsx", "src/app/AppRouter.tsx", "src/shims"]` — excluded core files from type checking

**Fix**: Removed Next.js-specific config, excluded only `node_modules`, `dist`, and `.next`:
```json
{
  "include": ["**/*.ts", "**/*.tsx", "vite.config.ts"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### Challenge 6: Unused `Home` Import in `main.tsx`

The original `src/main.tsx` imported `Home` from `./app/pages/Home` but never rendered it. This is dead code that clutters the entry point.

**Fix**: Removed the unused import. The `Home` page is already rendered by `AppRouter.tsx` as the default route.


---

## 5. Backend Deep Dive

### server.ts — The Core File
`blackphics-backend/src/server.ts` is the main Express application. Key features:
- **dotenv/config**: Loads environment variables from `.env` at import time
- **CORS middleware**: Configured with `origin: "*"` in dev (permissive), or origin-checking function in production
- **express.json({ limit: "10mb" })**: Allows large request bodies (needed for image uploads)
- **Route mounting**: All API routes prefixed with `/api` or `/api/admin`
- **Error handler**: Catches all unhandled errors and returns 403 (CORS errors) or 500
- **Prisma import**: `import { prisma } from "./lib/prisma.js"` — ensures the Prisma client is loaded at startup

### Middleware Layer
**`middleware/auth.ts`** — Two exported functions:
- `requireAuth(req, res, next)` — Extracts JWT from `Authorization: Bearer <token>` header, verifies it, checks if user exists and is active, then sets `req.userId` and `req.userRole`
- `requireAdmin(req, res, next)` — Wraps `requireAuth` and additionally checks `req.userRole === "admin"`

**`middleware/asyncHandler.ts`** — A simple wrapper that converts async route handlers to error-safe Express middleware:
```typescript
export function asyncHandler(fn: Function) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
```
Without this, unhandled promise rejections in async route handlers would crash the server.

### Prisma Client (`lib/prisma.ts`)
- Singleton pattern using `globalThis.prisma` to avoid exhausting DB connections during Vite hot reload
- Eager connection check on startup (`prisma.$connect()`) that fails loudly in non-production mode
- Uses `findFirst()` on User table to verify schema exists

### Controller Pattern
Every controller follows the same pattern:
1. Import `Request`, `Response`, `prisma` 
2. Parse and validate request body with Zod schemas
3. Query Prisma with proper `include` for relations
4. Return JSON response with appropriate status code
5. All async operations use the `asyncHandler` middleware

### Key Backend Routes
| Route Prefix | Middleware | Description |
|-------------|-----------|-------------|
| `/api/auth/*` | None | Signup and login |
| `/api/products/*` | None | Read product list and details |
| `/api/collections/*` | None | Read collection data |
| `/api/reviews/*` | None | List reviews; create requires auth |
| `/api/cart/*` | requireAuth | Full cart CRUD |
| `/api/orders/*` | requireAuth | Create order, list user orders, cancel, confirm delivery |
| `/api/admin/*` | requireAdmin + rate limiting | Full admin operations |
| `/api/design-requests/*` | Custom JWT check | Custom T-shirt design submissions |
| `/api/upload/*` | requireAdmin | Image upload via Cloudinary |
| `/api/notifications/*` | requireAuth | Get user notifications |
| `/api/users/me` | requireAuth | Update profile |

### Database Schema (Prisma)
The schema defines 11 models with rich relationships:
- **User** (id, email, passwordHash, name, role, isActive) — has cartItems, orders, reviews, notifications
- **Product** (id, name, slug, price, category, colors, sizes, stock, badge) — has cartItems, orderItems, collections, reviews
- **Collection** — groups products together with a slug and image
- **CartItem** — unique constraint on [userId, productId, size, color]
- **Order** → OrderItem (1-to-many), status progression: pending → paid → shipped → delivered (or cancelled at any point)
- **DesignRequest** — for custom T-shirt design submissions with position/rotation/scale metadata
- **Notification** — in-app notifications tied to users
- **Review** — product ratings (1-5) with comments

### Order Status Flow
```
pending → paid → shipped → delivered
  ↓         ↓         ↓
 cancelled at any stage
```

### Email Integration (Resend)
- Order status change emails are sent automatically
- Promo emails are sent via `/api/admin/promo` (admin only)
- Design request status updates trigger both in-app notifications AND email
- The Resend API key is required; if absent, emails are silently skipped with a console warning

---

## 6. Frontend Deep Dive

### main.tsx — Entry Point
```typescript
createRoot(document.getElementById("root")!).render(
  <App>
    <Layout>
      <AppRouter />
    </Layout>
  </App>
);
```
The `App` wrapper provides Theme + Cart context providers. `Layout` wraps all pages with Navbar + Footer + page transition animations.

### AppRouter.tsx — Client-Side Router
A client component using `usePathname()` from `next/navigation` to determine which page to render for each URL. It handles:

1. **Auth redirects** — Sends logged-in users away from `/login`/`/signup`, and non-admin users away from `/admin/*`
2. **Page matching** — Matches pathname against known routes (exact and prefix-based) and renders the corresponding component
3. **Analytics tracking** — Fires a `page_view` event on every navigation

### Routing Flow in Detail
```
Browser navigates to https://ecommerce-blacphics-stigma.vercel.app/shop/42

1. Next.js matches "/shop/42" against app/page.tsx (doesn't match)
2. Next.js matches against app/[...slug]/page.tsx → renders AppRouter
3. AppRouter reads pathname = "/shop/42"
4. AppRouter matches pathname.startsWith("/shop/") → renders <ProductDetail />
5. React re-renders with the ProductDetail component
6. ProductDetail fetches product data from /api/products/:id
```

### AuthContext.tsx — Authentication State
The `AuthProvider` wraps the entire app and manages:
- `user: User | null` — current logged-in user
- `token: string | null` — JWT token
- `loading: boolean` — initial load state
- `login(email, password)` — POST to `/api/auth/login`
- `signup(email, password, name)` — POST to `/api/auth/signup`
- `logout()` — removes tokens from localStorage, redirects to `/`
- `updateProfile(data)` — PATCH to `/api/users/me`

Auth tokens persist in `localStorage` (`blacphics_token` and `blacphics_user`) so the user stays logged in across page refreshes.

### useRequireAuth Hook
A guard hook used by admin and account pages:
```typescript
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  if (!loading && !user) {
    router.push("/login");
  }
  return { user, loading };
}
```
If user is not logged in after initial load, redirects to login page.

### useSEO Hook
Dynamically sets `<title>`, `<meta name="description">`, Open Graph tags, and canonical URLs for each page. Uses the live site URL prefix for proper SEO across all routes.

---

## 7. Complete Component Reference

### Core Layout Components
- **`Layout.tsx`** — Wraps page content with padding and animation constraints
- **`App.tsx`** — Root provider combining `ThemeProvider` + `CartProvider`
- **`AppRouter.tsx`** — Client-side router, determines which page to render
- **`Navbar.tsx`** — Fixed top navigation with logo, links, cart badge, theme toggle, mobile menu
- **`Navbar2.tsx`** — Alternate navigation variant (admin-focused)
- **`Footer.tsx`** — Site footer with links and branding
- **`TestNav.tsx`** — Navigation test component (used during development)

### Page Components (Complete List)
| Page File | Route | Auth Required | Description |
|-----------|-------|--------------|-------------|
| `Home.tsx` | `/` | No | Landing page |
| `Shop.tsx` | `/shop` | No | Product listing with categories |
| `ProductDetail.tsx` | `/shop/:id` | No | Single product view |
| `Login.tsx` | `/login` | No | Login form |
| `Signup.tsx` | `/signup` | No | Registration form |
| `Cart.tsx` | `/cart` | No | Shopping cart (user or guest) |
| `Checkout.tsx` | `/checkout` | Yes | Cash on delivery checkout |
| `OrdersPage.tsx` | `/orders` | Yes | User's order history |
| `ProfilePage.tsx` | `/profile` | Yes | User profile editing |
| `ReturnsPage.tsx` | `/returns` | Yes | Return requests |
| `Collections.tsx` | `/collections` | No | Browse collections |
| `CollectionDetail.tsx` | `/collections/:id` | No | Single collection view |
| `CustomDesign.tsx` | `/custom` | No | Custom design form |
| `Mockup.tsx` | `/mockup` | No | Design mockup preview |
| `FAQ.tsx` | `/faq` | No | FAQ page |
| `About.tsx` | `/about` | No | About page |
| `Contact.tsx` | `/contact` | No | Contact page |
| `Services.tsx` | `/services` | No | Services page |
| `AdminDashboard.tsx` | `/admin` | Yes (admin) | Admin overview |
| `AdminProducts.tsx` | `/admin/products` | Yes (admin) | Product management |
| `AdminProductForm.tsx` | `/admin/products/:id` | Yes (admin) | Create/edit product |
| `AdminOrders.tsx` | `/admin/orders` | Yes (admin) | Order management |
| `AdminUsers.tsx` | `/admin/users` | Yes (admin) | User management |
| `AdminAnalytics.tsx` | `/admin/analytics` | Yes (admin) | Analytics dashboard |
| `account/design-requests/page.tsx` | `/account/design-requests` | Yes (user) | User's design requests |
| `admin/design-requests/page.tsx` | `/admin/design-requests` | Yes (admin) | All design requests |

### shadcn/ui Component Library (70+ Components)

Every component in `src/app/components/ui/` is a **shadcn/ui** component. These are not standard npm packages — they are **copied into the project** from the shadcn/ui registry. Each file can be edited freely since it's project-local copy.

**Layout Components**: Card, Sheet, Dialog, Drawer, AlertDialog, Popover, Tooltip, HoverCard, DropdownMenu, Menubar, NavigationMenu, Tabs, Accordion

**Form Components**: Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Form (composes all inputs), InputOtp

**Data Display**: Table, Badge, Skeleton, Progress, Calendar, Chart, Command, Pagination, Separator, ScrollArea, AspectRatio

**Feedback**: Alert, Toast (sonner), Progress

**Utilities**: Button (with variants), Collapsible, Resizable, Sheet, Tabs, Toggle, ToggleGroup, ContextMenu

**Each component follows the shadcn/ui pattern**:
1. Renders a primitive HTML element with Tailwind classes
2. Uses `cva()` (class-variance-authority) for variant styling
3. Uses `clsx()` / `cn()` for conditional class merging
4. Accepts `className` prop for external styling overrides

### Context Providers (Data Layer)
| Context | File | Purpose |
|---------|------|---------|
| AuthContext | `context/AuthContext.tsx` | JWT auth, user state, login/signup/logout |
| CartContext | `context/CartContext.tsx` | Shopping cart with localStorage persistence |
| ThemeContext | `context/ThemeContext.tsx` | Dark/light theme toggle with persistence |
| PromoContext | `context/PromoContext.tsx` | Promotional popups and banners |
| NotificationContext | `context/NotificationContext.tsx` | In-app notification feed |
| AnalyticsContext | `context/AnalyticsContext.tsx` | Event tracking for analytics |

### Special Components
- **`WhatsAppLink.tsx`** — Generates WhatsApp URLs for order communication
- **`ShareButtons.tsx`** — Social media sharing buttons
- **`PromoModal.tsx`** — Promotional popup dialog
- **`ConfirmDialog.tsx`** — Generic confirmation dialog (used for delete actions, order cancellations)
- **`CollectionCTA.tsx`** — Call-to-action for product collections
- **`ImageWithFallback.tsx`** — Handles image loading failures with a placeholder
- **`ErrorBoundary.tsx`** — Catches React rendering errors and displays a fallback UI

---

## 8. Full Data Flow

### User Signup Flow
```
1. User fills Signup form (email, password, name)
2. Frontend: fetch("/api/auth/signup", { method: "POST", body: {email, password, name} })
3. Backend: signup controller validates with Zod → hashes password with bcryptjs → creates User in DB
4. Backend: JWT token created with jwt.sign({userId}, JWT_SECRET, {expiresIn: "7d"})
5. Backend: returns {token, user: {id, email, name}}
6. Frontend: stores token in localStorage ("blacphics_token") and user object ("blacphics_user")
7. Frontend: updates AuthContext state (user + token)
8. Frontend: router.push("/") → navigates to Home page
```

### User Login Flow
```
1. User fills Login form (email, password)
2. Frontend: fetch("/api/auth/login", { method: "POST", body: {email, password} })
3. Backend: finds user by email → compares password with bcryptjs.compare()
4. Backend: if valid, returns {token, user}
5. Frontend: same localStorage + AuthContext update as signup
```

### Add to Cart Flow
```
1. User clicks "Add to Cart" on ProductDetail
2. Frontend: dispatch addItem to CartContext
3. CartContext: if item exists (same userId+productId+size+color), increment quantity; else create new
4. CartContext: persist to localStorage ("blackphics-cart")
5. CartContext: update state → triggers re-render of cart badge in Navbar
```

### Checkout Flow
```
1. User clicks "Place Order" on Checkout page
2. Frontend: fetch("/api/orders", { method: "POST", body: {address, city, phone}, headers: {Authorization: Bearer <token>} })
3. Backend:
   a. Validate input with Zod
   b. Fetch user's cart items with product data
   c. Check stock availability (reject if any item insufficient)
   d. Calculate totalPrice (sum of price * quantity for all items)
   e. Inside a Prisma $transaction:
      - Create Order row
      - Create OrderItem rows for each cart item
      - Delete all CartItem rows for this user
      - Decrement stock for each purchased product
   f. Return created order
4. Frontend: clear cart, set submitted=true, show confirmation page
5. Backend: send order confirmation email via Resend
```

### Admin Order Status Flow
```
1. Admin opens AdminOrders page
2. Fetch GET /api/admin/orders (requires auth + admin role)
3. Admin changes status dropdown for an order
4. Fetch PATCH /api/admin/orders/:id/status with {status}
5. Backend validates status transition against validTransitions map
6. Backend updates Order status in DB
7. Backend sends email notification to customer via Resend
8. Frontend updates local state, shows toast success
```

### Design Request Flow (Custom T-Shirt)
```
1. User fills CustomDesign form (shirt type, color, placement, design image, mockup)
2. POST /api/design-requests with all form data
3. Backend creates DesignRequest row in DB
4. Admin sees new request in AdminOrders → /admin/design-requests
5. Admin updates status (pending → in_progress → completed/rejected)
6. On status change:
   a. Backend creates Notification row for the user
   b. Backend sends email via Resend
   c. If user has phone, WhatsApp URL is generated
7. User sees notification at /account/design-requests
8. Admin can add notes to design requests
   a. POST /api/design-requests/:id/notes with {message}
   b. Creates DesignRequestNote + Notification
   c. Sends email + WhatsApp message to user
```


---

## SEO

### Meta Tags
The root layout (`app/layout.tsx`) defines global metadata that applies to every page:

| Tag | Value | Purpose |
|-----|-------|---------|
| `metadataBase` | `https://ecommerce-blacphics-stigma.vercel.app` | Base URL for resolving relative OG/canonical URLs |
| `title.default` | `"Blacphics — Algeria's Premier Creative Studio"` | Default `<title>` for pages without custom titles |
| `title.template` | `"%s | Blacphics"` | Pattern for per-page titles (e.g., "Shop | Blacphics") |
| `description` | `"Custom apparel, graphic design, photography and branding from Algeria..."` | Shown as the snippet in Google search results |
| `keywords` | `["custom printing", "graphic design", "Algeria", "apparel", "branding", ...]` | Keywords for search engines |
| `openGraph` | type, url, siteName, image (1200×630) | Facebook/LinkedIn/WhatsApp link preview |
| `twitter.card` | `"summary_large_image"` | Twitter/X share card with large image |
| `robots.index` | `true` | Allow indexing by search engines |
| `robots.follow` | `true` | Follow links on the page |
| `alternates.canonical` | `"https://ecommerce-blacphics-stigma.vercel.app"` | Preferred URL to prevent duplicate content |

### JSON-LD Structured Data
`app/layout.tsx` injects an `<script type="application/ld+json">` tag with an `Organization` schema. This tells search engines about Blackphics as a business entity and can trigger rich search results (logo, description).

### Dynamic SEO with `useSEO` Hook
`src/app/hooks/useSEO.ts` dynamically updates the document title, meta description, Open Graph tags, and canonical URL on each client-side navigation. This ensures SEO tags are correct even when navigating via the client-side router.

The hook uses the live site URL (`https://ecommerce-blacphics-stigma.vercel.app`) for canonical and OG URLs — not the old `blacphics.com` domain.

### Sitemap (`app/sitemap.xml/route.ts`)
A dynamic `sitemap.xml` route is served at `https://ecommerce-blacphics-stigma.vercel.app/sitemap.xml`. It lists all indexable static pages with `lastmod`, `changefreq`, and `priority` values. This helps Googlebot discover all pages faster.

### Robots.txt (`public/robots.txt`)
Controls which paths crawlers should and shouldn't visit:
- `Allow: /` — crawl all public pages
- `Disallow: /admin/`, `/account/`, `/api/` — block private/API paths
- `Crawl-delay: 10` — be respectful to the server

### Submitting to Google
To get Google to index the site:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://ecommerce-blacphics-stigma.vercel.app`
3. Verify ownership (DNS or file upload)
4. Submit sitemap URL: `https://ecommerce-blacphics-stigma.vercel.app/sitemap.xml`
5. Request indexing of the homepage

---

## 9. System Structure & Design Architecture Guidance

### Recommended Development Workflow

#### Starting the Project
```bash
# Terminal 1: Start the backend
cd blackphics-backend
npm run dev

# Terminal 2: Start the frontend
cd ../   (or ecommerce_extracted/)
npm run dev -- --host 0.0.0.0
```

The backend starts on `http://localhost:4000` and the frontend on `http://localhost:5173`. The Vite proxy forwards `/api/*` requests to the backend, so the frontend never needs to know the backend port.

#### Database Setup (First Time Only)
```bash
# 1. Ensure PostgreSQL is running
pg_isready -h localhost -p 5432

# 2. Create the database and user (if needed)
sudo -u postgres psql -c "CREATE DATABASE blackphics;"
sudo -u postgres psql -c "CREATE USER blackphics WITH PASSWORD 'blackphics';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE blackphics TO blackphics;"

# 3. Grant schema permissions
sudo -u postgres psql -d blackphics -c "GRANT ALL ON SCHEMA public TO blackphics;"
sudo -u postgres psql -d blackphics -c "ALTER USER blackphics CREATEDB;"

# 4. Generate Prisma client
cd blackphics-backend
npm run prisma:generate

# 5. Run migrations
npx prisma migrate dev --name init

# 6. Seed with sample products
npm run prisma:seed
```

#### Key Environment Variables (`.env`)
```env
DATABASE_URL="postgresql://blackphics:blackphics@localhost:5432/blackphics?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
PORT=4000
CORS_ORIGIN="http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173"
RESEND_API_KEY=        # Required for email functionality
RESEND_FROM=           # Optional, defaults to Blackphics <no-reply@blackphics.com>
CLOUDINARY_CLOUD_NAME= # Required for image uploads
CLOUDINARY_API_KEY=    # Required for image uploads
CLOUDINARY_API_SECRET= # Required for image uploads
```

### System Design Principles

#### 1. Separate Frontend and Backend
The frontend (Vite + React) and backend (Express + TypeScript) are completely decoupled. The frontend makes HTTP requests to the backend's REST API. This allows:
- Independent deployment (frontend on Vercel, backend on any VPS)
- Different tech stacks if needed in the future
- Clear separation of concerns

#### 2. REST API Design
- **Read operations** use GET (no authentication needed for products, collections, reviews)
- **Write operations** use POST/PATCH/DELETE (authentication required via JWT)
- **Admin operations** use `/api/admin/...` prefix with `requireAdmin` middleware
- All requests and responses use JSON
- Zod validation on all incoming request bodies

#### 3. Auth Flow
- JWT tokens (not session cookies)
- Tokens stored in localStorage client-side
- Tokens passed in `Authorization: Bearer <token>` header
- 7-day token expiration
- Middleware validates token on every request to protected routes

#### 4. Database Design
- PostgreSQL with Prisma ORM
- Each model has appropriate indexes (e.g., User.email is unique, Product.slug is unique)
- Transactions used for operations that span multiple tables (e.g., order creation + cart clearing + stock deduction)
- Cascade deletes on relationships where appropriate (CartItem, OrderItem)

#### 5. Error Handling
- Backend uses Zod for input validation → returns 400 with field-level errors
- Backend uses `asyncHandler` wrapper → prevents unhandled promise rejections from crashing the server
- Frontend catches fetch errors → shows user-friendly toast messages
- Global Express error handler catches 403 (CORS) and 500 (server) errors

### How to Extend This Project

#### Adding a New Page
1. Create the page component in `src/app/pages/YourPage.tsx`
2. Import it in `src/app/AppRouter.tsx`
3. Add a pathname match in the AppRouter's if-chain
4. Add a nav link in `src/app/components/Navbar.tsx`
5. If the page needs data from backend, create a route in `blackphics-backend/src/routes/` and mount it in `server.ts`
6. Import the shadcn/ui components you need from `src/app/components/ui/`
7. For SEO, add per-page metadata in `app/layout.tsx` or use the `useSEO()` hook inside the page component

#### Adding a New API Endpoint
1. Create a controller in `blackphics-backend/src/controllers/`
2. Create a route file in `blackphics-backend/src/routes/`
3. Mount the route in `blackphics-backend/src/server.ts`
4. Import AuthRequest, requireAuth, requireAdmin, asyncHandler as needed
5. Validate all inputs with Zod schemas before database operations
6. Use Prisma transactions for multi-table operations

#### Adding a New Frontend Context
1. Create the context file in `src/app/context/`
2. Define the context type interface and default value
3. Create the Provider component with useState/useEffect
4. Export a custom hook (e.g., `useMyContext()`)
5. Wrap the app's children with the Provider in `src/app/App.tsx`

### Design Architecture Best Practices Observed in This Project

1. **TypeScript throughout** — Both frontend and backend are fully typed. This catches errors at build time rather than runtime.

2. **Zod for validation** — Consistent input validation on both backend (body parsing) and frontend (form validation). All API responses follow a consistent `{data}` or `{error}` shape.

3. **shadcn/ui components** — All UI components are locally copied, not referenced from npm. This means you can customize them freely without lock-in.

4. **Tailwind CSS utility classes** — Styling is done entirely with Tailwind classes. The design system uses CSS custom properties (defined in `theme.css`) for brand colors, spacing, and typography.

5. **Next.js App Router** — File-based routing with server and client components. Metadata is defined in `app/layout.tsx`. Dynamic routes use `[...slug]` catch-all.

6. **localStorage for persistence** — Auth tokens and cart items persist across page reloads. This is simple and effective for an e-commerce app.

7. **Rate limiting on admin routes** — Prevents brute-force and accidental flooding of admin endpoints.

8. **Separate read/write routes** — Admin-only routes (`products-write`, `orders-write`) are separated from public read routes (`products`). This provides clear access control boundaries.

9. **SEO by default** — Every page includes dynamic meta tags (title, description, Open Graph, canonical URL) via the `useSEO` hook and root layout metadata. A `sitemap.xml` is auto-generated and `robots.txt` guides crawlers.

### System Structure for a New Project (Design Guidelines)

```
my-ecommerce/
├── frontend/                    # Next.js + React + TypeScript
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout (metadata, providers)
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── [...slug]/page.tsx  ← Catch-all client-side router
│   │   │   ├── App.tsx        # Root provider wrapper
│   │   │   ├── AppRouter.tsx  # Client-side router
│   │   │   ├── Layout.tsx     # Shared layout (navbar, footer)
│   │   │   ├── context/       # React contexts (Auth, Cart, Theme)
│   │   │   ├── hooks/         # Custom hooks (useAuth, useCart)
│   │   │   ├── components/
│   │   │   │   ├── ui/       # shadcn/ui components
│   │   │   │   └── ...       # Custom components
│   │   │   └── pages/        # All page components
│   │   └── styles/            # CSS, Tailwind config
│   ├── package.json           # Next.js + React dependencies
│   └── next.config.ts         # Next.js config (API rewrites)
├── backend/                     # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── server.ts          # Express app setup
│   │   ├── middleware/        # Auth, asyncHandler, rate limiting
│   │   ├── controllers/       # Business logic for each domain
│   │   ├── routes/            # Express route definitions
│   │   ├── lib/               # Prisma client singleton
│   │   └── prisma/            # Schema, migrations, seed
│   ├── .env                   # Environment variables
│   └── package.json           # Express + Prisma dependencies
└── README.md
```

---

## 10. Tools and Resources

### Websites for Design System & Architecture
| Purpose | Website | URL |
|---------|---------|-----|
| Tailwind CSS docs | tailwindcss.com | https://tailwindcss.com/docs |
| shadcn/ui components | ui.shadcn.com | https://ui.shadcn.com/docs |
| Framer Motion (animations) | framer.com | https://www.framer.com/motion/ |
| Prisma ORM | prisma.io | https://www.prisma.io/docs |
| Express.js | expressjs.com | https://expressjs.com/ |
| PostgreSQL | postgresql.org | https://www.postgresql.org/docs/ |
| Tailwind CSS Play (experiment) | tailwindcss.com/play | https://tailwindcss.com/play |
| Radix UI (component primitives) | radix-ui.com | https://www.radix-ui.com/primitives |
| Figma Community (templates) | figma.com/community | https://www.figma.com/community |
| Lucide Icons | lucide.dev | https://lucide.dev/ |
| AOS Animations | michalsnik.github.io/aos | https://michalsnik.github.io/aos/ |
| Sonner Toasts | sonner.emilkowal.ski | https://sonner.emilkowal.ski/ |
| React Hook Form | react-hook-form.com | https://react-hook-form.com/ |
| Zod (validation) | zod.dev | https://zod.dev/ |
| Resend (email) | resend.com | https://resend.com/docs |
| Cloudinary (image hosting) | cloudinary.com | https://cloudinary.com/documentation |
| Next.js docs | nextjs.org | https://nextjs.org/docs |

### Design Architecture Resources
| Resource | URL | Purpose |
|----------|-----|---------|
| Atomic Design | https://atomicdesign.bradfrost.com | Component hierarchy methodology |
| Server-Side Rendering vs SSR vs SSG | https://vercel.com/blog/ssr-vs-ssg | When to use each rendering approach |
| REST API Design Best Practices | https://github.com/microsoft/api-guidelines | Microsoft's API guidelines |
| Postgres vs MongoDB | https://www.atlas.mongodb.com/comparisons/postgresql-vs-mongodb | Database choice guide |
| JWT Best Practices | https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html | OWASP JWT guidelines |
| Rate Limiting Strategies | https://express-rate-limit.github.io/express-rate-limit/ | Express rate limiter docs |

### Development Tools Used
| Tool | Purpose |
|------|---------|
| VS Code | Code editor with TypeScript support |
| Git | Version control |
| Node.js (v20+) | Runtime for backend and build tools |
| npm | Package management |
| Prisma CLI | Database migrations and client generation |
| Postman / curl | API testing during development |
| pg_isready | PostgreSQL connectivity check |
| psql (PostgreSQL CLI) | Direct database management |

### Common Development Commands

```bash
# Frontend (Next.js)
npm run dev          # Start dev server on port 3000
npm run build        # Build for production → .next/
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend (Express)
cd blackphics-backend
npm run dev          # Start dev server with tsx watch (port 4000)
npm run build        # TypeScript compile → dist/
npm start            # Start production server from dist/

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev --name <name>    # Create and run migration
npx prisma migrate deploy                 # Deploy migration (production)
npx prisma migrate reset                  # Reset DB and re-run all migrations
npx prisma studio                         # Visual DB browser
npm run prisma:seed                       # Seed database with sample data
npx prisma db pull                        # Introspect existing DB into schema.prisma
```

---

## Summary of All Challenges Encountered and Resolved

| Challenge | Root Cause | Solution | File(s) Changed |
|-----------|-----------|----------|-----------------|
| PostgreSQL not connecting | Missing migrations + no schema privileges | Ran prisma migrate, granted schema access | — |
| Prisma client stale | Query engine not downloaded | `npx prisma generate` | — |
| Frontend not loading | Stale Vite processes on port 5173 | Killed all node processes on ports 4000/5173 | — |
| "Unable to reach backend" | Hardcoded `127.0.0.1:4000` doesn't work from phones | Vite proxy + relative API paths | vite.config.ts, Signup.tsx, Login.tsx |
| CORS errors | Backend CORS too restrictive for local network origins | Added `192.168.8.147` origins + dev wildcard | server.ts |
| tsconfig Next.js artifacts | Leftover from previous Next.js setup | Removed Next.js plugin, includes, excludes | tsconfig.json |
| Unused Home import | Dead code in entry point | Removed unused import | main.tsx |
| API URL hardcoded to localhost | Only works on same machine | Vite proxy makes all `/api/*` requests local | vite.config.ts |
| DB user lacks permissions | `public` schema not writable by app user | `GRANT ALL ON SCHEMA public TO blackphics` | — |
| Signup error swallowed silently | `prisma.ts` catch block only logged | Now fails loudly with `process.exit(1)` in dev | prisma.ts |
| No startup DB check | Server starts even if DB is down | Added `prisma.$connect()` + error at startup | prisma.ts |
| Server doesn't import Prisma | DB errors only surface on first API request | Added `import { prisma }` in server.ts | server.ts |
| tsconfig excludes core files | Type checking skipped for main files | Removed `src/main.tsx` and `src/app/AppRouter.tsx` from exclude | tsconfig.json |

---

*Last updated: July 2026 — Blackphics E-Commerce Build Documentation*
