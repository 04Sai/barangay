import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AdminUserManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'staff',
        permissions: ['basic']
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const roleOptions = [
        { value: 'admin', label: 'Admin', permissions: ['user_management', 'announcements', 'hotlines', 'incident_reports', 'appointments', 'residents'] },
        { value: 'staff', label: 'Staff', permissions: ['announcements', 'hotlines', 'incident_reports', 'appointments'] },
        { value: 'moderator', label: 'Moderator', permissions: ['announcements', 'incident_reports'] }
    ];

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.ADMIN.ADMINS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(response.data);
        } catch (error) {
            setError('Failed to fetch admins');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Admin created successfully');
            setShowCreateForm(false);
            setFormData({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                role: 'staff',
                permissions: ['basic']
            });
            fetchAdmins();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (role) => {
        const selectedRole = roleOptions.find(r => r.value === role);
        setFormData({
            ...formData,
            role,
            permissions: selectedRole ? selectedRole.permissions : ['basic']
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Admin User Management</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Create New Admin
                </button>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {/* Create Admin Form */}
            {showCreateForm && (
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Create New Admin</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="bg-gray-700 text-white p-2 rounded"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-gray-700 text-white p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="bg-gray-700 text-white p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="bg-gray-700 text-white p-2 rounded"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-gray-700 text-white p-2 rounded"
                                required
                            />
                            <select
                                value={formData.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="bg-gray-700 text-white p-2 rounded"
                            >
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Admin'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admins List */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-white">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin._id} className="border-b border-gray-700">
                                <td className="p-3">{admin.username}</td>
                                <td className="p-3">{admin.firstName} {admin.lastName}</td>
                                <td className="p-3">{admin.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${admin.role === 'super_admin' ? 'bg-red-600' :
                                            admin.role === 'admin' ? 'bg-blue-600' :
                                                admin.role === 'staff' ? 'bg-green-600' : 'bg-yellow-600'
                                        }`}>
                                        {admin.role.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${admin.isActive ? 'bg-green-600' : 'bg-red-600'
                                        }`}>
                                        {admin.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-3">{new Date(admin.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
