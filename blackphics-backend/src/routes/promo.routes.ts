import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";
import { sendPromoEmail } from "../controllers/promo.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many promo emails, try again later" },
});

router.use(requireAdmin, adminLimiter);
router.post("/", asyncHandler(sendPromoEmail));
export default router;
