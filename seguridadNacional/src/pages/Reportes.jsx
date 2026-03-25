import React from 'react';
import { useNavigate } from 'react-router-dom';

function Reportes() {
  const navigate = useNavigate();

  const reportTypes = [
    {
      id: 1,
      title: 'Ingreso y Salida de Personal',
      description: 'Registra entrada y salida de empleados',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      path: '/reportes/personal',
    },
    {
      id: 2,
      title: 'Ingreso y Salida de Vehículos',
      description: 'Controla acceso de vehículos',
      icon: '🚗',
      color: 'from-green-500 to-green-600',
      path: '/reportes/vehiculos',
    },
    {
      id: 3,
      title: 'Accidentes/Incidentes',
      description: 'Reporta accidentes e incidentes',
      icon: '⚠️',
      color: 'from-red-500 to-red-600',
      path: '/reportes/incidentes',
    },
    {
      id: 4,
      title: 'Aprobar Reportes',
      description: 'Revisa y aprueba reportes pendientes',
      icon: '✅',
      color: 'from-purple-500 to-purple-600',
      path: '/reportes/aprobacion',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gestión de Reportes</h1>
          <p className="text-gray-600">Selecciona el tipo de reporte que deseas crear o gestionar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="group cursor-pointer"
              onClick={() => navigate(report.path)}
            >
              <div className={`bg-gradient-to-br ${report.color} rounded-lg shadow-lg p-8 text-white transform transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{report.icon}</div>
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{report.title}</h2>
                <p className="text-white text-opacity-90 mb-6">{report.description}</p>
                <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Acceder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reportes;
