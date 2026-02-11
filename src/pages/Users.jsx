import { useEffect, useState } from "react";
import { getAllUsers, getUserOrders } from "../api/usersApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openOrders = async (user) => {
    setSelectedUser(user);
    setLoadingOrders(true);

    try {
      const data = await getUserOrders(user.telegramId);
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  /* ===============================
     📥 DOWNLOAD CSV FUNCTION
  ================================= */
  const downloadCSV = () => {
    if (!orders.length) return;

    const headers = [
      "Order ID",
      "Service",
      "Target",
      "Quantity",
      "Price",
      "Status",
      "Panel Order ID",
      "Created At",
    ];

    const rows = orders.map((o) => [
      o.orderId,
      o.serviceName,
      o.target,
      o.quantity,
      o.price,
      o.status,
      o.panelOrderId ?? "",
      o.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((val) => `"${val}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `user_${selectedUser.telegramId}_orders.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        👥 Users Management
      </h2>

      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left">Telegram ID</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">First Name</th>
              <th className="p-4 text-left">Total Orders</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.telegramId}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-4 font-medium">{u.telegramId}</td>
                <td className="p-4">{u.username || "-"}</td>
                <td className="p-4">{u.firstName || "-"}</td>
                <td className="p-4">{u.totalOrders}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openOrders(u)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =============================
         📦 ORDERS MODAL
      ============================== */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold">
                📦 Orders of{" "}
                {selectedUser.username || selectedUser.telegramId}
              </h3>

              <div className="flex gap-3">
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ⬇ Download CSV
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-red-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {loadingOrders ? (
                <p className="text-gray-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 text-left">Order ID</th>
                      <th className="p-2 text-left">Service</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-left">Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.orderId} className="border-t">
                        <td className="p-2">{o.orderId}</td>
                        <td className="p-2">{o.serviceName}</td>
                        <td className="p-2">{o.quantity}</td>
                        <td className="p-2">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="p-2 text-right">₹{o.price}</td>
                        <td className="p-2">
                          {new Date(o.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================
   STATUS BADGE
============================= */
function StatusBadge({ status }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  const colors = {
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    PROVIDER_FAILED: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`${base} ${
        colors[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
