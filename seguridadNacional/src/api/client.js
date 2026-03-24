import axios from "axios";
import { API_BASE_URL } from "../config/app";

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor → agrega token automáticamente
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;