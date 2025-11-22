import express from "express";
import {
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/otpcontroller.js";

const router = express.Router();

router.post("/send", sendOTP);
router.post("/verify", verifyOTP);
router.post("/reset", resetPassword);

export default router;
