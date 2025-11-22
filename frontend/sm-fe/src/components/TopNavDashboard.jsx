import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import OperationsPopup from "./Opeartionspopup";
import SettingsPopup from "./SettingsPopup";
import AuthContext from "../context/AuthContext";

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
        <div className="flex items-center gap-10 text-lg font-semibold">
          <Link to="/dashboard" style={{ color: "#473472" }}>
            Dashboard
          </Link>

          {/* OPERATIONS */}
          <button onClick={() => setOpenOps(true)} style={{ color: "#473472" }}>
            Operations
          </button>

          <Link to="/stock" style={{ color: "#473472" }}>
            Stock
          </Link>

          <Link to="/move-history" style={{ color: "#473472" }}>
            Move History
          </Link>

          {/* SETTINGS */}
          <button
            onClick={() => setOpenSettings(true)}
            style={{ color: "#473472" }}
          >
            Settings
          </button>
        </div>

        {/* RIGHT SIDE → USER + LOGOUT */}
        <div className="flex items-center gap-5">
          {user && (
            <span className="font-medium" style={{ color: "#473472" }}>
              Welcome, <b>{user.loginId}!</b>
            </span>
          )}

          {user && (
            <button
              onClick={logout}
              className="font-semibold"
              style={{ color: "#473472" }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* POPUPS */}
      <OperationsPopup open={openOps} onClose={() => setOpenOps(false)} />
      <SettingsPopup
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}
