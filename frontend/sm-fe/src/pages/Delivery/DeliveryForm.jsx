import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function DeliveryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState({
    from: "",
    to: "",
    contact: "",
    scheduleDate: "",
    customer: "",
    reference: "",
    items: [],
    note: "",
    status: "Draft",
  });

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [insufficient, setInsufficient] = useState({}); // { index: { available, required } }

  useEffect(() => {
    loadProducts();
    loadLocations();
    if (id) loadExisting();
  }, [id]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadExisting = async () => {
    try {
      const res = await api.get(`/deliveries/${id}`);
      const d = res.data;
      setDelivery({
        ...d,
        scheduleDate: d.scheduleDate ? d.scheduleDate.slice(0, 10) : "",
        status: d.status || "Draft",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () =>
    setDelivery((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { product: "", location: "", quantity: 1 },
      ],
    }));

  const updateItem = (i, field, value) => {
    const copy = [...(delivery.items || [])];
    copy[i] = { ...copy[i], [field]: value };
    setDelivery({ ...delivery, items: copy });
    // clear insufficient flag for that line when changed
    setInsufficient((prev) => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };

  const removeItem = (i) => {
    setDelivery({
      ...delivery,
      items: delivery.items.filter((_, idx) => idx !== i),
    });
    setInsufficient((prev) => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };

  const saveDraft = async () => {
    if (!delivery.items || delivery.items.length === 0)
      return alert("Please add at least one item");
    setLoading(true);
    try {
      if (isNew) {
        await api.post("/deliveries", delivery);
      } else {
        await api.put(`/deliveries/${id}`, delivery);
      }
      alert("Delivery saved as Draft");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg || "Error saving");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const localCheckStock = async () => {
    if (!delivery.items || delivery.items.length === 0) {
      alert("Add at least one item first");
      return;
    }
    const insuff = {};
    for (let i = 0; i < delivery.items.length; i++) {
      const it = delivery.items[i];
      if (!it.product || !it.location) {
        insuff[i] = { available: 0, required: it.quantity || 0 };
        continue;
      }
      try {
        const p = await api.get(`/products/${it.product}`);
        const prod = p.data;

        const stockMap = prod.stockByLocation || prod.stock_by_location || {};

        const avail = stockMap[it.location] ?? stockMap.get?.(it.location) ?? 0;
        if (avail < (it.quantity || 0)) {
          insuff[i] = { available: avail, required: it.quantity || 0 };
        }
      } catch (err) {
        insuff[i] = { available: 0, required: it.quantity || 0 };
      }
    }
    setInsufficient(insuff);
    return insuff;
  };

  const checkStock = async () => {
    if (!id) return alert("Save draft first to run stock check");
    try {
      await localCheckStock();
      const res = await api.post(`/deliveries/${id}/check-stock`);
      setDelivery((prev) => ({
        ...prev,
        status: res.data.delivery?.status || res.data.status || prev.status,
      }));
      alert(
        `Delivery moved to ${res.data.delivery?.status || res.data.status}`
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Check stock failed");
      console.error(err);
    }
  };

  const validateDelivery = async () => {
    if (!id) return alert("Save draft first");
    if (delivery.status !== "Ready") {
      if (!window.confirm("Delivery is not Ready — attempt validate anyway?"))
        return;
    }
    if (!window.confirm("Validate delivery? This will reduce stock.")) return;

    try {
      await api.post(`/deliveries/${id}/validate`);
      alert("Delivery validated and stock reduced");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg || "Validation failed");
      console.error(err);
    }
  };

  const cancelDelivery = async () => {
    if (!id) return alert("Save draft first");
    if (!window.confirm("Cancel this delivery?")) return;
    try {
      await api.post(`/deliveries/${id}/cancel`);
      alert("Delivery canceled");
      navigate("/delivery");
    } catch (err) {
      alert(err.response?.data?.msg || "Cancel failed");
    }
  };

  return (
    <div className="p-10" style={{ background: "#f2f8ff", minHeight: "100vh" }}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#473472" }}>
          {isNew ? "New Delivery" : `Delivery ${delivery.reference || ""}`}
        </h1>

        <div className="bg-white p-6 rounded-xl border shadow">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-medium">From (Warehouse)</label>
              <select
                className="w-full border p-2 rounded"
                value={delivery.from || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, from: e.target.value })
                }
              >
                <option value="">Select warehouse</option>
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} ({l.shortCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">To (Delivery address)</label>
              <input
                className="w-full border p-2 rounded"
                value={delivery.to || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, to: e.target.value })
                }
                placeholder="Customer / address"
              />
            </div>

            <div>
              <label className="font-medium">Contact Person</label>
              <input
                className="w-full border p-2 rounded"
                value={delivery.contact || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, contact: e.target.value })
                }
              />
            </div>

            <div>
              <label className="font-medium">Schedule Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={delivery.scheduleDate || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, scheduleDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="font-medium">Reference (optional)</label>
              <input
                className="w-full border p-2 rounded"
                value={delivery.reference || ""}
                onChange={(e) =>
                  setDelivery({ ...delivery, reference: e.target.value })
                }
              />
            </div>

            <div>
              <label className="font-medium">Status</label>
              <div
                className="p-2 rounded border"
                style={{ borderColor: "#53629E" }}
              >
                {delivery.status}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold" style={{ color: "#473472" }}>
              Delivery Items
            </h2>
            <button
              onClick={addItem}
              className="px-4 py-2 rounded text-white"
              style={{ background: "#473472" }}
            >
              + Add Item
            </button>
          </div>

          <table className="w-full border mb-6">
            <thead>
              <tr style={{ borderBottom: "2px solid #473472" }}>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Availability</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(delivery.items || []).map((item, i) => {
                const ins = insufficient[i];
                const isBad = !!ins;
                return (
                  <tr key={i} className="border-b">
                    <td className="p-2">
                      <select
                        className={`border p-2 rounded w-full ${
                          isBad ? "ring-2 ring-red-300" : ""
                        }`}
                        value={item.product || ""}
                        onChange={(e) =>
                          updateItem(i, "product", e.target.value)
                        }
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2">
                      <select
                        className={`border p-2 rounded w-full ${
                          isBad ? "ring-2 ring-red-300" : ""
                        }`}
                        value={item.location || ""}
                        onChange={(e) =>
                          updateItem(i, "location", e.target.value)
                        }
                      >
                        <option value="">Select Location</option>
                        {locations.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.name} ({l.shortCode})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        className={`border p-2 rounded w-full ${
                          isBad ? "ring-2 ring-red-300" : ""
                        }`}
                        value={item.quantity || 1}
                        onChange={(e) =>
                          updateItem(i, "quantity", Number(e.target.value))
                        }
                      />
                    </td>

                    <td className="p-2">
                      {ins ? (
                        <div className="text-sm text-red-600">
                          {`Need ${ins.required}, available ${ins.available}`}
                        </div>
                      ) : (
                        <div className="text-sm text-green-700">OK</div>
                      )}
                    </td>

                    <td className="p-2">
                      <button
                        onClick={() => removeItem(i)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(delivery.items || []).length === 0 && (
                <tr>
                  <td colSpan="5" className="p-3 text-gray-500 text-center">
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <label className="font-medium">Notes</label>
          <textarea
            className="w-full border p-2 rounded mb-6"
            value={delivery.note || ""}
            onChange={(e) => setDelivery({ ...delivery, note: e.target.value })}
            placeholder="Optional note..."
          />

          <div className="flex gap-4">
            <button
              disabled={loading}
              onClick={saveDraft}
              className="px-6 py-2 rounded text-white font-semibold"
              style={{ background: "#473472" }}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>

            {id && delivery.status !== "Done" && (
              <button
                onClick={checkStock}
                className="px-6 py-2 rounded text-white"
                style={{ background: "#53629E" }}
              >
                Check Stock
              </button>
            )}

            {id && delivery.status === "Ready" && (
              <button
                onClick={validateDelivery}
                className="px-6 py-2 rounded text-white bg-green-600 font-semibold"
              >
                Validate
              </button>
            )}

            {id && delivery.status !== "Done" && (
              <button
                onClick={cancelDelivery}
                className="px-6 py-2 rounded text-white bg-red-500 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
