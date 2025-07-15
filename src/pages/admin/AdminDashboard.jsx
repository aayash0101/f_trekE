import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/AdminDashboard.css";
import Footer from "../../components/footer";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="nav-links">
          <Link to="/add">Add Trek</Link>
          <Link to="/trek">View Treks</Link>
          <Link to="/users">Manage Users</Link>
          <Link to="/admin/view-feedback">View Feedback</Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, Admin</h1>
        <p className="dashboard-welcome">
          Use the sidebar to manage treks, users, and feedback within the TrekEnhance platform.
        </p>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Add New Trek</h3>
            <p>Create a new trek listing for users to explore.</p>
            <Link to="/add" className="card-btn">Go</Link>
          </div>
          <div className="card">
            <h3>Manage Treks</h3>
            <p>View, edit or delete existing treks.</p>
            <Link to="/trek" className="card-btn">Go</Link>
          </div>
          <div className="card">
            <h3>User Management</h3>
            <p>View or delete registered users.</p>
            <Link to="/users" className="card-btn">Go</Link>
          </div>
          <div className="card">
            <h3>Feedback</h3>
            <p>Check reviews and feedback from trekkers.</p>
            <Link to="/admin/view-feedback" className="card-btn">Go</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
