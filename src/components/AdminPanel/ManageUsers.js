import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // DEBUG: Log the state whenever it changes
  useEffect(() => {
    console.log('ManageUsers state changed:', { users, loading, error });
  }, [users, loading, error]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      
      // CRITICAL DEBUG: Log the raw data from the service
      console.log('Raw data received from adminService.getAllUsers():', data);
      console.log('Type of raw data:', typeof data);
      console.log('Is raw data an array?', Array.isArray(data));

      // The service should already ensure this is an array, but we check again
      const usersData = Array.isArray(data) ? data : [];
      
      // CRITICAL DEBUG: Log what we're about to set as state
      console.log('Setting users state to:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setError('Failed to fetch users. Please try again later.');
      setUsers([]); // Always set to an array
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      setUsers(prevUsers => {
        // CRITICAL DEBUG: Log the previous users state
        console.log('Previous users in toggleUserStatus:', prevUsers);
        console.log('Is previous users an array?', Array.isArray(prevUsers));
        
        if (!Array.isArray(prevUsers)) {
          console.error('prevUsers was not an array in toggleUserStatus! Resetting to empty array.');
          return [];
        }
        
        return prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        );
      });
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error in toggleUserStatus:', error);
      alert('Error updating user status');
    }
  };

  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('Invalid user object in users array during filter:', user);
          return false;
        }
        return (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers) ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) : [];
  const totalPages = Math.ceil((Array.isArray(filteredUsers) ? filteredUsers.length : 0) / usersPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  // CRITICAL DEBUG: Add a try-catch around the entire render
  try {
    return (
      <div className="manage-users">
        <div className="page-header">
          <h2>Manage Users</h2>
          <p>Total Users: {Array.isArray(users) ? users.length : 0}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchUsers} className="btn btn-primary">Retry</button>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* CRITICAL DEBUG: Log the array right before mapping */}
              {(() => {
                console.log('About to map currentUsers. Is it an array?', Array.isArray(currentUsers));
                console.log('currentUsers value:', currentUsers);
                return null; // This is just for logging
              })()}
              
              {Array.isArray(currentUsers) && currentUsers.map(user => {
                // CRITICAL DEBUG: Log each user inside the map
                if (!user || typeof user !== 'object') {
                  console.error('Invalid user object during map:', user);
                  return null; // Don't render anything for invalid objects
                }
                
                return (
                  <tr key={user._id || user.id || `user-${Math.random().toString(36).substr(2, 9)}`}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {user.name || 'Unknown User'}
                      </div>
                    </td>
                    <td>{user.email || 'No email'}</td>
                    <td>{user.phone || 'No phone'}</td>
                    <td>
                      <span className={`role-badge ${user.role || 'user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown date'}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!currentUsers || !Array.isArray(currentUsers) || currentUsers.length === 0) && (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  } catch (renderError) {
    // This is the last resort. If the render itself fails, we catch it here.
    console.error('CRITICAL: ManageUsers render failed with error:', renderError);
    console.error('State at time of crash:', { users, loading, error, searchTerm, currentPage });
    return (
      <div className="error-message">
        <h3>A critical rendering error occurred.</h3>
        <p>Please check the browser console for details and refresh the page.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Refresh Page</button>
      </div>
    );
  }
};

export default ManageUsers;