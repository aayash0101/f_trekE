import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',  // Your backend server URL
  // You can add default headers here if needed, e.g.:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Optional: Add a request interceptor to automatically add auth token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
