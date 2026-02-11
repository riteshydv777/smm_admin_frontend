import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) {
    return <div className="p-6 text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <div className="p-6 space-y-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        📊 Admin Dashboard
      </h1>

      {/* Orders Overview */}
      <Section title="Orders Overview">
        <Grid>
          <Stat title="Total Orders" value={stats.totalOrders} />
          <Stat title="Today's Orders" value={stats.todayOrders} />
          <Stat title="Processing Orders" value={stats.processingOrders} />
          <Stat title="Completed Orders" value={stats.completedOrders} />
          <Stat title="Failed Orders" value={stats.failedOrders} />
        </Grid>
      </Section>

      {/* Users Overview */}
      <Section title="Users Overview">
        <Grid>
          <Stat title="Total Users" value={stats.totalUsers} />
          <Stat title="New Users Today" value={stats.newUsersToday} />
        </Grid>
      </Section>

      {/* Revenue Overview */}
      <Section title="Revenue Overview">
        <Grid>
          <MoneyStat title="Total Revenue" value={stats.totalRevenue} />
          <MoneyStat title="Today's Revenue" value={stats.todayRevenue} />
          <MoneyStat title="Monthly Revenue" value={stats.monthlyRevenue} />
        </Grid>
      </Section>

      {/* Services Overview */}
      <Section title="Services Overview">
        <Grid>
          <Stat title="Active Services" value={stats.activeServices} />
          <Stat title="Inactive Services" value={stats.inactiveServices} />
        </Grid>
      </Section>

    </div>
  );
}

/* ===================== */
/* Reusable Components   */
/* ===================== */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {children}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-lg border p-4 text-center bg-gray-50">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">
        {value}
      </p>
    </div>
  );
}

function MoneyStat({ title, value }) {
  return (
    <div className="rounded-lg border p-4 text-center bg-green-50">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-green-700 mt-1">
        ₹ {Number(value).toFixed(2)}
      </p>
    </div>
  );
}
