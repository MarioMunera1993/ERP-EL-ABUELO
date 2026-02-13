import React, { useState } from 'react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.login(username, password);
            navigate('/dashboard');
            // Aquí luego redirigiremos al Dashboard
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-blue-600">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">ERP <span className="text-blue-600">El Abuelo</span></h1>
                    <p className="text-slate-500 mt-2">Bienvenido, ingresa tus credenciales</p>
                </div>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide">Usuario</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                        ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200 hover:shadow-blue-300'}`}
                    >
                        {loading ? 'Validando...' : 'INICIAR SESIÓN'}
                    </button>
                </form>
                <div className="mt-8 text-center text-slate-400 text-xs">
                    © 2026 ERP Profesional - Todos los derechos reservados
                </div>
            </div>
        </div>
    );
};
export default Login;