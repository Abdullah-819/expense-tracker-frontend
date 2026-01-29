import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-production-de56.up.railway.app/api",
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
