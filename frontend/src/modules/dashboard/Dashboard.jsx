import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../../services/authService';

const Dashboard = () => {
    const user = authService.getCurrentUser();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalProducts: 0,
        totalClients: 0,
        lowStockProducts: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/dashboard/stats', config);
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    };

    if (loading) return <div className="p-8">Cargando tablero...</div>;

    return (
        <div className="animate-fadeIn p-2">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Tablero de <span className="text-blue-600">Control</span> 🚀
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        Bienvenido de nuevo, {user?.username}. Aquí está el pulso de tu ferretería hoy.
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString()}</span>
                </div>
            </header>

            {/* Metas/KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ventas Totales</p>
                    <p className="text-2xl font-black text-slate-800">{formatCurrency(stats.totalSales)}</p>
                    <div className="mt-4 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded inline-block">Histórico acumulado</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-purple-600">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Productos</p>
                    <p className="text-2xl font-black text-slate-800">{stats.totalProducts}</p>
                    <div className="mt-4 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded inline-block">En inventario</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-cyan-600">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Clientes</p>
                    <p className="text-2xl font-black text-slate-800">{stats.totalClients}</p>
                    <div className="mt-4 text-xs text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded inline-block">Cartera activa</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-red-600">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Alertas Stock</p>
                    <p className="text-2xl font-black text-red-600">{stats.lowStockProducts}</p>
                    <div className="mt-4 text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded inline-block">Requiere atención</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Últimas Ventas */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Ventas Recientes</h2>
                        <button className="text-blue-600 text-sm font-bold hover:underline">Ver todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Factura</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.recentSales.map((sale, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">{sale.invoice}</td>
                                        <td className="px-6 py-4 text-slate-600">{sale.client}</td>
                                        <td className="px-6 py-4 font-black text-slate-800">{formatCurrency(sale.total)}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(sale.date).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {stats.recentSales.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No hay ventas registradas todavía.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Accesos Rápidos o Sugerencias */}
                <div className="space-y-6">
                    <div className="bg-slate-800 rounded-2xl p-8 text-white shadow-xl">
                        <h3 className="text-xl font-black mb-4">¿Necesitas ayuda?</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Hemos actualizado el manual de usuario para el cierre de caja y gestión de proveedores.
                        </p>
                        <button className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            VER MANUAL ERP
                        </button>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-8 text-blue-900 border border-blue-100">
                        <h3 className="text-lg font-black mb-2">Tip del día</h3>
                        <p className="text-sm opacity-80">
                            Revisa el stock mínimo una vez por semana para evitar quiebres de inventario en temporada alta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
