import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signup, login } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Too many attempts, try again later" },
  })
);

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

export default router;
