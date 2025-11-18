// src/components/Auth/Register.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    // User fields
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user', // Default role
    
    // Institute fields - will be sent if role is 'institute'
    instituteName: '',
    category: '',
    affiliation: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    website: '',
    description: '',
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      // We will send the entire formData object.
      // The backend will pick what it needs.
      await register(formData);
      setAlert({ type: 'success', message: 'Registration successful! Please login.' });
      setTimeout(() => navigate('/login'), 2000);
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
          
          {/* --- CONDITIONAL INSTITUTE FIELDS --- */}
          {formData.role === 'institute' && (
            <>
              <h3 className="section-title">Institute Details</h3>
              
              <div className="form-group">
                <label htmlFor="instituteName">Institute Name</label>
                <input
                  type="text"
                  id="instituteName"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="Coaching Center">Coaching Center</option>
                  <option value="Preschool">Preschool</option>
                  <option value="Vocational Training">Vocational Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="affiliation">Affiliation</label>
                <input
                  type="text"
                  id="affiliation"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={onChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={onChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="4"
                ></textarea>
              </div>
            </>
          )}
          
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