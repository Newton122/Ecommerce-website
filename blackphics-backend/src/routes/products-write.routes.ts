import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";
import { createProduct, updateProduct, deleteProduct } from "../controllers/products-write.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many admin requests, try again later" },
});

router.use(requireAdmin, adminLimiter);
router.post("/", asyncHandler(createProduct));
router.put("/:id", asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(deleteProduct));

export default router;
