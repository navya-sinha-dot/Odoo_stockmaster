import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";
import api from "../../api";

export default function DeliveryList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // list | kanban
  const navigate = useNavigate();

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const res = await api.get("/deliveries");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((d) =>
    (
      (d.reference || "") +
      " " +
      (d.to || "") +
      " " +
      (d.contact || "") +
      " " +
      (d.status || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const grouped = {
    Draft: filtered.filter((r) => r.status === "Draft"),
    Waiting: filtered.filter((r) => r.status === "Waiting"),
    Ready: filtered.filter((r) => r.status === "Ready"),
    Done: filtered.filter((r) => r.status === "Done"),
    Canceled: filtered.filter((r) => r.status === "Canceled"),
  };

  return (
    <div className="min-h-screen" style={{ background: "#f2f8ff" }}>
      <h1
        className="text-4xl font-bold text-center mt-10"
        style={{ color: "#473472" }}
      >
        Delivery
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-10 p-8 rounded-3xl bg-white border shadow-md"
        style={{ width: "92%", borderColor: "#473472" }}
      >
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/delivery/new"
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

            <MdViewList
              size={26}
              style={{
                color: view === "list" ? "#473472" : "#b0b0b0",
                cursor: "pointer",
              }}
              onClick={() => setView("list")}
            />
            <MdViewKanban
              size={26}
              style={{
                color: view === "kanban" ? "#473472" : "#b0b0b0",
                cursor: "pointer",
              }}
              onClick={() => setView("kanban")}
            />
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{ color: "#473472", borderBottom: "2px solid #473472" }}
              >
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
                    No delivery orders found
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Link
                        to={`/delivery/${d._id}`}
                        className="underline"
                        style={{ color: "#473472" }}
                      >
                        {d.reference || "(no ref)"}
                      </Link>
                    </td>
                    <td className="p-3">
                      {d.from ? `${d.from.name} (${d.from.shortCode})` : "-"}
                    </td>
                    <td className="p-3">{d.to || "-"}</td>
                    <td className="p-3">{d.contact || "-"}</td>
                    <td className="p-3">
                      {d.scheduleDate
                        ? new Date(d.scheduleDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td
                      className="p-3 font-semibold"
                      style={{
                        color:
                          d.status === "Done"
                            ? "green"
                            : d.status === "Ready"
                            ? "#53629E"
                            : "#473472",
                      }}
                    >
                      {d.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* KANBAN VIEW */}
        {view === "kanban" && (
          <div className="grid grid-cols-5 gap-4 mt-6">
            {["Draft", "Waiting", "Ready", "Done", "Canceled"].map((col) => (
              <div key={col}>
                <h3
                  className="text-lg font-bold mb-3 text-center"
                  style={{ color: "#473472" }}
                >
                  {col}
                </h3>
                <div
                  className="p-3 rounded-xl border"
                  style={{ borderColor: "#473472", minHeight: 300 }}
                >
                  {grouped[col].length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                      No deliveries
                    </p>
                  ) : (
                    grouped[col].map((d) => (
                      <div
                        key={d._id}
                        className="p-3 mb-3 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                        style={{ border: "1px solid #e0e0e0" }}
                        onClick={() => navigate(`/delivery/${d._id}`)}
                      >
                        <div
                          className="font-bold text-sm"
                          style={{ color: "#473472" }}
                        >
                          {d.reference}
                        </div>
                        <div className="text-xs text-gray-600">{d.to}</div>
                        <div className="text-xs">
                          {d.scheduleDate
                            ? new Date(d.scheduleDate).toLocaleDateString()
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

        <div
          className="mt-6 text-gray-700 text-center"
          style={{ fontFamily: "handwriting" }}
        >
          Populate all delivery orders
        </div>
      </motion.div>
    </div>
  );
}
