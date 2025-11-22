// src/components/Auth/Login.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await login(formData);
      setAlert({ type: 'success', message: 'Login successful!' });
      // navigation handled in effect after auth state updates
    } catch (err) {
      // err may be { message } or error response body
      const message = err?.message || err?.msg || err?.message || (err?.message ? err.message : 'Login failed');

      // If server returned 403 in response, the payload will be e.g. { message: 'Your account is pending' }
      if (err && err.message && /pending|pending approval|not approved/i.test(err.message)) {
        setAlert({ type: 'info', message: err.message });
      } else if (err && err.message && /Invalid credentials/i.test(err.message)) {
        setAlert({ type: 'danger', message: 'Invalid email or password' });
      } else {
        setAlert({ type: 'danger', message });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // navigate only when authenticated and user exists
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'institute') {
        navigate('/institute/dashboard');
      } else if (user.role === 'user') {
        navigate('/user/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login to EduList</h1>
          <p>Sign in to your account</p>
        </div>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={onChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={onChange} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
