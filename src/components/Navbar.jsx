import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css'; // 

export default function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  let username = null;
  if (storedUser && storedUser !== 'undefined') {
    try {
      username = JSON.parse(storedUser)?.username || null;
    } catch {
      username = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login'); // or your login route
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home" className="navbar-logo">TrekEnhance</Link>
      </div>

      <div className="navbar-links">
         <NavLink to="/journals" className={({ isActive }) => isActive ? 'active' : ''}>
          Journals
        </NavLink>
        <NavLink to="/trekker" className={({ isActive }) => isActive ? 'active' : ''}>
          Treks
        </NavLink>
        <NavLink to="/all-reviews" className={({ isActive }) => isActive ? 'active' : ''}>
          Reviews
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          Profile
        </NavLink>
      </div>

      <div className="navbar-user">
        {username ? (
          <>
            <span className="navbar-username">Hi, {username}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/signup" className="signup-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
