import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/otp/send", { email });
      setMsg("OTP has been sent to your email!");
    } catch (err) {
      setMsg("Failed to send OTP. Try again.");
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
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter your email to receive an OTP
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {msg && <div className="text-sm text-green-600">{msg}</div>}

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 outline-none"
              placeholder="Enter your registered email"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full text-white py-2 rounded-md font-semibold"
            style={{ background: "#473472" }}
          >
            Send OTP
          </button>
        </form>

        {/* Links */}
        <div className="text-center text-sm mt-4">
          <Link to="/auth/login" style={{ color: "#53629E" }}>
            Back to Login
          </Link>
          <span className="mx-1">|</span>
          <Link to="/auth/reset" style={{ color: "#53629E" }}>
            Reset Password
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
