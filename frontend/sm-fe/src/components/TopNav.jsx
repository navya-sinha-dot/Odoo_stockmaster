import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 shadow-sm bg-white"
      style={{ position: "relative", zIndex: 50 }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "#473472" }}>
          StockMaster
        </h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-lg">
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

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-3 lg:gap-4">
        <Link
          to="/auth/login"
          className="px-3 lg:px-4 py-2 rounded-md text-primary font-medium hover:bg-primary hover:text-[#473472] transition text-sm lg:text-base"
          style={{ border: "2px solid #473472" }}
        >
          Sign In
        </Link>

        <Link
          to="/auth/signup"
          className="px-3 lg:px-4 py-2 rounded-md font-medium text-white transition text-sm lg:text-base"
          style={{ background: "#473472" }}
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2"
        style={{ color: "#473472" }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="flex flex-col px-4 py-4 gap-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-2"
            >
              Home
            </Link>
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-2"
            >
              Features
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary py-2"
            >
              About
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link
                to="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md text-primary font-medium text-center"
                style={{ border: "2px solid #473472" }}
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md font-medium text-white text-center"
                style={{ background: "#473472" }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
