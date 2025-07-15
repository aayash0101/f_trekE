// src/hooks/useAdminUsers.js
import { useEffect, useState } from 'react';
import API from '../api/api'; // your axios instance

function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      const res = await API.post('/users/signup', userData);
      setUsers((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Add user error:', err);
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await API.put(`/users/${id}`, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...userData } : u))
      );
    } catch (err) {
      console.error('Update user error:', err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    editingUser,
    setEditingUser,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
}

export default useAdminUsers;
