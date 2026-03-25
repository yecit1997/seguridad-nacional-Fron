import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/home', label: 'Inicio', icon: '🏠' },
        { path: '/dashboard', label: 'Analisis', icon: '📊' },
        { path: '/users', label: 'Usuarios', icon: '👥' },
        { path: '/reportes', label: 'Reportes', icon: '📋' },
        { path: '#', label: 'Administración', icon: '🛠️' },
        { path: '/settings', label: 'Configuración', icon: '⚙️' },
        { path: '/contact', label: 'Contacto', icon: '📞' },
        { path: '/help', label: 'Ayuda', icon: '❓' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-sky-800 text-white shadow-lg">
            <div className="p-6">

                <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
                    <img
                        src="/src/assets/logo.png"
                        alt="Logo Seguridad Nacional"
                        className="w-10 h-10 object-contain shrink-0"
                    />
                    <h2 className="text-lg font-bold tracking-wide text-slate-100">
                        Seguridad Nacional
                    </h2>
                </div>

                {/* <img src="/src/assets/logo.png" alt="Logo" className="" style={{ width: '40px', height: '40px' }} />
        <h2 className="text-xl font-bold mb-8">Seguridad Nacional</h2> */}
                <nav className="sidebar-menu pr-2">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-sky-700 text-white'
                                            : 'text-sky-200 hover:bg-sky-700 hover:text-white'
                                        }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;