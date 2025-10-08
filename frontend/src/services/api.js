import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: false,
});
export const getProducts = (params={}) => api.get('/products', { params }).then(r => r.data);
export const getProduct  = (id) => api.get(`/products/${id}`).then(r => r.data);
export default api;
