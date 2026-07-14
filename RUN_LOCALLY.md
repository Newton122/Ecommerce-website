# Running this project locally

## Requirements
- Node.js 18+ (20+ recommended)
- npm (comes with Node)

## Setup

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Production build

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with:

```bash
npm run dev -- --port 4173
# or, if you add a preview script:
# npx vite preview
```

## Notes
- This project was verified to build and serve correctly (all routes: /, /shop, /shop/:id, /custom, /services, /about, /contact, /cart, /checkout).
- `react` and `react-dom` were moved from optional peerDependencies into regular dependencies so `npm install` works reliably on any npm version.
- Styling: Tailwind CSS v4 + shadcn/ui components (Radix UI primitives underneath).
- Routing: react-router v7 (`src/app/routes.tsx`), shared layout in `src/app/Layout.tsx`.
- Cart state: React Context in `src/app/context/CartContext.tsx`.
- Product data: `src/app/data/products.ts` (static — swap in a real API/backend when ready).
