import axios from "axios";
import { store } from "../Redux";

// const axios = require('axios');

// Step-1: Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.
const customAxios = axios.create({
  // baseURL: "http://192.168.1.25:8081/",
  // baseURL: 'http://65.2.161.63:3000',
  // baseURL: `${process.env.REACT_APP_API_URL}`,
  // baseURL: `http://localhost:8081`,
  //baseURL: `http://65.0.31.159:3000`,
  baseURL: `https://eduwizer.com/api/`,
  // baseURL: `https://eduwizer.com`,
  // baseURL: "http://43.205.237.123",

  timeout: 30000,
});

// Step-2: Create request, response & error handlers
const requestHandler = (request) => {
  console.log("Interceptor running for URL:", request.url);
  if (store.getState().dataReducer.loginData) {
    let token = store.getState().dataReducer.loginData;
    console.log("Raw token from store:", token);

    // If the token is an object, try to extract the actual token string
    if (typeof token === "object" && token !== null) {
      token = token.loginData || token.token || token.session || token.accessToken || JSON.stringify(token);
      console.log("Extracted token from object:", token);
    }

    // Remove any surrounding literal quotes (often caused by double stringification or localstorage parsing)
    if (typeof token === "string") {
      token = token.replace(/^["']|["']$/g, "");
      console.log("Token after stripping quotes:", token);
    }

    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    console.log("Final formatted token:", formattedToken);

    request.headers.Authorization = formattedToken;
  } else {
    console.log("No token found in store.getState().dataReducer.loginData");
  }
  return request;
};

const responseHandler = (response) => {
  if (response.status === 401) {
    window.location = "/login";
  }

  return response;
};

const errorHandler = (error) => {
  // if (error.response.status === 401) {
  //   store.dispatch(setLogout());
  // }
  return Promise.reject(
    error?.response?.data?.message || error?.response?.data || error
  );
};

// Step-3: Configure/make use of request & response interceptors from Axios
// Note: You can create one method say configureInterceptors, add below in that,
// export and call it in an init function of the application/page.
customAxios.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

customAxios.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

// Step-4: Export the newly created Axios instance to be used in different locations.
export default customAxios;
