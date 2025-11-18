// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Using the new, simpler hook

// === IMPORT ALL YOUR COMPONENTS HERE ===
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserDashboard from './components/UserPanel/UserDashboard';
import UserReviews from './components/UserPanel/UserReviews';
import UserEnquiries from './components/UserPanel/UserEnquiries';
import InstituteList from './components/UserPanel/InstituteList';
import InstituteDetail from './components/UserPanel/InstituteDetail';
import ReviewForm from './components/UserPanel/ReviewForm';
import EnquiryForm from './components/UserPanel/EnquiryForm';
import InstituteDashboard from './components/InstituteDashboard/InstituteDashboard';
import ProfileManagement from './components/InstituteDashboard/ProfileManagement';
import Courses from './components/InstituteDashboard/Courses';
import Facilities from './components/InstituteDashboard/Facilities';
import InstituteEnquiries from './components/InstituteDashboard/Enquiries';
import InstituteReviews from './components/InstituteDashboard/Reviews';
import AdminDashboard from './components/AdminPanel/AdminDashboard';
import ManageInstitutes from './components/AdminPanel/ManageInstitutes';
import ManageUsers from './components/AdminPanel/ManageUsers';
import AnalyticsDashboard from './components/AdminPanel/AdminDashboard';
import CreateInstituteProfile from './components/InstituteDashboard/CreateInstituteProfile'; // Import the new component
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

import './App.css';

function App() {
  // Use the new, simpler hook
  const { isAuthenticated, user, loading } = useAuth();

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/institutes" element={<InstituteList />} />
          <Route path="/institutes/:id" element={<InstituteDetail />} />
          
          {/* User Routes - Protected */}
          {isAuthenticated && user?.role === 'user' && (
            <>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/reviews" element={<UserReviews />} />
              <Route path="/user/enquiries" element={<UserEnquiries />} />
              <Route path="/institutes/:id/review" element={<ReviewForm />} />
              <Route path="/institutes/:id/enquiry" element={<EnquiryForm />} />
            </>
          )}
          
          {/* Institute Routes - Protected */}
          {isAuthenticated && user?.role === 'institute' && (
            <>
              <Route path="/institute/dashboard" element={<InstituteDashboard />} />
              <Route path="/institute/profile" element={<ProfileManagement />} />
              <Route path="/institute/courses" element={<Courses />} />
              <Route path="/institute/facilities" element={<Facilities />} />
              <Route path="/institute/enquiries" element={<InstituteEnquiries />} />
              <Route path="/institute/reviews" element={<InstituteReviews />} />
              {/* --- ADD THIS NEW ROUTE --- */}
              <Route path="/institute/create-profile" element={<CreateInstituteProfile />} />
            </>
          )}
          
          {/* Admin Routes - Protected */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/institutes" element={<ManageInstitutes />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            </>
          )}
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;