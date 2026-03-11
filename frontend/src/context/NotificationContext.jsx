import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {notifications.map((n) => (
                    <Toast key={n.id} message={n.message} type={n.type} onDismiss={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const Toast = ({ message, type, onDismiss }) => {
    const config = {
        success: {
            bg: 'bg-emerald-500',
            icon: '✅',
            shadow: 'shadow-emerald-200',
            label: 'Éxito'
        },
        error: {
            bg: 'bg-rose-500',
            icon: '❌',
            shadow: 'shadow-rose-200',
            label: 'Error'
        },
        info: {
            bg: 'bg-sky-500',
            icon: 'ℹ️',
            shadow: 'shadow-sky-200',
            label: 'Info'
        }
    };

    const current = config[type] || config.info;

    return (
        <div 
            className={`${current.bg} text-white px-6 py-4 rounded-2xl ${current.shadow} shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full fade-in duration-500 pointer-events-auto cursor-pointer border border-white/20 backdrop-blur-sm group hover:scale-[1.02] transition-all`}
            onClick={onDismiss}
        >
            <div className="bg-white/20 p-2 rounded-xl text-xl backdrop-blur-md">
                {current.icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">{current.label}</span>
                <span className="font-bold text-sm tracking-tight">{message}</span>
            </div>
            <button className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white p-1">
                ✕
            </button>
        </div>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
    }
    return context;
};
