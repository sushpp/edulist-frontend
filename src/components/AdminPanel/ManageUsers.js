import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []); // The empty dependency array ensures this runs only once on mount

  const fetchUsers = async () => {
    try {
      // The adminService is designed to always return an array (either data or [])
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // As a final safeguard, ensure the state is an array on any unexpected error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    // Optimistically update the UI first for a better user experience
    const originalUsers = [...users];
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      )
    );

    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      // Revert the state if the API call fails
      setUsers(originalUsers);
      alert('Error updating user status. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="manage-users">
      <div className="page-header">
        <h2>Manage Users</h2>
        <p>Total Users: {users.length}</p>
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
            {users.map(user => (
              <tr key={user._id}>
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
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;