import { useEffect, useState } from "react";
import { getPaymentStats } from "../api/paymentApi";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Payments() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getPaymentStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!stats) {
    return <p className="p-6 text-gray-500">Loading payments...</p>;
  }

  const chartData = {
    labels: ["Today", "This Month", "Total"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [
          stats.todayRevenue,
          stats.monthRevenue,
          stats.totalRevenue,
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#8b5cf6"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        💰 Payments & Profit
      </h2>

      {/* ====== TOP STATS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} color="green" />
        <StatCard title="Today Revenue" value={`₹${stats.todayRevenue}`} color="blue" />
        <StatCard title="Paid Orders" value={stats.paidOrders} color="purple" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} color="red" />
      </div>

      {/* ====== PROFIT SECTION ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4">
            📊 Revenue Overview
          </h3>
          <Bar data={chartData} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4">
            🧮 Estimated Profit
          </h3>

          <div className="space-y-4">
            <ProfitRow
              label="Estimated Total Profit"
              value={`₹${stats.estimatedProfit}`}
            />
            <ProfitRow
              label="Avg Profit %"
              value={`${stats.avgProfitPercent}%`}
            />
            <ProfitRow
              label="Provider Cost"
              value={`₹${stats.providerCost}`}
            />
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Profit is calculated using service profit %
          </p>
        </div>
      </div>
    </div>
  );
}

/* ====== COMPONENTS ====== */

function StatCard({ title, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function ProfitRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
