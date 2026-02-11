import api from "./axios";

// 👇 alias to match Services.jsx
export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

export const getAllServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

export const enableService = async (id) => {
  const res = await api.put(`/services/${id}/enable`);
  return res.data;
};

export const disableService = async (id) => {
  const res = await api.put(`/services/${id}/disable`);
  return res.data;
};

export const updateProfitPercent = async (id, profitPercent) => {
  const res = await api.put(`/services/${id}/profit`, {
    profitPercent,
  });
  return res.data;
};
