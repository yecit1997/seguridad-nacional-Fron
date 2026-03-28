import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTipos } from '../../services/tipoReporte.service';

function Reportes() {
  const navigate = useNavigate();
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeo de tipos a iconos y colores según nombre
  const getTypeConfig = (nombreTipo) => {
    const lower = nombreTipo?.toLowerCase() || '';
    if (lower.includes('personal'))
      return { icon: '👥', color: 'from-blue-500 to-blue-600', path: '/reportes/personal' };
    if (lower.includes('vehiculo'))
      return { icon: '🚗', color: 'from-green-500 to-green-600', path: '/reportes/vehiculos' };
    if (lower.includes('incidente') || lower.includes('accidente'))
      return { icon: '⚠️', color: 'from-red-500 to-red-600', path: '/reportes/incidentes' };
    return { icon: '📋', color: 'from-purple-500 to-purple-600', path: '/reportes/personal' };
  };

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await getTipos();
        const items = Array.isArray(response) ? response : response.data || [];
        const tiposConConfig = items.map((tipo) => {
          const config = getTypeConfig(tipo.nombre);
          return {
            id: tipo.id || tipo.id_tipo_reporte,
            title: tipo.nombre,
            description: tipo.descripcion || 'Crea y gestiona reportes',
            ...config,
          };
        });
        setTipos(tiposConConfig);
      } catch (error) {
        console.error('Error al cargar tipos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Reportes</h1>
          <p className="text-gray-600 text-lg">Selecciona el tipo de reporte que deseas crear</p>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Cargando tipos de reportes...</p>
        ) : tipos.length === 0 ? (
          <p className="text-gray-600 text-center">No hay tipos de reportes disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {tipos.map((report) => (
              <div
                key={report.id}
                className="group cursor-pointer"
                onClick={() => navigate(`${report.path}?tipo=${encodeURIComponent(report.title)}`)}
              >
                <div
                  className={`bg-gradient-to-br ${report.color} rounded-xl shadow-lg p-5 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative`}
                  style={{ minHeight: '140px' }}
                >
                  {/* Fondo decorativo */}
                  <div className="absolute top-0 right-0 opacity-10 w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Icono en la parte superior */}
                    <div className="mb-2">
                      <div className="text-4xl mb-2">{report.icon}</div>
                      <h2 className="text-lg font-bold leading-tight truncate">{report.title}</h2>
                    </div>

                    {/* Descripción y botón en la parte inferior */}
                    <div className="space-y-2">
                      <p className="text-white text-opacity-90 text-xs line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <button className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors shadow-md">
                          Acceder
                        </button>
                        <div className="bg-white bg-opacity-20 rounded-full p-1 group-hover:bg-opacity-30 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
