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
        className="mx-auto mt-6 p-8 rounded-3xl bg-white border shadow-md"
        style={{
          width: "92%",
          borderColor: "#473472",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#473472" }}>
            Stock
          </h1>

          <Link
            to="/products/new"
            className="px-5 py-2 rounded-lg border font-semibold"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW PRODUCT
          </Link>
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm outline-none"
              style={{ borderColor: "#53629E" }}
            />
            <FiSearch size={20} style={{ color: "#473472" }} />
          </div>
        </div>

        <table className="w-full text-sm">
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
          className="text-center mt-16 text-gray-600"
          style={{ fontSize: "1rem" }}
        >
          User must be able to update the stock from here.
        </div>
      </motion.div>
    </div>
  );
}
