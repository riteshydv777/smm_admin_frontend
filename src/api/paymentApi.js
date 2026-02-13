import api from "./axios";

export const getAllPayments = async () => {
  const res = await api.get("/admin/payments");
  return res.data;
};

export const getPaymentStats = async () => {
  const res = await api.get("/admin/payments/stats");
  return res.data;
};
