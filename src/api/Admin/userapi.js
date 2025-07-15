import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api",  // Your backend base URL
  withCredentials: true,                  // Include cookies if needed
});

// Get user profile by ID
export const getUserProfile = async (userId) => {
  const response = await API.get(`/users/profile/${userId}`);
  return response.data;  // Return the actual user object here
};
// Update user profile by ID
export const updateUserProfile = async (userId, userData) => {
  const response = await API.put(`/users/profile/${userId}`, userData);
  return response.data;
};


// Get all users
export const getAllUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Delete user by ID
export const deleteUser = async (id) => {
  try {
    await API.delete(`/users/${id}`);
    return true;
  } catch (error) {
    console.error('Delete user API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};
