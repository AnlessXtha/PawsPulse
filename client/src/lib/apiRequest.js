import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8805/api",
  withCredentials: true,
});

export default apiRequest;
