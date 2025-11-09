import axios from "axios";
import { v4 as uuid } from "uuid";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({ baseURL: API_URL });

// JWT en headers
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Products
export const getProducts = (params = {}) =>
  api.get("/products", { params }).then(r => r.data.items);
export const getProduct = (id) =>
  api.get(`/products/${id}`).then(r => r.data);

// Orders
export const createOrder = (items) =>
  api.post("/orders", { items }).then(r => r.data); // {order_id,total,status}

// Payments
export const createPayment = (order_id) =>
  api.post("/payments", { order_id }, {
    headers: { "Idempotency-Key": uuid() }
  }).then(r => r.data);

// Ratings
export const upsertRating = ({ product_id, rating }) =>
  api.post("/ratings", { product_id, rating }).then(r => r.data);

export default api;
