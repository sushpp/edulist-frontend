import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserDashboard from './components/UserPanel/UserDashboard';
import InstituteDashboard from './components/InstituteDashboard/InstituteDashboard';
import AdminDashboard from './components/AdminPanel/AdminDashboard';
import InstituteList from './components/UserPanel/InstituteList';
import InstituteDetail from './components/UserPanel/InstituteDetail';
import ManageInstitutes from './components/AdminPanel/ManageInstitutes';
import ManageUsers from './components/AdminPanel/ManageUsers';
import AnalyticsDashboard from './components/AdminPanel/AnalyticsDashboard';
import './App.css';
import ErrorBoundary from './components/Common/ErrorBoundary';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AdminPanelWrapper = () => {
  return (
    <div className="admin-panel">
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="institutes/pending" element={<ManageInstitutes />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </div>
  );
};

const InstituteDashboardWrapper = () => {
  return (
    <div className="institute-dashboard-wrapper">
      <InstituteDashboard />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/institutes" element={<InstituteList />} />
                <Route path="/institute/:id" element={<InstituteDetail />} />
                
                {/* User Routes */}
                <Route path="/user/dashboard" element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Institute Routes */}
                <Route path="/institute/dashboard/*" element={
                  <ProtectedRoute allowedRoles={['institute']}>
                    <InstituteDashboardWrapper />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanelWrapper />
                  </ProtectedRoute>
                } />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;