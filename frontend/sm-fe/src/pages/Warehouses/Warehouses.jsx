import React from "react";
import { motion } from "framer-motion";
import api from "../../api";

export default function Warehouses() {
  const [list, setList] = React.useState([]);
  const [name, setName] = React.useState("");
  const [shortCode, setShortCode] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/warehouses");
      setList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch warehouses", err);
    }
    setLoading(false);
  };

  const createWarehouse = async () => {
    if (!name || !shortCode) {
      alert("Name and shortcode required");
      return;
    }
    try {
      await api.post("/warehouses", { name, shortCode, address });
      setName("");
      setShortCode("");
      setAddress("");
      load();
    } catch (err) {
      alert(err.response?.data?.msg || "Creation failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
        Warehouses
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#53629E" }}>
          Add New Warehouse
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="p-2 border rounded-md outline-none"
            style={{ borderColor: "#53629E" }}
            placeholder="Warehouse Name"
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

          <input
            className="p-2 border rounded-md outline-none"
            style={{ borderColor: "#53629E" }}
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          onClick={createWarehouse}
          className="mt-4 px-4 py-2 text-white rounded-md font-semibold"
          style={{ background: "#473472" }}
        >
          Add Warehouse
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow border border-gray-200"
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Short Code</th>
              <th className="p-3 text-left">Address</th>
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
                  No warehouses found.
                </td>
              </tr>
            ) : (
              list.map((w) => (
                <tr key={w._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{w.name}</td>
                  <td className="p-3">{w.shortCode}</td>
                  <td className="p-3">{w.address || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this warehouse?")) return;
                        try {
                          await api.delete(`/warehouses/${w._id}`);
                          load();
                        } catch (err) {
                          alert(
                            "Cannot delete warehouse. Remove linked locations first."
                          );
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
