import express from "express";
import {
  createTransfer,
  getTransfers,
  validateTransfer,
} from "../controllers/transfercontroller.js";

const router = express.Router();

router.post("/", createTransfer);
router.get("/", getTransfers);
router.post("/:id/validate", validateTransfer);

export default router;
