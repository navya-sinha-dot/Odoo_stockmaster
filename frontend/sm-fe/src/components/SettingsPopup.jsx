import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SettingsPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-md bg-transparent"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-50 w-[90%] max-w-[350px] mx-4"
        style={{ border: "2px solid #473472" }}
      >
        <h2
          className="text-xl font-bold text-center mb-6"
          style={{ color: "#473472" }}
        >
          Settings
        </h2>

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
