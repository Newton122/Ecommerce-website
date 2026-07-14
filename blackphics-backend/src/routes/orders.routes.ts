import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { createOrder, listOrders, getOrder, cancelOrder, confirmDelivery } from "../controllers/orders.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests, try again later" },
});

router.use(requireAuth);
router.get("/", asyncHandler(listOrders));
router.get("/:id", asyncHandler(getOrder));
router.post("/", writeLimiter, asyncHandler(createOrder));
router.patch("/:id/cancel", writeLimiter, asyncHandler(cancelOrder));
router.patch("/:id/confirm-delivery", writeLimiter, asyncHandler(confirmDelivery));

export default router;
