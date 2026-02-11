// src/auth/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../utils/auth";

export default function AdminLogin({ onLogin }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const success = loginAdmin(key);

    if (success) {
      onLogin();
      navigate("/dashboard");
    } else {
      setError("Invalid Admin Key");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-gray-900">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white tracking-wide">
          Admin Panel
        </h1>
        <p className="text-center text-gray-300 text-sm mt-1 mb-8">
          Secure administrator access
        </p>

        {/* Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Admin Secret Key
          </label>
          <input
            type="password"
            placeholder="••••••••••"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none transition"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:from-purple-700 hover:to-indigo-700
          active:scale-[0.98] transition-all shadow-lg"
        >
          Login Securely
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-600/40"></div>
          <span className="text-xs text-gray-400">ADMIN ACCESS</span>
          <div className="flex-1 h-px bg-gray-600/40"></div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} SMM Admin System
        </p>
      </div>
    </div>
  );
}
