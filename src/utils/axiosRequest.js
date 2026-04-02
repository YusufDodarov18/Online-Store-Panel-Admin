import axios from "axios";

const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin");
    }
    return Promise.reject(error);
  },
);

export default axiosRequest;
