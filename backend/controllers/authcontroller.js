import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { loginId, email, password } = req.body;
    if (!loginId || loginId.length < 6 || loginId.length > 12) {
      return res.status(400).json({ msg: "Login ID must be 6–12 characters" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const loginIdExists = await User.findOne({ loginId });
    if (loginIdExists) {
      return res.status(400).json({ msg: "Login ID already exists" });
    }

    // Password strength
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        msg: "Password must contain lowercase, uppercase, number, special char and be 8+ characters",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      loginId,
      email,
      password: hashed,
    });

    res.json({ msg: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(404).json({ msg: "Invalid Login ID or Password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid Login ID or Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
