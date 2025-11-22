// src/components/Auth/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user', // user or institute (admin should be created manually)
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (formData.password !== formData.password2) {
      setAlert({ type: 'danger', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const res = await register(formData);

      if (res.pending) {
        setAlert({ type: 'info', message: res.message || 'Registration pending admin approval.' });
        // Keep user on register page; they must wait for admin approval
      } else if (res.token) {
        // Admin case (rare) — auto navigate by role
        setAlert({ type: 'success', message: 'Registration successful. Redirecting...' });
        const role = res.user?.role || formData.role;
        setTimeout(() => {
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'institute') navigate('/institute/dashboard');
          else navigate('/user/dashboard');
        }, 700);
      } else {
        setAlert({ type: 'success', message: 'Registration successful.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || err.msg || 'Registration failed' });
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

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select id="role" name="role" value={formData.role} onChange={onChange} required>
              <option value="user">User</option>
              <option value="institute">Institute</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={onChange} required minLength="6" />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input type="password" id="password2" name="password2" value={formData.password2} onChange={onChange} required minLength="6" />
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
