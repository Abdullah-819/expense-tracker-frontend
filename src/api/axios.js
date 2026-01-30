import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-production-de56.up.railway.app/api",
  timeout: 10000,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Server down / no internet / CORS / timeout
    if (!error.response) {
      if (!window.location.pathname.includes("server-error")) {
        window.location.href = "/server-error";
      }
    }

    // Unauthorized → force logout
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
