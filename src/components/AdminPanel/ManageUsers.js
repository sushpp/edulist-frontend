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
      // Ensure users is always an array with multiple fallbacks
      const usersData = Array.isArray(data) ? data : 
                       data?.users ? data.users : 
                       data?.data ? data.data : [];
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
      // Added array safety check before mapping
      setUsers(prevUsers => 
        Array.isArray(prevUsers) 
          ? prevUsers.map(user => 
              user._id === userId 
                ? { ...user, isActive: !currentStatus }
                : user
            )
          : []
      );
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
  };

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
            {/* Added array safety check before mapping */}
            {Array.isArray(currentUsers) && currentUsers.map(user => (
              <tr key={user._id || user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {/* Added safety check for user name */}
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
                  {/* Added safety check for date */}
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
            ))}
          </tbody>
        </table>

        {/* Added empty state */}
        {(!currentUsers || !Array.isArray(currentUsers) || currentUsers.length === 0) && (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
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