import axios from "axios";

function jwtInterceptor() {
  // กำหนด base URL จาก ENV ถ้าไม่มีให้ fallback เป็น origin ปัจจุบัน
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  axios.defaults.baseURL = BASE_URL;

  axios.interceptors.request.use((req) => {
    const hasToken = Boolean(window.localStorage.getItem("token"));
    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }
    return req;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error.includes("Unauthorized")
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;