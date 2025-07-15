import API from './api'; // your configured axios instance with baseURL = http://localhost:5000

// User signup
export const signup = async (userData) => {
  return API.post('/api/users/signup', userData);
};

// User login
export const login = async (credentials) => {
  return API.post('/api/users/login', credentials);
};

// Optional: Logout function (client-side only)
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optional: window.location.href = '/login';
};
