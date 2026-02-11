import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Topbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-8
      bg-white/10 dark:bg-black/20
      backdrop-blur-xl border-b border-white/10 dark:border-gray-700
      shadow-md"
    >
      {/* Title */}
      <h1 className="text-xl font-semibold tracking-wide text-white dark:text-gray-100">
        Admin Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-xl text-sm font-medium
          text-white dark:text-gray-200
          bg-gradient-to-r from-indigo-500 to-purple-500
          hover:from-indigo-600 hover:to-purple-600
          transition-all shadow-lg"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-red-500 to-pink-500
          hover:from-red-600 hover:to-pink-600
          active:scale-95 transition-all shadow-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
