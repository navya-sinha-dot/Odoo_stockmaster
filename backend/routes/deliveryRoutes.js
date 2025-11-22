import express from "express";
import {
  createDelivery,
  getDeliveries,
  getDelivery,
  validateDelivery,
  cancelDelivery,
} from "../controllers/deliverycontroller.js";

const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.get("/:id", getDelivery);
router.post("/:id/validate", validateDelivery);
router.post("/:id/cancel", cancelDelivery);

export default router;
