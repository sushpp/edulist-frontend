// src/components/Auth/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth(); // Get isAuthenticated and user from context
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      // We don't navigate here yet. We just wait for the context to update.
      await login(formData);
      setAlert({ type: 'success', message: 'Login successful!' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.msg || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  // This effect will run whenever `isAuthenticated` or `user` changes
  useEffect(() => {
    console.log('Login useEffect triggered. isAuthenticated:', isAuthenticated, 'user:', user);
    if (isAuthenticated && user) {
      console.log('User is authenticated, navigating...');
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'institute') {
        navigate('/institute/dashboard');
      } else if (user.role === 'user') {
        navigate('/user/dashboard');
      } else {
        navigate('/'); // Fallback
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
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          {/* ... form inputs remain the same ... */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
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
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
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