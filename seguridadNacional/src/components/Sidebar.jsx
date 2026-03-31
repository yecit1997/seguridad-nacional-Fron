import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/home', label: 'Reportes', icon: '📋' },
        { path: '/personas', label: 'Personas', icon: '👤' },
        { path: '/usuarios', label: 'Usuarios', icon: '👥' },
        { path: '/vehiculos', label: 'Vehículos', icon: '🚗' },
        { path: '/conductores', label: 'Conductores', icon: '🚌' },
        { path: '/supervisores', label: 'Supervisores', icon: '👨‍💼' },
        { path: '/guardas', label: 'Guardas', icon: '👮' },
        { path: '/personal', label: 'Personal', icon: '💼' },
        { path: '/alertas', label: 'Alertas', icon: '🔔' },
        { path: '/admin', label: 'Administración', icon: '🛠️' },
    ];

    const adminItems = [
        // { path: '/supervisores', label: 'Supervisores', icon: '👨‍💼' },
        // { path: '/guardas', label: 'Guardas', icon: '👮' },
        // { path: '/personal', label: 'Personal', icon: '💼' },
        // { path: '/alertas', label: 'Alertas', icon: '🔔' },
        // { path: '/admin', label: 'Administración', icon: '🛠️' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-sky-800 text-white shadow-lg flex flex-col">
            <div className="p-4 border-b border-sky-700">
                <div className="flex items-center gap-3">
                    <img
                        src="./src/assets/logo.png"
                        alt="Logo"
                        className="w-10 h-10 object-contain bg-white rounded-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                        <h2 className="text-sm font-bold tracking-wide text-slate-100">
                            Seguridad
                        </h2>
                        <p className="text-xs text-sky-300">Nacional</p>
                    </div>
                </div>
            </div>

            <nav className="sidebar-menu flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm ${location.pathname === item.path
                                        ? 'bg-sky-700 text-white'
                                        : 'text-sky-200 hover:bg-sky-700 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* <div className="mt-6 mb-2 px-3">
                    <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                        Administración...
                    </span>
                </div> */}
                <ul className="space-y-1">
                    {adminItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm ${location.pathname === item.path
                                        ? 'bg-sky-700 text-white'
                                        : 'text-sky-200 hover:bg-sky-700 hover:text-white'
                                    }`}
                            >
                                <span className="mr-3 text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3 border-t border-sky-700 bg-sky-900">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;