import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Orders", path: "/orders", icon: "📦" },
  { name: "Users", path: "/users", icon: "👤" },
  { name: "Services", path: "/services", icon: "⚙️" },
  { name: "Payments", path: "/payments", icon: "💳" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/10 text-white flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 text-2xl font-bold tracking-wide border-b border-white/10">
        🚀 <span className="text-indigo-400">SMM</span> Admin
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {/* Active Indicator */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition
              ${item.path === window.location.pathname ? "bg-indigo-400" : "bg-transparent"}`}
            />

            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium tracking-wide">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 text-xs text-gray-400 border-t border-white/10 text-center">
        © 2026 SMM Panel
      </div>
    </aside>
  );
}
