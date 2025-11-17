import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      
      // DEBUG: Log the entire response to see what you're getting
      console.log('Full users data:', data);
      
      // Enhanced safety check with multiple fallbacks
      let usersData = [];
      
      if (Array.isArray(data)) {
        usersData = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.users)) {
          usersData = data.users;
        } else if (Array.isArray(data.data)) {
          usersData = data.data;
        } else {
          console.warn('Data is an object but does not contain an array of users:', data);
        }
      } else {
        console.warn('Data is not an array or object:', data);
      }
      
      // DEBUG: Log what you're setting as the state
      console.log('Setting users to:', usersData);
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
      // Set empty array on error to prevent crashes
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      // Enhanced safety check before mapping
      setUsers(prevUsers => {
        if (!Array.isArray(prevUsers)) {
          console.warn('prevUsers is not an array in toggleUserStatus:', prevUsers);
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
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
  };

  // Enhanced safety check for filtering users
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('Invalid user object in users array:', user);
          return false;
        }
        
        return (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : [];

  // Enhanced safety check for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers) 
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) 
    : [];
  const totalPages = Math.ceil((Array.isArray(filteredUsers) ? filteredUsers.length : 0) / usersPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

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
            setCurrentPage(1); // Reset to first page when searching
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
            {/* Enhanced safety check before mapping */}
            {Array.isArray(currentUsers) && currentUsers.map(user => {
              // Ensure user is an object before trying to access its properties
              if (!user || typeof user !== 'object') {
                console.warn('Invalid user object in currentUsers:', user);
                return null;
              }
              
              return (
                <tr key={user._id || user.id || Math.random().toString(36).substr(2, 9)}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {/* Enhanced safety check for user name */}
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
                    {/* Enhanced safety check for date */}
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

        {/* Enhanced empty state */}
        {(!currentUsers || !Array.isArray(currentUsers) || currentUsers.length === 0) && (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Enhanced pagination */}
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
};

export default ManageUsers;