import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";
import logo from "../../assets/logo2.jpg";

export default function Signup() {
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password !== rePassword) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", { loginId, email, password });

      navigate("/auth/login");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f2f8ff" }}
    >
      <div className="w-full max-w-md mb-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-md font-medium"
          style={{ color: "#53629E" }}
        >
          <span className="text-md">←</span> Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow p-8 border border-gray-200"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-25 w-auto cursor-pointer"
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>

        <h2
          className="text-center text-2xl font-bold mb-1"
          style={{ color: "#473472" }}
        >
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign up to access StockMaster
        </p>

        <form onSubmit={submit} className="space-y-4">
          {msg && <div className="text-red-500 text-sm text-center">{msg}</div>}

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Login ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              placeholder="Enter login ID"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              placeholder="Enter email"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              placeholder="Enter password"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Re-enter Password
            </label>
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              placeholder="Re-enter password"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md font-semibold mt-2 flex items-center justify-center
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            style={{ background: "#473472" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" style={{ color: "#53629E" }}>
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
