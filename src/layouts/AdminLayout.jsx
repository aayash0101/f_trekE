import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './adminlayout.css'; // Create this CSS file for styling

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2 className="logo">TrekEnhance Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
            <li><Link to="/admin/treks">Manage Treks</Link></li>
            <li><Link to="/admin/exercises">Exercises</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
            <li><Link to="/admin/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="main-content">
        <header className="admin-header">
          <h1>Admin Panel</h1>
        </header>
        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
