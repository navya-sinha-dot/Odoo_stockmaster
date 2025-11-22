import express from "express";
import {
  createReceipt,
  getReceipts,
  getReceipt,
  validateReceipt,
  cancelReceipt,
} from "../controllers/receiptcontroller.js";

const router = express.Router();

router.post("/", createReceipt); // create draft receipt
router.get("/", getReceipts); // list receipts
router.get("/:id", getReceipt); // get single receipt
router.post("/:id/validate", validateReceipt); // validate receipt -> update stock
router.post("/:id/cancel", cancelReceipt); // cancel

export default router;
