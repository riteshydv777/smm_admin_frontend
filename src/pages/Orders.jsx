import { useEffect, useState } from "react";
import { getAllOrders, getOrdersByStatus } from "../api/ordersApi";

const STATUS_OPTIONS = [
  "ALL",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "PROVIDER_FAILED",
  "CANCELLED",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadOrders();
  }, [status]);

  useEffect(() => {
    applyDateFilter();
  }, [orders, fromDate, toDate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data =
        status === "ALL"
          ? await getAllOrders()
          : await getOrdersByStatus(status);

      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (!fromDate && !toDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const created = new Date(order.createdAt);

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate + "T23:59:59") : null;

      if (from && created < from) return false;
      if (to && created > to) return false;

      return true;
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        📦 Orders Management
      </h2>

      {/* STATUS FILTER */}
      <div className="flex gap-3 flex-wrap">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                status === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* DATE FILTER */}
      <div className="flex gap-4 items-end flex-wrap bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="block mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="block mt-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading orders...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">User</th>
                <th className="p-4 text-center">Created At</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-4 font-medium">{o.id}</td>
                  <td className="p-4">{o.serviceName}</td>
                  <td className="p-4 text-center">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-4 text-center font-semibold">
                    ₹{o.price}
                  </td>
                  <td className="p-4 text-center">{o.telegramId}</td>
                  <td className="p-4 text-center text-xs">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }) {
  const map = {
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    PROVIDER_FAILED: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
