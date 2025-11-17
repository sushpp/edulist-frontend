import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';
import './AdminPanel.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Manage Users</h1>
          <div className="table-actions">
            <span>{users.length} total users</span>
          </div>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Users</h2>
          </div>
          
          {users.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'Not provided'}</td>
                    <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No users found</h3>
              <p>No users have registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;