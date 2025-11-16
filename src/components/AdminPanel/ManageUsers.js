import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      // Ensure array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      setUsers(prev =>
        Array.isArray(prev)
          ? prev.map(u => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
          : []
      );
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Error updating user status');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <p>Total Users: {Array.isArray(users) ? users.length : 0}</p>

      {!Array.isArray(users) || users.length === 0 ? (
        <p>No users found</p>
      ) : (
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
              <tr key={user._id || user.id}>
                <td>{user.name || 'Unknown User'}</td>
                <td>{user.email || 'No email'}</td>
                <td>{user.phone || 'No phone'}</td>
                <td>{user.role || 'user'}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</td>
                <td>
                  <button onClick={() => toggleUserStatus(user._id, user.isActive)}>
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
