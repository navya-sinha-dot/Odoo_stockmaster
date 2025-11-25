import React, { useEffect, useState } from "react";
import TopNavDashboard from "../components/TopNavDashboard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStock: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    lowStockItems: 0,
  });

  const [latestTransfers, setLatestTransfers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [productsRes, receiptsRes, deliveriesRes, ledgerRes] =
      await Promise.all([
        api.get("/products"),
        api.get("/receipts"),
        api.get("/deliveries"),
        api.get("/ledger"),
      ]);

    const products = productsRes.data || [];
    const receipts = receiptsRes.data || [];
    const deliveries = deliveriesRes.data || [];
    const ledger = ledgerRes.data.items || [];

    // Total Stock
    const totalStock = products.reduce((sum, p) => {
      const total = Object.values(p.stockByLocation || {}).reduce(
        (a, b) => a + b,
        0
      );
      return sum + total;
    }, 0);

    // Pending Receipts
    const pendingReceipts = receipts.filter(
      (r) => r.status === "Draft" || r.status === "Ready"
    ).length;

    // Pending Deliveries
    const pendingDeliveries = deliveries.filter(
      (d) => d.status === "Draft" || d.status === "Ready"
    ).length;

    // Low Stock (threshold: 10)
    const lowStockItems = products.filter((p) => {
      const total = Object.values(p.stockByLocation || {}).reduce(
        (a, b) => a + b,
        0
      );
      return total < 10;
    }).length;

    const transfers = ledger
      .filter((l) => l.type === "Transfer")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setStats({
      totalStock,
      pendingReceipts,
      pendingDeliveries,
      lowStockItems,
    });

    setLatestTransfers(transfers);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNavDashboard />

      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 md:mb-12 px-4"
        style={{ color: "#473472" }}
      >
        Dashboard
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-10">
        {/* TOTAL PRODUCTS IN STOCK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200"
        >
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#473472" }}>
            Total Products in Stock
          </h2>
          <p className="text-3xl sm:text-4xl mt-4 font-bold" style={{ color: "#473472" }}>
            {stats.totalStock}
          </p>
        </motion.div>

        {/* PENDING RECEIPTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200"
        >
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#473472" }}>
            Pending Receipts
          </h2>
          <Link
            to="/receipts"
            className="text-2xl sm:text-3xl mt-4 font-bold block"
            style={{ color: "#473472" }}
          >
            {stats.pendingReceipts}
          </Link>
        </motion.div>

        {/* PENDING DELIVERIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200"
        >
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#473472" }}>
            Pending Deliveries
          </h2>
          <Link
            to="/delivery"
            className="text-2xl sm:text-3xl mt-4 font-bold block"
            style={{ color: "#473472" }}
          >
            {stats.pendingDeliveries}
          </Link>
        </motion.div>

        {/* LOW STOCK ITEMS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200 col-span-1 sm:col-span-2 lg:col-span-1"
        >
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#473472" }}>
            Low Stock Items
          </h2>
          <p
            className="text-2xl sm:text-3xl mt-4 font-bold"
            style={{ color: stats.lowStockItems > 0 ? "red" : "#473472" }}
          >
            {stats.lowStockItems}
          </p>
        </motion.div>

        {/* LATEST INTERNAL TRANSFERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200 col-span-1 sm:col-span-2 lg:col-span-2"
        >
          <h2
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: "#473472" }}
          >
            Latest Internal Transfers
          </h2>

          {latestTransfers.length === 0 ? (
            <p className="text-gray-500">No transfers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[400px]">
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #473472",
                      color: "#473472",
                    }}
                  >
                    <th className="text-left pb-2 pr-2">Product</th>
                    <th className="text-left pb-2 pr-2">Qty</th>
                    <th className="text-left pb-2 pr-2">Location</th>
                    <th className="text-left pb-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {latestTransfers.map((t, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 pr-2">{t.product?.name || "—"}</td>
                      <td
                        className="py-2 pr-2"
                        style={{ color: t.change > 0 ? "green" : "red" }}
                      >
                        {t.change}
                      </td>
                      <td className="py-2 pr-2">{t.location?.name || "—"}</td>
                      <td className="py-2">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
