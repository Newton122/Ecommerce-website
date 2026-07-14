import { Router } from "express";
import { listProducts, getProduct } from "../controllers/products.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listProducts));
router.get("/:id", asyncHandler(getProduct));

export default router;
