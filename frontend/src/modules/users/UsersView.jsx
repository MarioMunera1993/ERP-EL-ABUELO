import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        roleId: '',
        isActive: true
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get('/api/users', config),
                axios.get('/api/users/roles', config)
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                role: { id: formData.roleId }
            };

            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, payload, config);
            } else {
                await axios.post('/api/users/register', payload, config);
            }
            setShowModal(false);
            setEditingUser(null);
            setFormData({ username: '', fullName: '', email: '', password: '', roleId: '', isActive: true });
            fetchData();
        } catch (error) {
            alert(error.response?.data || 'Error guardando usuario');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            password: '',
            roleId: user.role.id,
            isActive: user.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`/api/users/${id}`, config);
                fetchData();
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    if (loading) return <div className="p-6">Cargando...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
                <button
                    onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{u.username}</td>
                                <td className="px-6 py-4 text-slate-600">{u.fullName}</td>
                                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role.name === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            u.role.name === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {u.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`h-2.5 w-2.5 rounded-full inline-block mr-2 ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {u.isActive ? 'Activo' : 'Inactivo'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-6 text-slate-800">
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                    <input
                                        type="text" required
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text" required
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email" required
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {editingUser ? 'Password (dejar vacío para no cambiar)' : 'Password'}
                                </label>
                                <input
                                    type="password" required={!editingUser}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                                <select
                                    required
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.roleId}
                                    onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                                >
                                    <option value="">Seleccionar Rol</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label className="text-sm font-medium text-slate-700">Usuario Activo</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersView;
