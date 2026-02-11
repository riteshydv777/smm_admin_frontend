import api from "./axios";

// ✅ Get all orders
export const getAllOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

// ✅ Get orders by status (uses query param like backend expects)
export const getOrdersByStatus = async (status) => {
  const res = await api.get("/admin/orders", {
    params: { status }
  });
  return res.data;
};
