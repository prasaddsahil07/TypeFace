// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor (cookie-based → no localStorage needed)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/register") ||
      originalRequest.url?.includes("/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        await api.get("/user/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post("/user/register", userData),
  login: (credentials) => api.post("/user/login", credentials),
  logout: () => api.post("/user/logout"),
  getUser: () => api.get("/user/info"),
  updateUser: (userData) => api.put("/user/update", userData),
  changePassword: (passwordData) => api.put("/user/change-password", passwordData),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/transaction?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/transaction/${id}`),
  create: (transactionData) => api.post("/transaction/add", transactionData),
  update: (id, transactionData) => api.put(`/transaction/${id}`, transactionData),
  delete: (id) => api.delete(`/transaction/${id}`),
  getCategoryStats: () => api.get("/transaction/stats/category"),
  getPaymentTypeStats: () => api.get("/transaction/stats/payment-type"),
  getMonthlyStats: () => api.get("/transaction/stats/monthly"),
};

export default api;
