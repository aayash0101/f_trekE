import API from '../api/api'; // Your Axios base instance

const AuthService = {
  // Login user
  login: async (credentials) => {
    const response = await API.post('/login', credentials);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  },

  // Signup user
  signup: async (userData) => {
    const response = await API.post('/signup', userData);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user object
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Optional: Check if user is admin
  isAdmin: () => {
    const user = AuthService.getUser();
    return user?.userType === 'ADMIN';
  }
};

export default AuthService;
