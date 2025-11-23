import React from "react";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";
import illustration from "../assets/illus2.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNav />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-16 py-20">
        {/* LEFT SIDE TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <h1
            className="text-5xl font-extrabold mb-4"
            style={{ color: "#473472" }}
          >
            A Smarter Way <br /> to Manage Stock
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Track inventory, manage warehouses, perform operations, and monitor
            stock — all in one clean, fast and powerful dashboard.
          </p>

          <div className="flex gap-4">
            <a
              href="https://github.com/navya-sinha-dot/Odoo_stockmaster"
              className="px-6 py-3 rounded-lg text-white text-lg font-semibold"
              style={{ background: "#473472" }}
            >
              GitHub
            </a>
          </div>
        </motion.div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center items-center"
        >
          <img
            src={illustration}
            alt="Warehouse Illustration"
            className="drop-shadow-lg rounded-lg"
          />
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="px-10 py-16 bg-white">
        <h2
          className="text-3xl font-bold text-center mb-10"
          style={{ color: "#473472" }}
        >
          Why Choose StockMaster?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-[#f2f8ff] p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#473472" }}>
              Real-Time Tracking
            </h3>
            <p className="text-gray-700">
              Monitor stock levels, item movements and warehouse performance in
              real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#f2f8ff] p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#473472" }}>
              Smart Operations
            </h3>
            <p className="text-gray-700">
              Perform receipts, deliveries, transfers, and adjustments with ease
              using an intuitive interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="bg-[#f2f8ff] p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#473472" }}>
              Clean Dashboard
            </h3>
            <p className="text-gray-700">
              Access insights, analytics, and stock summaries in a modern,
              beautiful dashboard.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="py-6 text-center text-sm"
        style={{ background: "#473472", color: "white" }}
      >
        © {new Date().getFullYear()} StockMaster — All Rights Reserved.
      </footer>
    </div>
  );
}
