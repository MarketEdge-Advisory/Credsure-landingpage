import axios from "axios";
import { clearAuthAndRedirect } from './fetchWithAuth';

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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default instance;
