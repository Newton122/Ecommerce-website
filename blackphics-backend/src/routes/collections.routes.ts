import { Router } from "express";
import { listCollections, getCollection } from "../controllers/collections.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listCollections));
router.get("/:id", asyncHandler(getCollection));

export default router;
