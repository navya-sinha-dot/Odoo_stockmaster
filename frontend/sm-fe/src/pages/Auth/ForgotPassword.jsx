import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";
import logo from "../../assets/logo2.jpg";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      await api.post("/otp/send", { email });
      setMsg("OTP has been sent to your email!");
    } catch (err) {
      setMsg("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
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
        className="w-full max-w-md bg-white rounded-xl shadow p-6 sm:p-8 border border-gray-200"
      >
        <div className="flex justify-center mb-4 sm:mb-6">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-20 sm:h-25 w-auto cursor-pointer"
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>

        <h2
          className="text-center text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "#473472" }}
        >
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter your email to receive an OTP
        </p>

        <form onSubmit={submit} className="space-y-4">
          {msg && (
            <div
              className={`text-sm text-center ${
                msg.includes("sent") ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md font-semibold flex items-center justify-center
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            style={{ background: "#473472" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

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
