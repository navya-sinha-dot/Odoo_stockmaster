import express from "express";
import {
  createLocation,
  getLocations,
  deleteLocation,
} from "../controllers/Locationcontroller.js";

const router = express.Router();

router.post("/", createLocation);
router.get("/", getLocations);
router.delete("/:id", deleteLocation);

export default router;
