import { useEffect, useState } from "react";
import { getAllUsers, getUserOrders } from "../api/usersApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const openOrders = async (user) => {
    setSelectedUser(user);
    setLoadingOrders(true);

    try {
      const data = await getUserOrders(user.telegramId);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        👥 Users Management
      </h2>

      <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Telegram ID</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-right">Orders</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u.telegramId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{u.telegramId}</td>
                <td className="p-4">{u.username || "-"}</td>
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
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Orders Modal ---------- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">
                📦 Orders of {selectedUser.username || selectedUser.telegramId}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {loadingOrders ? (
                <p className="text-gray-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Order ID</th>
                      <th className="p-2 text-left">Service</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-t">
                        <td className="p-2">{o.id}</td>
                        <td className="p-2">{o.serviceName}</td>
                        <td className="p-2">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="p-2 text-right">₹{o.price}</td>
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

/* ---------- Status Badge ---------- */
function StatusBadge({ status }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  const colors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`${base} ${colors[status] || "bg-gray-200 text-gray-700"}`}>
      {status}
    </span>
  );
}
