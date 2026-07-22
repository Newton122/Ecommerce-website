import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import collectionsRoutes from "./routes/collections.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import productsWriteRoutes from "./routes/products-write.routes.js";
import ordersWriteRoutes from "./routes/orders-write.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import usersRoutes from "./routes/users.routes.js";
import promoRoutes from "./routes/promo.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import designRequestsRoutes from "./routes/designRequests.routes.js";
import { prisma } from "./lib/prisma.js";

const app = express();

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://192.168.8.147:3000",
  "http://192.168.8.147:3002",
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (process.env.NODE_ENV !== "production") {
    try {
      const url = new URL(origin);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1") {
        return true;
      }
      if (url.hostname === "192.168.8.147") {
        return true;
      }
    } catch {}
  }
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch {}
  return false;
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin/products", productsWriteRoutes);
app.use("/api/admin/orders", ordersWriteRoutes);
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/promo", promoRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/design-requests", designRequestsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users/me", profileRoutes);

// Fallback error handler — catches anything thrown/rejected in route handlers
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const isProd = process.env.NODE_ENV === "production";
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(message.includes("CORS") ? 403 : 500).json({ error: isProd ? "Internal server error" : message });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Blacphics API running on http://localhost:${port}`);
});
