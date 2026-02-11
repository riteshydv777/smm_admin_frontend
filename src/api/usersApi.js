import api from "./axios";

/* ✅ MUST MATCH BACKEND: /admin/users */

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getUserOrders = async (telegramId) => {
  const res = await api.get(`/admin/users/${telegramId}/orders`);
  return res.data;
};
