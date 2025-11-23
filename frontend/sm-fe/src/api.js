import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api" || "https://stock-be.navyasinha.xyz/api",
});

export default api;
