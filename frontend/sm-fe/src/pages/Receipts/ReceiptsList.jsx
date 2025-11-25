import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";

export default function ReceiptsList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const res = await api.get("/receipts");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((r) =>
    ((r.reference || "") + " " + (r.supplier || "") + " " + (r.status || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const grouped = {
    Draft: filtered.filter((r) => r.status === "Draft"),
    Ready: filtered.filter((r) => r.status === "Ready"),
    Done: filtered.filter((r) => r.status === "Done"),
    Canceled: filtered.filter((r) => r.status === "Canceled"),
  };

  return (
    <div style={{ background: "#f2f8ff" }} className="min-h-screen pb-16">
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-6 sm:mt-8 md:mt-10 px-4"
        style={{ color: "#473472" }}
      >
        Receipts
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border shadow-md"
        style={{ width: "95%", maxWidth: "100%", borderColor: "#473472" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <Link
            to="/receipts/new"
            className="px-4 sm:px-6 py-2 rounded-lg border font-semibold text-sm sm:text-base whitespace-nowrap"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW
          </Link>

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

            <MdViewList
              className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
              style={{
                color: view === "list" ? "#473472" : "#b0b0b0",
                cursor: "pointer",
              }}
              onClick={() => setView("list")}
            />

            <MdViewKanban
              className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
              style={{
                color: view === "kanban" ? "#473472" : "#b0b0b0",
                cursor: "pointer",
              }}
              onClick={() => setView("kanban")}
            />
          </div>
        </div>

        {view === "list" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr
                style={{ color: "#473472", borderBottom: "2px solid #473472" }}
              >
                <th className="text-left pb-2">Reference</th>
                <th className="text-left pb-2">From</th>
                <th className="text-left pb-2">Schedule</th>
                <th className="text-left pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No receipts found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Link
                        to={`/receipts/${r._id}`}
                        style={{ color: "#473472" }}
                        className="underline"
                      >
                        {r.reference}
                      </Link>
                    </td>
                    <td className="p-3">{r.supplier || "Vendor"}</td>
                    <td className="p-3">
                      {r.scheduleDate
                        ? new Date(r.scheduleDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      className="p-3 font-semibold"
                      style={{
                        color:
                          r.status === "Done"
                            ? "green"
                            : r.status === "Ready"
                            ? "#53629E"
                            : "#473472",
                      }}
                    >
                      {r.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {view === "kanban" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {["Draft", "Ready", "Done", "Canceled"].map((col) => (
              <div key={col}>
                <h3
                  className="text-lg font-bold mb-3 text-center"
                  style={{ color: "#473472" }}
                >
                  {col}
                </h3>

                <div
                  className="p-3 rounded-xl border"
                  style={{ borderColor: "#473472", minHeight: "200px" }}
                >
                  {grouped[col].length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                      No receipts
                    </p>
                  ) : (
                    grouped[col].map((r) => (
                      <div
                        key={r._id}
                        className="p-3 mb-3 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                        style={{ border: "1px solid #e0e0e0" }}
                        onClick={() => navigate(`/receipts/${r._id}`)}
                      >
                        <div
                          className="font-bold text-sm"
                          style={{ color: "#473472" }}
                        >
                          {r.reference}
                        </div>
                        <div className="text-xs text-gray-600">
                          {r.supplier}
                        </div>
                        <div className="text-xs">
                          {r.scheduleDate
                            ? new Date(r.scheduleDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
