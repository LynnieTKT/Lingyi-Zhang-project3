import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login endpoint
export const login = async (username, password) => {
  try {
    const response = await api.post("/api/users/login", { username, password });
    return response.data; // Returns token and user data
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Register endpoint
export const register = async (username, password) => {
  try {
    const response = await api.post("/api/users/register", { username, password });
    return response.data; // Returns registered user data
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Generic GET request
export const get = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "GET request failed" };
  }
};

// Generic POST request
export const post = async (endpoint, data, options = {}) => {
  try {
    const response = await api.post(endpoint, data, options);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "POST request failed" };
  }
};

// Generic DELETE request
export const remove = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "DELETE request failed" };
  }
};

// Generic PUT request
export const put = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "PUT request failed" };
  }
};

export default api;
