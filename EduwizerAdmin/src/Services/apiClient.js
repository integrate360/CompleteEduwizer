import axios from "axios";

// Backend base URL. Defaults to production; override locally with a .env file:
//   VITE_API_URL=http://localhost:8081
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://eduwizer.com/api",
});

const requestHandler = (request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  if (request.data instanceof FormData) {
    request.headers["Content-Type"] = "multipart/form-data";
  } else if (
    request.data &&
    (typeof request.data === "object" || Array.isArray(request.data))
  ) {
    const isSpecialObject =
      request.data instanceof Blob ||
      request.data instanceof ArrayBuffer ||
      request.data instanceof URLSearchParams;
    if (!isSpecialObject) {
      request.headers["Content-Type"] = "application/json";
    }
  }

  return request;
};

const responseHandler = (response) => {
  if (response.status === 401 && window.location.pathname !== "/login") {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return response;
};

apiClient.interceptors.request.use((request) => requestHandler(request));
apiClient.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
