import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getCart, addItem, updateItem, removeItem } from "../controllers/cart.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(getCart));
router.post("/", asyncHandler(addItem));
router.patch("/:id", asyncHandler(updateItem));
router.delete("/:id", asyncHandler(removeItem));

export default router;
