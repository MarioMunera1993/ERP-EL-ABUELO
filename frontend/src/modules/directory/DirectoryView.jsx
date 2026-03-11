import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import directoryService from '../../services/directoryService';
import { useNotification } from '../../context/NotificationContext';

const DirectoryView = () => {
    const location = useLocation();
    const [clients, setClients] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [view, setView] = useState('clients'); // 'clients' or 'suppliers'
    const [formData, setFormData] = useState({ taxId: '', fullName: '', companyName: '', contactName: '', email: '', phone: '', address: '', documentType: 'CC' });
    const [editingId, setEditingId] = useState(null);
    const { notify } = useNotification();

    const loadData = async () => {
        try {
            const [clientsRes, suppliersRes] = await Promise.all([
                directoryService.getClients(),
                directoryService.getSuppliers()
            ]);
            setClients(clientsRes);
            setSuppliers(suppliersRes);
        } catch (error) {
            console.error("Error cargando directorio:", error);
        }
    };

    useEffect(() => {
        // Sincronizar vista con la URL
        if (location.pathname === '/suppliers') {
            setView('suppliers');
        } else {
            setView('clients');
        }
        loadData();
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (view === 'clients') {
                if (editingId) await directoryService.updateClient(editingId, formData);
                else await directoryService.createClient(formData);
            } else {
                if (editingId) await directoryService.updateSupplier(editingId, formData);
                else await directoryService.createSupplier(formData);
            }
            notify(view === 'clients' ? "¡Cliente guardado con éxito!" : "¡Proveedor guardado con éxito!", "success");
            setFormData({ taxId: '', fullName: '', companyName: '', contactName: '', email: '', phone: '', address: '', documentType: 'CC' });
            setEditingId(null);
            loadData();
        } catch (error) {
            notify("Error al guardar: " + (error.response?.data || error.message), "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este registro?")) return;
        try {
            if (view === 'clients') await directoryService.deleteClient(id);
            else await directoryService.deleteSupplier(id);
            notify("¡Registro eliminado con éxito!", "success");
            loadData();
        } catch (error) {
            notify("No tienes permisos para eliminar.", "error");
        }
    };

    return (
        <div className="p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">
                        {view === 'clients' ? 'Directorio de Clientes' : 'Directorio de Proveedores'}
                    </h1>
                    <p className="text-gray-500 font-medium">
                        {view === 'clients' ? 'Gestiona la base de datos de tus clientes.' : 'Gestiona tus aliados y proveedores comerciales.'}
                    </p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tipo de Doc.</label>
                    <select
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={formData.documentType} onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="NIT">NIT</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="PP">Pasaporte</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Número / NIT</label>
                    <input
                        type="text" placeholder={formData.documentType === 'NIT' ? "900.000.000-1" : "12345678..."} required
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">{view === 'clients' ? "Nombre Completo" : "Nombre de la Empresa"}</label>
                    <input
                        type="text" placeholder="..." required
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={view === 'clients' ? formData.fullName : formData.companyName}
                        onChange={(e) => view === 'clients' ? setFormData({ ...formData, fullName: e.target.value }) : setFormData({ ...formData, companyName: e.target.value })}
                    />
                </div>

                {view === 'suppliers' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Persona de Contacto</label>
                        <input
                            type="text" placeholder="Ej: Juan Perez"
                            className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                    </div>
                )}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Correo</label>
                    <input
                        type="email" placeholder="example@mail.com"
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                    <input
                        type="text" placeholder="300 000 0000"
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Dirección</label>
                    <input
                        type="text" placeholder="Cll 123..."
                        className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>
                <div className="flex items-end gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white font-bold rounded-xl py-3 hover:bg-blue-700 transition-colors">
                        {editingId ? 'Actualizar' : 'Registrar'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ taxId: '', fullName: '', companyName: '', contactName: '', email: '', phone: '', address: '', documentType: 'CC' }) }} className="bg-gray-100 p-3 rounded-xl text-gray-500 font-bold">
                            X
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-4 font-bold text-gray-600">ID / NIT</th>
                            <th className="p-4 font-bold text-gray-600">Nombre / Razón Social</th>
                            <th className="p-4 font-bold text-gray-600">Información de Contacto</th>
                            <th className="p-4 font-bold text-gray-600 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(view === 'clients' ? clients : suppliers).map(item => (
                            <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <span className="text-xs font-bold text-gray-400 block uppercase">{item.documentType || (view === 'suppliers' ? 'NIT' : 'Doc')}</span>
                                    <span className="font-medium text-blue-600">{item.taxId}</span>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{view === 'clients' ? item.fullName : item.companyName}</div>
                                    {view === 'suppliers' && item.contactName && (
                                        <div className="text-xs text-gray-400 font-medium">Contacto: {item.contactName}</div>
                                    )}
                                </td>
                                <td className="p-4 text-gray-500">
                                    <div className="text-sm font-semibold">{item.phone}</div>
                                    <div className="text-xs uppercase">{item.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2 text-xl justify-center">
                                        <button onClick={() => { setEditingId(item.id); setFormData(item); }} className="text-gray-400 hover:text-blue-500">📝</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(view === 'clients' ? clients : suppliers).length === 0 && (
                    <div className="p-10 text-center text-gray-400 italic">No hay registros en esta categoría.</div>
                )}
            </div>
        </div >
    );
};

export default DirectoryView;
