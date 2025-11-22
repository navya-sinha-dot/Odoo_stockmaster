import React from "react";
import TopNavDashboard from "./TopNavDashboard";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNavDashboard />

      <div className="pt-6 px-6">{children}</div>
    </div>
  );
}
