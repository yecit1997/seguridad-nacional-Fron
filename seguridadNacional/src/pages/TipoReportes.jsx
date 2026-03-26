import React, { useEffect, useState } from 'react';
import { getTipos } from '../services/tipoReporte.service';

const TipoReportes = () => {
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await getTipos();
        // Ajustar según la estructura: { success, data } o directamente array
        const items = Array.isArray(response) ? response : response.data || [];
        setTipos(items);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'No fue posible cargar los tipos');
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Cargando tipos de reportes...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Tipos de Reporte</h1>
            <p className="text-gray-600">Estos tipos se cargan desde la base de datos.</p>
          </div>
          <button
            onClick={() => setMostrarCrear(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            + Crear tipo de reporte
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tipos.map((tipo) => (
                <tr key={tipo.id || tipo.id_tipo_reporte || tipo.id_tipo} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{tipo.id || tipo.id_tipo_reporte || '-'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{tipo.nombre || tipo.tipo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tipo.descripcion || tipo.descripcion_corta || 'Sin descripción'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Crear tipo de reporte</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const nuevo = {
                  ...nuevoTipo,
                  id: tipos.length + 1,
                };
                setTipos([nuevo, ...tipos]);
                setNuevoTipo({ nombre: '', descripcion: '' });
                setMostrarCrear(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre</label>
                <input
                  value={nuevoTipo.nombre}
                  onChange={(e) => setNuevoTipo({ ...nuevoTipo, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ej: Horario de Personal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  value={nuevoTipo.descripcion}
                  onChange={(e) => setNuevoTipo({ ...nuevoTipo, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Descripción del tipo de reporte"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarCrear(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoReportes;
