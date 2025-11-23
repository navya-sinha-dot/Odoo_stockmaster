import axios from "axios";

const api = axios.create({
  baseURL: "https://stock-be.navyasinha.xyz/api",
});

export default api;
