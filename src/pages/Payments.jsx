import { useEffect, useState } from "react";
import { getPaymentStats, getAllPayments } from "../api/paymentApi";
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
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsData = await getPaymentStats();
      const paymentsData = await getAllPayments();
      setStats(statsData);
      setPayments(paymentsData);
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= DOWNLOAD CSV ================= */
  const downloadCSV = () => {
    if (payments.length === 0) return;

    const headers = [
      "Order ID",
      "Telegram ID",
      "Amount",
      "Profit",
      "Payment Status",
      "Created At",
    ];

    const rows = payments.map((p) => [
      p.orderId,
      p.telegramId,
      p.amount,
      p.profit,
      p.paymentStatus,
      p.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) {
    return <p className="p-6 text-gray-500">Loading payments...</p>;
  }

  /* ================= CHART DATA ================= */

  const revenueChart = {
    labels: ["Today", "This Month", "Total"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [
          stats.todayRevenue,
          stats.monthlyRevenue,
          stats.totalRevenue,
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#8b5cf6"],
        borderRadius: 8,
      },
    ],
  };

  const profitChart = {
    labels: ["Today", "This Month", "Total"],
    datasets: [
      {
        label: "Profit (₹)",
        data: [
          stats.todayProfit,
          stats.monthlyProfit,
          stats.totalProfit,
        ],
        backgroundColor: ["#f97316", "#14b8a6", "#6366f1"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        💰 Payments & Profit Dashboard
      </h2>

      {/* ================== STATS CARDS ================== */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

        <StatCard
          title="Today Revenue"
          value={`₹${stats.todayRevenue.toFixed(2)}`}
          color="green"
        />

        <StatCard
          title="Today Profit"
          value={`₹${stats.todayProfit.toFixed(2)}`}
          color="orange"
        />

        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toFixed(2)}`}
          color="blue"
        />

        <StatCard
          title="Monthly Profit"
          value={`₹${stats.monthlyProfit.toFixed(2)}`}
          color="purple"
        />

        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          color="indigo"
        />

        <StatCard
          title="Total Profit"
          value={`₹${stats.totalProfit.toFixed(2)}`}
          color="pink"
        />
      </div>

      {/* ================== CHARTS ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">📊 Revenue Overview</h3>
          <Bar data={revenueChart} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">📈 Profit Overview</h3>
          <Bar data={profitChart} />
        </div>
      </div>

      {/* ================== DOWNLOAD BUTTON ================== */}
      <div className="flex justify-end">
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          ⬇ Download Payments CSV
        </button>
      </div>

      {/* ================== PAYMENTS TABLE ================== */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Telegram ID</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Profit</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.orderId} className="border-t">
                <td className="p-3">{p.orderId}</td>
                <td className="p-3">{p.telegramId}</td>
                <td className="p-3 text-center">₹{p.amount}</td>
                <td className="p-3 text-center">₹{p.profit}</td>
                <td className="p-3 text-center">
                  <StatusBadge status={p.paymentStatus} />
                </td>
                <td className="p-3 text-center">{p.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color }) {
  const colors = {
    green: "text-green-600",
    orange: "text-orange-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    pink: "text-pink-600",
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

function StatusBadge({ status }) {
  const colors = {
    PAID: "bg-green-100 text-green-700",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
