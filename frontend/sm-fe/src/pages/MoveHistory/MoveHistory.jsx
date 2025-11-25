import React, { useEffect, useState } from "react";
import TopNavDashboard from "../../components/TopNavDashboard";
import api from "../../api";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";

export default function MoveHistory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const extractRef = (note) => {
    const match = note?.match(/\((.*?)\)/);
    return match ? match[1] : "—";
  };

  const load = async () => {
    try {
      const res = await api.get("/ledger");

      const lines = res.data.items || [];

      const rows = lines.map((line) => {
        let status = "";
        let from = "—";
        let to = "—";

        if (line.type === "Receipt") {
          status = "IN";
          to = line.location?.name || "—";
        } else if (line.type === "Delivery") {
          status = "OUT";
          from = line.location?.name || "—";
        } else if (line.type === "Transfer") {
          if (line.change > 0) {
            status = "IN";
            to = line.location?.name || "—";
          } else {
            status = "OUT";
            from = line.location?.name || "—";
          }
        }

        return {
          reference: extractRef(line.note),
          date: line.createdAt,
          product: line.product?.name || "",
          from,
          to,
          quantity: line.change,
          status,
        };
      });

      setItems(rows);
    } catch (err) {
      console.error("Failed to load move history", err);
    }
  };

  const filtered = items.filter((r) =>
    [r.reference, r.product, r.from, r.to, r.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <TopNavDashboard />

      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-6 sm:mt-8 md:mt-10 px-4"
        style={{ color: "#473472" }}
      >
        Move History
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-6 sm:mt-8 md:mt-10 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border shadow-md"
        style={{ width: "95%", maxWidth: "100%", borderColor: "#473472" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <button
            className="px-4 sm:px-6 py-2 rounded-lg border font-semibold text-sm sm:text-base whitespace-nowrap"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW
          </button>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 border rounded-md text-xs sm:text-sm outline-none flex-1 sm:flex-none min-w-0"
                style={{ borderColor: "#53629E" }}
              />
              <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: "#473472" }} />
            </div>

            <MdViewList className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#473472" }} />
            <MdViewKanban className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#473472" }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
          <thead>
            <tr
              style={{
                color: "#473472",
                borderBottom: "2px solid #473472",
              }}
            >
              <th className="text-left pb-2">Reference</th>
              <th className="text-left pb-2">Date</th>
              <th className="text-left pb-2">Product</th>
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

                  <td
                    className="p-3 font-semibold"
                    style={{ color: row.quantity > 0 ? "green" : "red" }}
                  >
                    {row.quantity}
                  </td>

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

        <div
          className="mt-10 text-gray-700"
          style={{ fontFamily: "handwriting, sans-serif" }}
        >
          <p className="mb-2">
            Populate all moves done between the From → To location in inventory.
          </p>
          <p className="mb-2">
            If a single reference has multiple products, display multiple rows.
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
