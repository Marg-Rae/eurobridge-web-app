import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/axios.js";
import Loading from "./Loading.jsx";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, students: 0, staff: 0, admins: 0 });
  const [showUserForm, setShowUserForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/users");
      setUsers(response.data.users || []);
      
      // Calculate stats
      const totalUsers = response.data.users?.length || 0;
      const students = response.data.users?.filter(u => u.role === "student").length || 0;
      const staff = response.data.users?.filter(u => u.role === "staff").length || 0;
      const admins = response.data.users?.filter(u => u.role === "admin").length || 0;
      
      setStats({ totalUsers, students, staff, admins });
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. You may not have admin permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/admin/users", {
        ...formData,
        userType: formData.role
      });
      setUsers([...users, response.data.user]);
      setFormData({ name: "", email: "", password: "", role: "student" });
      setShowUserForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await api.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? response.data.user : u));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  if (loading) return <Loading label="Loading admin dashboard..." />;

  return (
    <section className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p className="dashboard-subtitle">Admin Dashboard</p>
        </div>
        <div className="header-buttons">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Students</h3>
            <p className="stat-number">{stats.students}</p>
          </div>
          <div className="stat-card">
            <h3>Staff</h3>
            <p className="stat-number">{stats.staff}</p>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <p className="stat-number">{stats.admins}</p>
          </div>
        </div>

        {/* User Management */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>User Management</h2>
            <button
              onClick={() => setShowUserForm(!showUserForm)}
              className="btn-create"
            >
              {showUserForm ? "Cancel" : "+ Create User"}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleCreateUser} className="user-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Create User
              </button>
            </form>
          )}

          {/* Users Table */}
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          className={`role-select role-${u.role}`}
                        >
                          <option value="student">Student</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
