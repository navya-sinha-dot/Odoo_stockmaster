import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SettingsPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background dim and blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-transparent"
        onClick={onClose}
      />

      {/* Popup Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-xl p-8 z-50 w-[350px]"
        style={{ border: "2px solid #473472" }}
      >
        <h2
          className="text-xl font-bold text-center mb-6"
          style={{ color: "#473472" }}
        >
          Settings
        </h2>

        {/* Menu Items */}
        <div className="flex flex-col gap-4">
          <Link
            to="/warehouses"
            className="py-3 text-center rounded-lg font-semibold"
            style={{
              border: "2px solid #473472",
              color: "#473472",
            }}
            onClick={onClose}
          >
            Warehouses
          </Link>

          <Link
            to="/locations"
            className="py-3 text-center rounded-lg font-semibold"
            style={{
              border: "2px solid #473472",
              color: "#473472",
            }}
            onClick={onClose}
          >
            Locations
          </Link>
        </div>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-lg font-bold"
          style={{ color: "#473472" }}
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}
