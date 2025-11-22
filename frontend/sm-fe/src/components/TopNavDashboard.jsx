import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import OperationsPopup from "./Opeartionspopup";
import SettingsPopup from "./SettingsPopup";
import AuthContext from "../context/AuthContext";
import logo from "../assets/logo2.jpg"; // LOGO

export default function TopNavDashboard() {
  const [openOps, setOpenOps] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* TOP NAVBAR */}
      <div
        className="w-full bg-white shadow-sm py-4 px-10 flex items-center justify-between"
        style={{ borderBottom: "2px solid #473472" }}
      >
        {/* LEFT NAV LINKS */}
        <div className="flex items-center gap-8 text-lg font-semibold">
          {/* LOGO — FIXED HEIGHT */}
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-auto cursor-pointer" // <-- FIXED HEIGHT
              style={{ objectFit: "contain" }}
            />
          </Link>

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

        {/* RIGHT SIDE USER + LOGOUT */}
        <div className="flex items-center gap-5">
          {user && (
            <span className="font-medium" style={{ color: "#473472" }}>
              Welcome, <b>{user.loginId}!</b>
            </span>
          )}

          {user && (
            <button
              onClick={logout}
              className="font-semibold cursor-pointer"
              style={{ color: "#473472" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <OperationsPopup open={openOps} onClose={() => setOpenOps(false)} />
      <SettingsPopup
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}
