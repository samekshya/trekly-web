import axios from "axios";

const api = axios.create({
  baseURL: "/api",        // ✅ IMPORTANT: same-origin
  withCredentials: true,  // keep this
});

export default api;