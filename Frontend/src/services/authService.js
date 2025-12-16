import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const authService = {
  login: async (email, password) => {
    const res = await api.post("/api/auth/login", {
      email,
      password
    });
    return res.data;
  },

  register: async (userData) => {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone
    };

    const res = await api.post("/api/auth/register", payload);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/api/auth/logout");
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  }
};

export default authService;