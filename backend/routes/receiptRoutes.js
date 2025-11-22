import express from "express";
import {
  createReceipt,
  getReceipts,
  getReceipt,
  validateReceipt,
  cancelReceipt,
} from "../controllers/receiptcontroller.js";

const router = express.Router();

router.post("/", createReceipt);
router.get("/", getReceipts);
router.get("/:id", getReceipt);
router.post("/:id/validate", validateReceipt);
router.post("/:id/cancel", cancelReceipt);

export default router;
