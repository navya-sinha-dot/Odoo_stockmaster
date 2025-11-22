import React from "react";
import { motion } from "framer-motion";
import api from "../../api";

export default function Locations() {
  const [list, setList] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [name, setName] = React.useState("");
  const [shortCode, setShortCode] = React.useState("");
  const [warehouse, setWarehouse] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const locRes = await api.get("/locations");
      const whRes = await api.get("/warehouses");

      setList(locRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
    setLoading(false);
  };

  const createLocation = async () => {
    if (!name || !shortCode || !warehouse) {
      alert("All fields are required");
      return;
    }
    try {
      await api.post("/locations", { name, shortCode, warehouse });
      setName("");
      setShortCode("");
      setWarehouse("");
      load();
    } catch (err) {
      alert(err.response?.data?.msg || "Creation failed.");
    }
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
        Locations
      </h1>

      {/* CREATE NEW LOCATION */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#53629E" }}>
          Add New Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="p-2 border rounded-md outline-none"
            style={{ borderColor: "#53629E" }}
            placeholder="Location Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-2 border rounded-md outline-none"
            style={{ borderColor: "#53629E" }}
            placeholder="Short Code"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />

          <select
            className="p-2 border rounded-md outline-none"
            style={{ borderColor: "#53629E" }}
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.shortCode})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createLocation}
          className="mt-4 px-4 py-2 text-white rounded-md font-semibold"
          style={{ background: "#473472" }}
        >
          Add Location
        </button>
      </motion.div>

      {/* LOCATIONS LIST */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow border border-gray-200"
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Short Code</th>
              <th className="p-3 text-left">Warehouse</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No locations found.
                </td>
              </tr>
            ) : (
              list.map((loc) => (
                <tr key={loc._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{loc.name}</td>
                  <td className="p-3">{loc.shortCode}</td>
                  <td className="p-3">
                    {loc.warehouse?.name || "—"}{" "}
                    <span className="text-xs text-gray-400">
                      ({loc.warehouse?.shortCode})
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this location?")) return;
                        try {
                          await api.delete(`/locations/${loc._id}`);
                          load();
                        } catch (err) {
                          alert("Cannot delete. It may be linked to stock!");
                        }
                      }}
                      className="px-3 py-1 rounded text-sm bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
