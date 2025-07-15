// src/components/users/UserTable.jsx
import React from 'react';

function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="user-table">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Gender</th>
              <th>Address</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.height}</td>
                <td>{user.weight}</td>
                <td>{user.gender}</td>
                <td>{user.address}</td>
                <td>{user.userType}</td>
                <td>
                  <button onClick={() => onEdit(user)}>Edit</button>
                  <button onClick={() => onDelete(user.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserTable;
