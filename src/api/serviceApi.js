import api from "./axios";

// GET all services
export const getAllServices = async () => {
  const res = await api.get("/admin/services");
  return res.data;
};

// UPDATE service (profit + active)
export const updateService = async (id, payload) => {
  await api.put(`/admin/services/${id}`, payload);
};
