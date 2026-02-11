import { useEffect, useState } from "react";
import {
  getAllServices,
  enableService,
  disableService,
  updateProfitPercent,
} from "../api/serviceApi";

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

  const toggleService = async (service) => {
    try {
      if (service.enabled) {
        await disableService(service.id);
      } else {
        await enableService(service.id);
      }
      loadServices();
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfit = async (id, value) => {
    if (value < 0 || value > 100) {
      alert("Profit % must be between 0 and 100");
      return;
    }

    try {
      await updateProfitPercent(id, value);
      loadServices();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading services...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🛠 Services Management
      </h2>

      <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Service Name</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Profit %</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{s.id}</td>

                <td className="p-4">{s.name}</td>

                <td className="p-4 text-center">
                  <StatusBadge enabled={s.enabled} />
                </td>

                <td className="p-4 text-center">
                  <input
                    type="number"
                    defaultValue={s.profitPercent}
                    className="w-20 text-center border rounded px-2 py-1"
                    onBlur={(e) =>
                      updateProfit(s.id, Number(e.target.value))
                    }
                  />
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleService(s)}
                    className={`px-4 py-2 rounded-lg text-white transition ${
                      s.enabled
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {s.enabled ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}

            {services.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        💡 Tip: Profit % is applied automatically while calculating order price.
      </p>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ enabled }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        enabled
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {enabled ? "ENABLED" : "DISABLED"}
    </span>
  );
}
