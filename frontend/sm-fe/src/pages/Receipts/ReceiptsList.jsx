import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";

export default function ReceiptsList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const res = await api.get("/receipts"); // backend: GET /receipts
      setItems(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((r) =>
    ((r.reference || "") + " " + (r.contact || "") + " " + (r.status || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#f2f8ff" }} className="min-h-screen pb-16">
      {/* NOTE: TopNav is provided by Layout so don't include it here */}

      <h1
        className="text-4xl font-bold text-center mt-10"
        style={{ color: "#473472" }}
      >
        Receipts
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-8 p-8 rounded-3xl bg-white border shadow-md"
        style={{ width: "92%", borderColor: "#473472" }}
      >
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/receipts/new"
            className="px-6 py-2 rounded-lg border font-semibold"
            style={{ borderColor: "#473472", color: "#473472" }}
          >
            NEW
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by reference / contact / status"
                className="px-3 py-1 border rounded-md text-sm outline-none"
                style={{ borderColor: "#53629E" }}
              />
              <FiSearch size={20} style={{ color: "#473472" }} />
            </div>

            <MdViewList size={26} style={{ color: "#473472" }} />
            <MdViewKanban size={26} style={{ color: "#473472" }} />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "#473472", borderBottom: "2px solid #473472" }}>
              <th className="text-left pb-2">Reference</th>
              <th className="text-left pb-2">From</th>
              <th className="text-left pb-2">To</th>
              <th className="text-left pb-2">Contact</th>
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
                  <td className="p-3">{r.from || r.supplier || "vendor"}</td>
                  <td className="p-3">{r.to || r.warehouse || "—"}</td>
                  <td className="p-3">{r.contact || r.supplier || "—"}</td>
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
                    {r.status || "Draft"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div
          className="mt-6 text-gray-700 text-center"
          style={{ fontFamily: "handwriting" }}
        >
          Populate all receipt operations
        </div>
      </motion.div>
    </div>
  );
}
