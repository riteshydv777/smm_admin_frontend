// Use the same admin secret used elsewhere in the project
const ADMIN_KEY = "RITZ_ADMIN_2026_SECRET";

// ✅ this matches App.jsx import
export const isAuthenticated = () => {
  return localStorage.getItem("ADMIN_KEY") === ADMIN_KEY;
};

export const loginAdmin = (key) => {
  if (key === ADMIN_KEY) {
    localStorage.setItem("ADMIN_KEY", key);
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem("ADMIN_KEY");
};

// provide a `logout` named export to match imports elsewhere
export const logout = logoutAdmin;
