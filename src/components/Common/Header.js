import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Common.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>EduList</span>
          </Link>
          
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/institutes">Institutes</Link></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">
                  {user?.name}
                  {user?.role === 'admin' && <span className="user-role"> (Admin)</span>}
                  {user?.role === 'institute' && <span className="user-role"> (Institute)</span>}
                </span>
                <button className="btn btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-sm">Login</Link>
                <Link to="/register" className="btn btn-sm btn-secondary">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;