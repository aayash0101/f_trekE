import React, { useState } from 'react';
import { login } from '../api/authapi';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/LoginForm.css'; 

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Hardcoded admin shortcut
    if (username === 'admin' && password === 'admin') {
      console.log('Admin login detected');
      navigate('/admindashboard');
      return;
    }

    try {
      const res = await login({ username, password });
      const { token, user } = res.data;

      // ✅ Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login success:', user);

      // Redirect to user dashboard or homepage
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p className="redirect">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </form>
  );
}

export default LoginForm;
