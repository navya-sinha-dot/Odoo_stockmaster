import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productcontroller.js";

const router = express.Router();

router.post("/", createProduct); // Create
router.get("/", getProducts); // Read all
router.get("/:id", getProduct); // Read one
router.put("/:id", updateProduct); // Update
router.delete("/:id", deleteProduct); // Delete

export default router;
