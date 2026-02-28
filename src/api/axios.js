import axios from "axios";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://flipbook-backend.onrender.com";

// const BASE_URL="https://justrelybackend.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL + "/api",
});

export const BASE = BASE_URL; // 🔥 important for images
export default api;