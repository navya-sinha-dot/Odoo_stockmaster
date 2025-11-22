import express from "express";
import {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../controllers/warehousecontroller.js";

const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getWarehouses);
router.get("/:id", getWarehouse);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

export default router;
