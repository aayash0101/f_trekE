import React, { useState } from 'react';
import { signup } from '../api/authapi';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/SignupForm.css';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',          // add email here to match backend
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData);
      console.log('Signup success:', res.data);
      navigate('/login'); // redirect to login after signup
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert('Signup failed. Please check your data.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>

      <p className="redirect">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default SignupForm;
