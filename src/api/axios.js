import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // ✅ ROOT only
  headers: {
    "X-ADMIN-KEY": "RITZ_ADMIN_2026_SECRET",
  },
});

export default api;
