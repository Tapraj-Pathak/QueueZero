import axios from "axios";

const baseURL = import.meta.env.BASE_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
