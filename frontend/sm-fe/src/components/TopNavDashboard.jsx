import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import OperationsPopup from "./Opeartionspopup";
import SettingsPopup from "./SettingsPopup";
import AuthContext from "../context/AuthContext";
import logo from "../assets/logo2.jpg";

export default function TopNavDashboard() {
  const [openOps, setOpenOps] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div
        className="w-full bg-white shadow-sm py-3 sm:py-4 px-4 sm:px-6 md:px-10 flex items-center justify-between relative"
        style={{ borderBottom: "2px solid #473472" }}
      >
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-10 sm:h-12 md:h-14 w-auto cursor-pointer"
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 text-base lg:text-lg font-semibold">
            <Link to="/dashboard" style={{ color: "#473472" }}>
              Dashboard
            </Link>

            <button onClick={() => setOpenOps(true)} style={{ color: "#473472" }}>
              Operations
            </button>

            <Link to="/stock" style={{ color: "#473472" }}>
              Stock
            </Link>

            <Link to="/move-history" style={{ color: "#473472" }}>
              Move History
            </Link>

            <button
              onClick={() => setOpenSettings(true)}
              style={{ color: "#473472" }}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Desktop User Info */}
        <div className="hidden lg:flex items-center gap-4 lg:gap-5">
          {user && (
            <span className="font-medium text-sm lg:text-base" style={{ color: "#473472" }}>
              Welcome, <b>{user.loginId}!</b>
            </span>
          )}

          {user && (
            <button
              onClick={logout}
              className="font-semibold cursor-pointer text-sm lg:text-base"
              style={{ color: "#473472" }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2"
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-b" style={{ borderColor: "#473472" }}>
          <div className="flex flex-col px-4 py-4 gap-3">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 font-semibold"
              style={{ color: "#473472" }}
            >
              Dashboard
            </Link>

            <button
              onClick={() => {
                setOpenOps(true);
                setMobileMenuOpen(false);
              }}
              className="py-2 text-left font-semibold"
              style={{ color: "#473472" }}
            >
              Operations
            </button>

            <Link
              to="/stock"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 font-semibold"
              style={{ color: "#473472" }}
            >
              Stock
            </Link>

            <Link
              to="/move-history"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 font-semibold"
              style={{ color: "#473472" }}
            >
              Move History
            </Link>

            <button
              onClick={() => {
                setOpenSettings(true);
                setMobileMenuOpen(false);
              }}
              className="py-2 text-left font-semibold"
              style={{ color: "#473472" }}
            >
              Settings
            </button>

            {user && (
              <>
                <div className="pt-2 mt-2 border-t">
                  <span className="font-medium text-sm" style={{ color: "#473472" }}>
                    Welcome, <b>{user.loginId}!</b>
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left font-semibold text-sm"
                  style={{ color: "#473472" }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <OperationsPopup open={openOps} onClose={() => setOpenOps(false)} />
      <SettingsPopup
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}
