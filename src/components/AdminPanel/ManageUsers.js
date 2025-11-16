import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      // FIX: Ensure users is always an array with multiple fallbacks
      const usersData = Array.isArray(data) ? data : 
                       data?.users ? data.users : 
                       data?.data ? data.data : [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // FIX: Set empty array on error to prevent crashes
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      // FIX: Added array safety check before mapping
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

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="manage-users">
      <div className="page-header">
        <h2>Manage Users</h2>
        <p>Total Users: {Array.isArray(users) ? users.length : 0}</p>
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
            {/* FIX: Added array safety check before mapping */}
            {Array.isArray(users) && users.map(user => (
              <tr key={user._id || user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {/* FIX: Added safety check for user name */}
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
                  {/* FIX: Added safety check for date */}
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

        {/* FIX: Added empty state */}
        {(!users || !Array.isArray(users) || users.length === 0) && (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;