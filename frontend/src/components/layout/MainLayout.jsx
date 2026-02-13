import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../../services/authService';

const MainLayout = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Fijo */}
            <Sidebar />

            {/* Contenido Principal */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Header / Top bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Sistema ERP</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-800 capitalize">
                            {window.location.pathname.replace('/', '') || 'Dashboard'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user?.username || 'Usuario'}</p>
                            <p className="text-xs text-blue-600 font-medium uppercase">{user?.role || 'Invitado'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition-colors group"
                            title="Cerrar Sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Renderizado de las vistas (Vistas Hijas) */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
