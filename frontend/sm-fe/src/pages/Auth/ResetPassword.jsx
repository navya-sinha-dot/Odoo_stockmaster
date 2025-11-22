import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState(null);

  const verifyOTP = async () => {
    try {
      await api.post("/otp/verify", { email, otp });
      setVerified(true);
      setMsg("OTP verified! You can now reset your password.");
    } catch (err) {
      setMsg("Invalid OTP. Try again.");
    }
  };

  const resetPass = async () => {
    try {
      await api.post("/otp/reset", { email, newPassword });
      setMsg("Password reset successfully!");
    } catch (err) {
      setMsg("Reset failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f2f8ff" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow p-8 border border-gray-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="h-16 w-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
            style={{ background: "#473472" }}
          >
            SM
          </div>
        </div>

        <h2
          className="text-center text-2xl font-bold mb-1"
          style={{ color: "#473472" }}
        >
          Reset Password
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter OTP and create a new password
        </p>

        {msg && (
          <div className="text-center text-sm mb-4 text-blue-600">{msg}</div>
        )}

        {/* Email */}
        <div className="space-y-1 mb-3">
          <label className="text-sm font-medium" style={{ color: "#53629E" }}>
            Email ID
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded-md outline-none focus:ring-2"
            style={{
              borderColor: "#53629E",
              "--tw-ring-color": "#87BAC3",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
          />
        </div>

        {/* OTP */}
        <div className="space-y-1 mb-3">
          <label className="text-sm font-medium" style={{ color: "#53629E" }}>
            OTP
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button
              onClick={verifyOTP}
              className="px-4 rounded-md text-white font-semibold"
              style={{ background: "#473472" }}
            >
              Verify
            </button>
          </div>
        </div>

        {/* NEW PASSWORD – appears only after OTP verified */}
        {verified && (
          <div>
            <div className="space-y-1 mb-4">
              <label
                className="text-sm font-medium"
                style={{ color: "#53629E" }}
              >
                New Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded-md outline-none focus:ring-2"
                style={{
                  borderColor: "#53629E",
                  "--tw-ring-color": "#87BAC3",
                }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <button
              onClick={resetPass}
              className="w-full text-white py-2 rounded-md font-semibold"
              style={{ background: "#473472" }}
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Links */}
        <div className="text-center text-sm mt-4">
          <Link to="/auth/login" style={{ color: "#53629E" }}>
            Back to Login
          </Link>
          <span className="mx-1">|</span>
          <Link to="/auth/signup" style={{ color: "#53629E" }}>
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
