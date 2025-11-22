import React from "react";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNav />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-16 py-20">
        {/* LEFT SIDE TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
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
              href="/auth/signup"
              className="px-6 py-3 rounded-lg text-white text-lg font-semibold"
              style={{ background: "#473472" }}
            >
              Get Started
            </a>

            <a
              href="/auth/login"
              className="px-6 py-3 rounded-lg text-lg font-semibold border"
              style={{ borderColor: "#473472", color: "#473472" }}
            >
              Sign In
            </a>
          </div>
        </motion.div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center items-center"
        >
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/delivery-warehouse-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--logistic-storage-location-pack-stock-supply-chain-illustrations-3468491.png"
            alt="Warehouse Illustration"
            className="w-3/4 drop-shadow-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
