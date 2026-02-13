import { useEffect, useState } from "react";
import { getAllServices, updateService } from "../api/serviceApi";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     TOGGLE ENABLE / DISABLE
  ================================== */
  const toggleService = async (service) => {
    try {
      const updated = {
        ...service,
        active: !service.active,
      };

      // Update UI instantly
      setServices(prev =>
        prev.map(s => (s.id === service.id ? updated : s))
      );

      await updateService(service.id, {
        profitPercent: updated.profitPercent,
        active: updated.active,
      });

    } catch (e) {
      console.error(e);
      alert("Failed to update service status");
      loadServices(); // fallback reload
    }
  };

  /* ===============================
     UPDATE PROFIT %
  ================================== */
  const updateProfit = async (service, value) => {
    if (value < 0 || value > 100) {
      alert("Profit % must be between 0 and 100");
      return;
    }

    // Calculate new selling price instantly
    const newSellingPrice =
      service.providerRate +
      (service.providerRate * value) / 100;

    const updated = {
      ...service,
      profitPercent: value,
      sellingPrice: newSellingPrice,
    };

    // Update UI instantly
    setServices(prev =>
      prev.map(s => (s.id === service.id ? updated : s))
    );

    try {
      await updateService(service.id, {
        profitPercent: value,
        active: service.active,
      });

    } catch (e) {
      console.error(e);
      alert("Failed to update profit percent");
      loadServices(); // fallback reload
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading services...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        🛠 Services Management
      </h2>

      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Service Name</th>
              <th className="p-4 text-center">Platform</th>
              <th className="p-4 text-center">Provider Rate</th>
              <th className="p-4 text-center">Selling Price</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Profit %</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr
                key={s.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-4 font-medium">{s.id}</td>

                <td className="p-4 max-w-sm">{s.name}</td>

                <td className="p-4 text-center">{s.platform}</td>

                <td className="p-4 text-center">
                  ₹{Number(s.providerRate).toFixed(2)}
                </td>

                <td className="p-4 text-center font-semibold text-green-600">
                  ₹{Number(s.sellingPrice).toFixed(2)}
                </td>

                <td className="p-4 text-center">
                  <StatusBadge active={s.active} />
                </td>

                <td className="p-4 text-center">
                  <input
                    type="number"
                    value={s.profitPercent}
                    onChange={(e) =>
                      updateProfit(s, Number(e.target.value))
                    }
                    className="w-20 text-center border rounded px-2 py-1 dark:bg-gray-800"
                  />
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleService(s)}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      s.active
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {s.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500">
        💡 Profit % updates selling price instantly based on provider rate.
      </p>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ active }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "ACTIVE" : "DISABLED"}
    </span>
  );
}
