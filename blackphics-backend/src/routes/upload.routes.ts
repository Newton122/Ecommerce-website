import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { upload, uploadImage } from "../controllers/upload.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAdmin);
router.post("/", upload.single("file"), asyncHandler(uploadImage));

export default router;
