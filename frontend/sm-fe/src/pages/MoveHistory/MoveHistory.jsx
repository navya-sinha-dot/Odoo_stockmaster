import React, { useEffect, useState } from "react";
import TopNavDashboard from "../../components/TopNavDashboard";
import api from "../../api";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";

export default function MoveHistory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ledger/grouped");

      const raw = res.data.items || [];

      // Flatten grouped ledger into table rows
      const flattened = raw.flatMap((entry) =>
        entry.lines.map((line) => ({
          reference: entry.reference,
          date: entry.date,
          type: entry.type,
          product: line.product?.name || "",
          contact: entry.contact || line.product?.name || "",
          from: line.from || line.location?.name || "—",
          to: line.to || "—",
          quantity: line.change,
          status: entry.type === "Receipt" ? "IN" : "OUT",
        }))
      );

      setItems(flattened);
    } catch (err) {
      console.error("Failed to load move history", err);
    }
    setLoading(false);
  };

  // Filter by search keyword
  const filtered = items.filter((r) =>
    [r.reference, r.product, r.from, r.to, r.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNavDashboard />

      {/* TITLE */}
      <h1
        className="text-4xl font-bold text-center mt-10"
        style={{ color: "#473472" }}
      >
        Move History
      </h1>

      {/* Rounded Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-10 p-8 rounded-3xl bg-white border shadow-md relative"
        style={{ width: "92%", borderColor: "#473472" }}
      >
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          {/* NEW Button */}
          <button
            className="px-6 py-2 rounded-lg border font-semibold"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW
          </button>

          {/* Search + View Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 border rounded-md text-sm outline-none"
                style={{ borderColor: "#53629E" }}
              />
              <FiSearch size={20} style={{ color: "#473472" }} />
            </div>

            {/* Icons */}
            <MdViewList size={26} style={{ color: "#473472" }} />
            <MdViewKanban size={26} style={{ color: "#473472" }} />
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                color: "#473472",
                borderBottom: "2px solid #473472",
              }}
            >
              <th className="text-left pb-2">Reference</th>
              <th className="text-left pb-2">Date</th>
              <th className="text-left pb-2">Contact</th>
              <th className="text-left pb-2">From</th>
              <th className="text-left pb-2">To</th>
              <th className="text-left pb-2">Quantity</th>
              <th className="text-left pb-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No moves found
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">{row.reference}</td>
                  <td className="p-3">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{row.product}</td>
                  <td className="p-3">{row.from}</td>
                  <td className="p-3">{row.to}</td>

                  {/* Quantity with color */}
                  <td
                    className="p-3 font-semibold"
                    style={{ color: row.quantity > 0 ? "green" : "red" }}
                  >
                    {row.quantity}
                  </td>

                  {/* Status color */}
                  <td
                    className="p-3 font-semibold"
                    style={{
                      color:
                        row.status === "IN"
                          ? "green"
                          : row.status === "OUT"
                          ? "red"
                          : "#473472",
                    }}
                  >
                    {row.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* NOTES BELOW TABLE */}
        <div
          className="mt-10 text-gray-700"
          style={{ fontFamily: "handwriting, sans-serif" }}
        >
          <p className="mb-2">
            Populate all moves done between the From → To location in inventory.
          </p>
          <p className="mb-2">
            If a single reference has multiple products, display it in multiple
            rows.
          </p>
          <p className="mb-2 text-green-600">
            In events should be displayed in green
          </p>
          <p className="text-red-600">Out events should be displayed in red</p>
        </div>
      </motion.div>
    </div>
  );
}
