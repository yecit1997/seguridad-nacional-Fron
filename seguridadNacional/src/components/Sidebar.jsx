import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/home', label: 'Inicio', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Usuarios', icon: '👥' },
    { path: '/reports', label: 'Reportes', icon: '📋' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' },
    { path: '/logout', label: 'Cerrar Sesión', icon: '🚪' },
    { path: '/about', label: 'Acerca de', icon: 'ℹ️' },
    { path: '/contact', label: 'Contacto', icon: '📞' },
    { path: '/help', label: 'Ayuda', icon: '❓' },
    { path: '/privacy', label: 'Privacidad', icon: '🛡️' },
    { path: '/terms', label: 'Términos y Condiciones', icon: '📄' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sky-800 text-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Seguridad Nacional</h2>
        <nav className="sidebar-menu pr-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
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