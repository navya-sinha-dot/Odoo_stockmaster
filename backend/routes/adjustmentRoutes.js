import express from "express";
import {
  createAdjustment,
  getAdjustments,
  validateAdjustment,
  cancelAdjustment,
} from "../controllers/adjustmentcontroller.js";

const router = express.Router();

router.post("/", createAdjustment);
router.get("/", getAdjustments);
router.post("/:id/validate", validateAdjustment);
router.post("/:id/cancel", cancelAdjustment);

export default router;
