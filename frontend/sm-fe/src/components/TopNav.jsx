import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TopNav() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex justify-between items-center px-10 py-4 shadow-sm bg-white"
      style={{ position: "relative", zIndex: 50 }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold" style={{ color: "#473472" }}>
          StockMaster
        </h1>
      </div>

      <div className="flex items-center gap-8 text-lg">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <Link to="/features" className="hover:text-primary">
          Features
        </Link>
        <Link to="/about" className="hover:text-primary">
          About
        </Link>
      </div>

      <div className="flex gap-4">
        <Link
          to="/auth/login"
          className="px-4 py-2 rounded-md text-primary font-medium hover:bg-primary hover:text-[#473472] transition"
          style={{ border: "2px solid #473472" }}
        >
          Sign In
        </Link>

        <Link
          to="/auth/signup"
          className="px-4 py-2 rounded-md font-medium text-white transition"
          style={{ background: "#473472" }}
        >
          Sign Up
        </Link>
      </div>
    </motion.nav>
  );
}
