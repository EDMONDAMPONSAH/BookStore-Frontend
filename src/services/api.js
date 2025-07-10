import axios from "axios";

const api = axios.create({
  baseURL: "https://bookstore-api-40ll.onrender.com", // your backend base URL
});

// Attach JWT token to all requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, possibly expired token");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
