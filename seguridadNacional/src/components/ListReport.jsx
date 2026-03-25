import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReportes } from "../services/reporte.service";

const TableReport = () => {
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mapeo de status a colores
  const getStatusColor = (statusNombre) => {
    const statusMap = {
      'Activo': 'bg-green-100 text-green-800',
      'Completado': 'bg-blue-100 text-blue-800',
      'Creado': 'bg-yellow-100 text-yellow-800',
      'Devuelto': 'bg-red-100 text-red-800',
    };
    return statusMap[statusNombre] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const dataArr = await getReportes();
        setReportes(Array.isArray(dataArr) ? dataArr : []);
      } catch (error) {
        console.error("Error al obtener reportes", error);
        setError(error.response?.data?.message || error.message || "Error al cargar reportes");

        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchReportes();
  }, [navigate]);

  if (error) {
    return (
      <div className="text-red-600">
        <h2 className="text-xl font-semibold">No fue posible cargar los reportes</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      {reportes.length === 0 ? (
        <p className="text-gray-500">No hay reportes disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-700 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tipo de reporte</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Creado por</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r, index) => (
                <tr key={r.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{r.id_reporte}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{r.tipo.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{r.descripcion || 'Sin descripción'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(r.status.nombre)}`}>
                      {r.status.nombre || 'Sin status'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{r.generador.nombre_usuario}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableReport;


