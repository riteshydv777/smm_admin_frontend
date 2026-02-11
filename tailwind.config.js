import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 
      bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-md">
      
      {/* Title */}
      <h1 className="text-xl font-semibold text-white tracking-wide">
        Admin Dashboard
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
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
