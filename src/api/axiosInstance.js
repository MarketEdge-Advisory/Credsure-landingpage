import axios from "axios";

const instance = axios.create({
  baseURL: "https://credsure-backend-1564d84ae428.herokuapp.com/api",
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem("admin_user") || "{}");

  if (user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
});

export default instance;
