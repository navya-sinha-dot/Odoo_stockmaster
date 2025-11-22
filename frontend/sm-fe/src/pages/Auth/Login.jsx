import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";
import AuthContext from "../../context/AuthContext";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { loginId, password });

      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid login credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f2f8ff" }}
    >
      {/* Back to Home */}
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-md font-medium"
          style={{ color: "#53629E" }}
        >
          <span className="text-lg">←</span> Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow p-8 border border-gray-200"
      >
        {/* App Logo */}
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
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in to your StockMaster account
        </p>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Login ID */}
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Login ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
              placeholder="Enter login ID"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "#53629E" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md outline-none focus:ring-2"
              style={{
                borderColor: "#53629E",
                "--tw-ring-color": "#87BAC3",
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-md font-semibold mt-2"
            style={{ background: "#473472" }}
          >
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="text-center text-sm mt-4">
          <Link to="/auth/forgot" style={{ color: "#53629E" }}>
            Forgot Password?
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
