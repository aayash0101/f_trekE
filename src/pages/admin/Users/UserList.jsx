import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../../api/Admin/userapi';
import '../../../../styles/UserList.css';

export default function UserList() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
  try {
    const data = await getAllUsers();
    console.log('User data from API:', data);
    setUsers(data);  // <-- check what this is, adjust below accordingly
  } catch (error) {
    console.error('Failed to fetch users', error);
  }
};


  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
      setUsers(users.filter(user => user._id !== id)); // adjust if your id field is `id` instead of `_id`
    }
  };

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.userType}</td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
