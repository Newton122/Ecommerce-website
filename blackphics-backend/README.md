# Blackphics Backend — Setup

## Stack
Express + TypeScript + PostgreSQL + Prisma + JWT auth

## 1. Install dependencies
```bash
npm install
```

## 2. Set up your database
- Create a Postgres database (Neon, Supabase, or local).
- Copy `.env.example` to `.env` and fill in:
  - `DATABASE_URL` — your Postgres connection string
  - `JWT_SECRET` — any long random string (e.g. `openssl rand -base64 32`)
  - `CORS_ORIGIN` — your frontend URL (`http://localhost:3000` for local Next.js dev)

## 3. Generate the Prisma client and run migrations
**Important:** this step needs internet access to download Prisma's query engine binary —
it could NOT be run inside the sandbox this project was built in, so this is the first
thing to run on your machine to confirm everything works:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

The `migrate dev` command will create all tables (User, Product, CartItem, Order, OrderItem)
in your database based on `prisma/schema.prisma`.

## 4. Seed the database with your existing products
```bash
npm run prisma:seed
```
This loads the same 6 products currently hardcoded in your frontend's `data/products.ts`.

## 5. Run the dev server
```bash
npm run dev
```
Server starts on `http://localhost:4000`. Test it:
```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/products
```

## API overview

| Method | Route              | Auth? | Description               |
|--------|--------------------|-------|---------------------------|
| POST   | /api/auth/signup   | No    | Create account            |
| POST   | /api/auth/login    | No    | Log in, get JWT           |
| GET    | /api/products      | No    | List products (optional `?category=`) |
| GET    | /api/products/:id  | No    | Get one product            |
| GET    | /api/cart          | Yes   | Get current user's cart    |
| POST   | /api/cart          | Yes   | Add item to cart           |
| PATCH  | /api/cart/:id      | Yes   | Update item quantity       |
| DELETE | /api/cart/:id      | Yes   | Remove item from cart      |
| POST   | /api/orders        | Yes   | Checkout (cart → order)    |
| GET    | /api/orders        | Yes   | List current user's orders |
| GET    | /api/orders/:id    | Yes   | Get one order              |

Authenticated routes need a header: `Authorization: Bearer <token>` (token comes back from signup/login).

## Things to double check once it's running
- Confirm `prisma migrate dev` created all 5 tables correctly (`npx prisma studio` to browse visually)
- Test the full signup → login → add to cart → checkout flow with curl or Postman before wiring up the frontend
- Once confirmed working, the Next.js frontend's `data/products.ts` calls get replaced with `fetch` calls to this API
