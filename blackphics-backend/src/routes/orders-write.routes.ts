import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";
import { listAllOrders, updateOrderStatus } from "../controllers/orders.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many admin requests, try again later" },
});

router.use(requireAdmin, adminLimiter);
router.get("/", asyncHandler(listAllOrders));
router.patch("/:id/status", asyncHandler(updateOrderStatus));

export default router;
