import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Administración de Reportes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/tipos-reportes"
            className="block rounded-lg border border-blue-200 bg-blue-600 text-white p-4 shadow hover:bg-blue-700 transition"
          >
            <h2 className="text-xl font-bold">Tipos de reporte</h2>
            <p className="mt-2 text-blue-100">Agrega y administra tipos como personal, vehículos, incidentes, etc.</p>
          </Link>

          <Link
            to="/admin/status-reportes"
            className="block rounded-lg border border-green-200 bg-green-600 text-white p-4 shadow hover:bg-green-700 transition"
          >
            <h2 className="text-xl font-bold">Statuses de reporte</h2>
            <p className="mt-2 text-green-100">Agrega estados como activo, completado, creado, devuelto, etc.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
