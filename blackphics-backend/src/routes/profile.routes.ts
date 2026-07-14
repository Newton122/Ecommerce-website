import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { updateOwnProfile } from "../controllers/profile.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many profile updates, try again later" },
});

router.patch("/", requireAuth, profileLimiter, asyncHandler(updateOwnProfile));

export default router;
