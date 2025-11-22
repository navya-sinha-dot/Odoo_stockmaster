import React from "react";
import TopNavDashboard from "../components/TopNavDashboard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ background: "#f2f8ff" }} className="min-h-screen">
      <TopNavDashboard />

      {/* PAGE TITLE */}
      <h1
        className="text-4xl font-bold text-center mt-10 mb-12"
        style={{ color: "#473472" }}
      >
        Dashboard
      </h1>

      {/* RECEIPT + DELIVERY CARDS */}
      <div className="flex flex-col lg:flex-row justify-center gap-10 px-10">
        {/* RECEIPT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 w-[350px]"
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#473472" }}
          >
            Receipt
          </h2>

          <Link
            to="/receipts"
            className="px-6 py-2 rounded-lg mb-4 border block text-center"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            4 to receive
          </Link>

          <p className="text-sm text-gray-700">
            <span className="font-medium">1 Late</span> <br />
            <span className="font-medium">6 operations</span>
          </p>
        </motion.div>

        {/* DELIVERY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 w-[350px]"
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#473472" }}
          >
            Delivery
          </h2>
          <Link
            to="/delivery"
            className="px-6 py-2 rounded-lg mb-4 border block text-center"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            4 to Deliver
          </Link>

          <p className="text-sm text-gray-700">
            <span className="font-medium">1 Late</span> <br />
            <span className="font-medium">2 waiting</span> <br />
            <span className="font-medium">6 operations</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
