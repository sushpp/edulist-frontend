import React, { useEffect } from 'react';
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

// Import the main axios instance
import api from './services/api';

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

// API Testing Component - Using direct Axios calls
const APITester = () => {
  useEffect(() => {
    const testEndpoints = async () => {
      console.log('🧪 Testing API endpoints with Axios...');
      console.log('🔗 Base URL:', api.defaults.baseURL);
      
      // Test 1: Health endpoint
      try {
        const healthResponse = await api.get('/health');
        console.log('✅ /health endpoint - SUCCESS:', healthResponse.data);
      } catch (error) {
        console.log('❌ /health endpoint - FAILED:', error.response?.status, error.message);
      }
      
      // Test 2: Public institutes endpoint
      try {
        const institutesResponse = await api.get('/institutes/public');
        console.log('✅ /institutes/public endpoint - SUCCESS:', institutesResponse.data);
        console.log('📦 Response format:', typeof institutesResponse.data);
        console.log('📦 Is Array?', Array.isArray(institutesResponse.data));
        
        if (institutesResponse.data && typeof institutesResponse.data === 'object') {
          console.log('📦 Object keys:', Object.keys(institutesResponse.data));
        }
      } catch (error) {
        console.log('❌ /institutes/public endpoint - FAILED:', error.response?.status, error.message);
      }
      
      // Test 3: All courses endpoint
      try {
        const coursesResponse = await api.get('/courses');
        console.log('✅ /courses endpoint - SUCCESS:', coursesResponse.data);
        console.log('📦 Response format:', typeof coursesResponse.data);
        console.log('📦 Is Array?', Array.isArray(coursesResponse.data));
        
        if (coursesResponse.data && typeof coursesResponse.data === 'object') {
          console.log('📦 Object keys:', Object.keys(coursesResponse.data));
        }
      } catch (error) {
        console.log('❌ /courses endpoint - FAILED:', error.response?.status, error.message);
      }
      
      // Test 4: Check if /courses/institute/{id} exists
      try {
        const instituteCoursesResponse = await api.get('/courses/institute/test-id-123');
        console.log('✅ /courses/institute/{id} endpoint - SUCCESS:', instituteCoursesResponse.data);
      } catch (error) {
        console.log('❌ /courses/institute/{id} endpoint - FAILED - Status:', error.response?.status, 'Message:', error.message);
      }
      
      // Test 5: Check if /courses/my exists (for institute dashboard)
      try {
        const myCoursesResponse = await api.get('/courses/my');
        console.log('✅ /courses/my endpoint - SUCCESS:', myCoursesResponse.data);
      } catch (error) {
        console.log('❌ /courses/my endpoint - FAILED - Status:', error.response?.status, 'Message:', error.message);
      }
      
      // Test 6: Check reviews endpoint
      try {
        const reviewsResponse = await api.get('/reviews');
        console.log('✅ /reviews endpoint - SUCCESS:', reviewsResponse.data);
      } catch (error) {
        console.log('❌ /reviews endpoint - FAILED:', error.response?.status, error.message);
      }
      
      // Test 7: Check enquiries endpoint
      try {
        const enquiriesResponse = await api.get('/enquiries');
        console.log('✅ /enquiries endpoint - SUCCESS:', enquiriesResponse.data);
      } catch (error) {
        console.log('❌ /enquiries endpoint - FAILED:', error.response?.status, error.message);
      }
      
      console.log('🧪 API testing completed! Check console for results.');
    };
    
    // Run tests after a short delay to ensure app is loaded
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        testEndpoints();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            {/* API Testing - Only runs in development */}
            {process.env.NODE_ENV === 'development' && <APITester />}
            
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