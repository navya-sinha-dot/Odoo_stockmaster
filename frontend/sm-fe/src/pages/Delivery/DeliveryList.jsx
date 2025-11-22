import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdViewList, MdViewKanban } from "react-icons/md";
import { motion } from "framer-motion";
import api from "../../api";

export default function DeliveryList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      // IMPORTANT: backend route = /delivery, NOT /deliveries
      const res = await api.get("/deliveries");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((d) =>
    ((d.reference || "") + " " + (d.to || "") + " " + (d.contact || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
                placeholder="Search..."
                className="px-3 py-1 border rounded-md text-sm outline-none"
                style={{ borderColor: "#53629E" }}
              />
              <FiSearch size={20} style={{ color: "#473472" }} />
            </div>

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
              filtered.map((d, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link
                      to={`/delivery/${d._id}`}
                      className="underline"
                      style={{ color: "#473472" }}
                    >
                      {d.reference || "(no ref)"}
                    </Link>
                  </td>

                  {/* FROM */}
                  <td className="p-3">
                    {d.from ? `${d.from.name} (${d.from.shortCode})` : "-"}
                  </td>

                  {/* TO */}
                  <td className="p-3">{d.to || "-"}</td>

                  {/* CONTACT */}
                  <td className="p-3">{d.contact || "-"}</td>

                  {/* SCHEDULE DATE */}
                  <td className="p-3">
                    {d.scheduleDate
                      ? new Date(d.scheduleDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td className="p-3 font-semibold">{d.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
