import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReportes } from "../services/api.service";
import DataTable from "./DataTable";

const TableReport = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getStatusColor = (statusNombre) => {
    const statusMap = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En revisión': 'bg-blue-100 text-blue-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'Rechazado': 'bg-red-100 text-red-800',
      'Completado': 'bg-purple-100 text-purple-800',
    };
    return statusMap[statusNombre] || 'bg-gray-100 text-gray-800';
  };

  const getTipoColor = (tipoNombre) => {
    const tipoMap = {
      'Entrada/Salida Personal': 'bg-blue-100 text-blue-800',
      'Entrada/Salida Vehículos': 'bg-green-100 text-green-800',
      'Incidentes/Accidentes': 'bg-red-100 text-red-800',
    };
    return tipoMap[tipoNombre] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        const dataArr = await getReportes();
        setReportes(Array.isArray(dataArr) ? dataArr : []);
        setError(null);
      } catch (err) {
        console.error("Error al obtener reportes", err);
        setError(err.message || "Error al cargar reportes");
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [navigate]);

  const columns = [
    { 
      key: 'id_reporte_vehiculo', 
      label: 'ID',
      render: (value, item) => (
        <span className="font-mono text-sm">
          #{value || item.id_reporte_personal || 'N/A'}
        </span>
      )
    },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (_, item) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTipoColor(item.tipo?.nombre)}`}>
          {item.tipo?.nombre || 'N/A'}
        </span>
      )
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      render: (value) => (
        <span className="text-sm text-gray-600 line-clamp-2" title={value}>
          {value || 'Sin descripción'}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (_, item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status?.nombre)}`}>
          {item.status?.nombre || 'Sin estado'}
        </span>
      )
    },
    { 
      key: 'generador', 
      label: 'Usuario',
      render: (_, item) => (
        <span className="text-sm text-gray-700">
          {item.generador?.nombre_usuario || item.generador?.nombre || 'N/A'}
        </span>
      )
    },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleString('es-ES') : 'N/A'}
        </span>
      )
    },
  ];

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold">Error al cargar reportes</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📋 Reportes Recientes</h1>
        <span className="text-sm text-gray-500">
          Total: {reportes.length} reportes
        </span>
      </div>
      
      <DataTable
        columns={columns}
        data={reportes}
        loading={loading}
        searchPlaceholder="Buscar reportes..."
        actions={false}
      />
    </div>
  );
};

export default TableReport;
