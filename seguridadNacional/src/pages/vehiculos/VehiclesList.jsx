import React, { useEffect, useState } from 'react';
import { getVehiculos } from '../../services/vehiculos.service';

const VehiclesList = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const data = await getVehiculos();
        // Manejamos si la API devuelve el array directamente o dentro de una propiedad data
        setVehiculos(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error("Error al cargar vehículos:", err);
        setError(err.message || "No fue posible cargar la lista de vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  if (loading) return <div className="p-6 text-center text-sky-700 font-semibold">Cargando vehículos...</div>;
  if (error) return <div className="p-6 text-red-600 font-bold text-center">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-sky-800">Vehículos en Sistema</h1>
        </div>
        {console.log("Vehículos cargados:", vehiculos)}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-700 text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Placa</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Conductor</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Licencia</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 italic">No hay vehículos registrados en la base de datos.</td>
                </tr>
              ) : (
                vehiculos.map((v, index) => (
                  <tr key={v.id_vehiculo || v.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{v.id_vehiculo}</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono font-bold text-sky-700 uppercase">{v.placa}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{v.conductor.persona.nombre  || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{v.conductor.licencia  || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.status === 'inactivo' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {v.status || 'Activo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehiclesList;