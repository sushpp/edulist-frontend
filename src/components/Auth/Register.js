// src/components/Auth/Register.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user', // Default role
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (formData.password !== formData.password2) {
      setAlert('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // We send the entire formData object. The backend will pick what it needs.
      const res = await register(formData);
      
      if (res.success) {
        setAlert({ type: 'success', message: 'Registration successful! Please login.' });
        
        // If role is 'institute', redirect to a new page to create their profile
        if (formData.role === 'institute') {
          setTimeout(() => {
            navigate('/institute/create-profile'); // Create this new route in App.js
          }, 1500);
        } else {
          // For 'user' or 'admin', redirect to login as before
          setTimeout(() => navigate('/login'), 1500);
        }
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Register with EduList</h1>
          <p>Create your account</p>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={onChange}
              required
            >
              <option value="user">User</option>
              <option value="institute">Institute</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;