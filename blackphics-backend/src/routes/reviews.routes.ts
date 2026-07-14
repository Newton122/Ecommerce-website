import { Router } from "express";
import rateLimit from "express-rate-limit";
import { listReviews, createReview } from "../controllers/reviews.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many review submissions, try again later" },
});

router.get("/", asyncHandler(listReviews));
router.post("/", requireAuth, reviewLimiter, asyncHandler(createReview));

export default router;
