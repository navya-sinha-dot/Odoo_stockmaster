import React, { useEffect, useState } from "react";
import TopNavDashboard from "../../components/TopNavDashboard";
import api from "../../api";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const res = await api.get("/products");
      setItems(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const totalStock = (p) =>
    Object.values(p.stockByLocation || {}).reduce((sum, qty) => sum + qty, 0);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNavDashboard />

      <div className="text-center mt-4 text-sm" style={{ color: "#53629E" }}>
        This page contains the warehouse details & location.
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-4 sm:mt-6 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border shadow-md"
        style={{
          width: "95%",
          maxWidth: "100%",
          borderColor: "#473472",
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "#473472" }}>
            Stock
          </h1>

          <Link
            to="/products/new"
            className="px-4 sm:px-5 py-2 rounded-lg border font-semibold text-sm sm:text-base whitespace-nowrap"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW PRODUCT
          </Link>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 border rounded-md text-xs sm:text-sm outline-none flex-1 sm:flex-none"
              style={{ borderColor: "#53629E" }}
            />
            <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#473472" }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
          <thead>
            <tr style={{ color: "#473472", borderBottom: "2px solid #473472" }}>
              <th className="text-left pb-2">Product</th>
              <th className="text-left pb-2">Per unit cost</th>
              <th className="text-left pb-2">On hand</th>
              <th className="text-left pb-2">Free to Use</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <React.Fragment key={p._id}>
                <tr className="border-t">
                  <td className="py-3">{p.name}</td>

                  <td>₹ {p.cost || 0}</td>

                  <td>{totalStock(p)}</td>

                  <td>{totalStock(p)}</td>
                </tr>

                <tr>
                  <td colSpan="4">
                    <div
                      className="border-b w-full"
                      style={{
                        borderStyle: "dotted",
                        borderColor: "#cccccc",
                        marginTop: "4px",
                      }}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Footer Note */}
        <div
          className="text-center mt-8 sm:mt-16 text-gray-600 text-sm sm:text-base"
        >
          User must be able to update the stock from here.
        </div>
      </motion.div>
    </div>
  );
}
