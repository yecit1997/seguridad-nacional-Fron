import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getReportes, getReportesByTipo, getTipos, getStatusReportes, updateReporteStatus, reporteService } from '../services/api.service';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button } from '../components/formComponents';
import { useToast } from '../components/Toast';

const ReportesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const tipoParam = searchParams.get('tipo');
  
  const [reportes, setReportes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState(tipoParam || '');
  
  // Modal para cambiar status
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  // Modal para eliminar
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Modal para ver detalle
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewReporte, setViewReporte] = useState(null);
  
  // Modal para editar
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposData, statusesData] = await Promise.all([
          getTipos(),
          getStatusReportes()
        ]);
        setTipos(Array.isArray(tiposData) ? tiposData : []);
        setStatuses(Array.isArray(statusesData) ? statusesData : []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tipoParam) {
      setSelectedTipo(tipoParam);
    }
  }, [tipoParam]);

  useEffect(() => {
    if (tipos.length > 0) {
      fetchReportes();
    }
  }, [selectedTipo, tipos]);

  useEffect(() => {
    fetchReportes();
  }, [selectedTipo]);

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
  };

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

  const handleChangeStatus = (reporte) => {
    setSelectedReporte(reporte);
    setStatusModalOpen(true);
  };

  const handleSubmitStatus = async () => {
    if (!selectedReporte || !newStatus) return;
    try {
      const reporteId = selectedReporte.id_reporte_vehiculo || selectedReporte.id_reporte_personal;
      await updateReporteStatus(reporteId, parseInt(newStatus));
      showSuccess('Estado actualizado correctamente');
      setStatusModalOpen(false);
      setSelectedReporte(null);
      setNewStatus('');
      // Recargar reportes
      fetchReportes();
    } catch (err) {
      showError('Error al actualizar estado');
    }
  };

  const handleDeleteClick = (reporte) => {
    setSelectedReporte(reporte);
    setDeleteModalOpen(true);
  };

  const handleViewClick = (reporte) => {
    setViewReporte(reporte);
    setViewModalOpen(true);
  };

  const handleEditClick = (reporte) => {
    setSelectedReporte(reporte);
    setEditData({
      descripcion: reporte.descripcion || '',
      entrada_salida: reporte.entrada_salida || 'Entrada',
      area: reporte.area || '',
      hora: reporte.fecha_creacion ? new Date(reporte.fecha_creacion).toTimeString().slice(0, 5) : ''
    });
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReporte) return;
    setDeleting(true);
    try {
      const reporteId = selectedReporte.id_reporte_vehiculo || selectedReporte.id_reporte_personal;
      await reporteService.delete(reporteId);
      showSuccess('Reporte eliminado correctamente');
      setDeleteModalOpen(false);
      setSelectedReporte(null);
      fetchReportes();
    } catch (err) {
      showError('Error al eliminar reporte');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedReporte) return;
    try {
      const reporteId = selectedReporte.id_reporte_vehiculo || selectedReporte.id_reporte_personal;
      await reporteService.update(reporteId, editData);
      showSuccess('Reporte actualizado correctamente');
      setEditModalOpen(false);
      setSelectedReporte(null);
      setEditData({});
      fetchReportes();
    } catch (err) {
      showError('Error al actualizar reporte');
    }
  };

  const fetchReportes = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedTipo) {
        const tipo = tipos.find(t => t.nombre === selectedTipo);
        if (tipo) {
          data = await getReportesByTipo(tipo.id_tipo_reporte);
        }
      } else {
        data = await getReportes();
      }
      setReportes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'id', 
      label: 'ID',
      width: 'w-16',
      render: (_, item) => (
        <span className="font-mono text-xs">
          #{item.id_reporte_vehiculo || item.id_reporte_personal || 'N/A'}
        </span>
      )
    },
    { 
      key: 'tipo', 
      label: 'Tipo',
      width: 'w-40',
      render: (_, item) => {
        const tipoNombre = item.tipo?.nombre || item.tipo_reporte?.nombre || 'N/A';
        return (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTipoColor(tipoNombre)}`}>
            {tipoNombre}
          </span>
        );
      }
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      width: 'w-40',
      render: (value) => (
        <span className="text-xs text-gray-500 max-w-[160px] truncate block" title={value}>
          {value || 'Sin descripción'}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Estado',
      width: 'w-24',
      render: (_, item) => {
        const statusNombre = item.status?.nombre || item.status_reporte?.nombre || 'N/A';
        return (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(statusNombre)}`}>
            {statusNombre}
          </span>
        );
      }
    },
    { 
      key: 'generador', 
      label: 'Usuario',
      width: 'w-24',
      render: (_, item) => (
        <span className="text-xs text-gray-600 truncate block" title={item.generador?.nombre_usuario || item.usuario?.nombre_usuario}>
          {item.generador?.nombre_usuario || item.usuario?.nombre_usuario || 'N/A'}
        </span>
      )
    },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha',
      width: 'w-28',
      render: (value) => (
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-2">
      {/* Botones para crear reportes */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">📋 Reportes</h1>
        <div className="flex gap-1.5">
          <Link to="/reportes/personal">
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs py-1 px-2">
              + Personal
            </Button>
          </Link>
          <Link to="/reportes/vehiculos">
            <Button className="bg-green-600 hover:bg-green-700 text-xs py-1 px-2">
              + Vehículo
            </Button>
          </Link>
          <Link to="/reportes/incidentes">
            <Button className="bg-red-600 hover:bg-red-700 text-xs py-1 px-2">
              + Incidente
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtro por tipo */}
      <div className="flex items-center gap-2">
        <select
          value={selectedTipo}
          onChange={handleTipoChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo.id_tipo_reporte} value={tipo.nombre}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={reportes}
          loading={loading}
          searchPlaceholder="Buscar reportes..."
          customActions={(item) => (
            <div className="flex gap-0.5">
              <button
                onClick={() => handleViewClick(item)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                title="Ver detalle"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => handleEditClick(item)}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
                title="Editar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleChangeStatus(item)}
                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                title="Cambiar estado"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteClick(item)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
                title="Eliminar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
          compact
        />
      </div>

      {/* Modal para cambiar estado */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Cambiar Estado del Reporte"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmitStatus}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="block text-sm font-medium text-gray-700">Nuevo Estado</p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Seleccione un estado</option>
            {statuses.map((status) => (
              <option key={status.id_status_reporte} value={status.id_status_reporte}>
                {status.nombre}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Modal para eliminar reporte */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar Reporte"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Eliminar</Button>
          </>
        }
      >
        <p className="text-gray-700">
          ¿Está seguro de eliminar este reporte? Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* Modal para ver detalle del reporte */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Detalle del Reporte"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Cerrar</Button>
        }
      >
        {viewReporte && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-gray-800">#{viewReporte.id_reporte_vehiculo || viewReporte.id_reporte_personal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getTipoColor(viewReporte.tipo?.nombre)}`}>
                  {viewReporte.tipo?.nombre || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewReporte.status?.nombre)}`}>
                  {viewReporte.status?.nombre || 'Sin estado'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha</p>
                <p className="text-gray-800">
                  {viewReporte.fecha_creacion ? new Date(viewReporte.fecha_creacion).toLocaleString('es-ES') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Usuario</p>
                <p className="text-gray-800">{viewReporte.generador?.nombre_usuario || 'N/A'}</p>
              </div>
              {viewReporte.entrada_salida && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Entrada/Salida</p>
                  <p className="text-gray-800">{viewReporte.entrada_salida}</p>
                </div>
              )}
              {viewReporte.area && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Área</p>
                  <p className="text-gray-800">{viewReporte.area}</p>
                </div>
              )}
              {viewReporte.placa && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Placa</p>
                  <p className="text-gray-800 font-mono">{viewReporte.placa}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Descripción</p>
              <p className="text-gray-800 whitespace-pre-wrap">{viewReporte.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para editar reporte */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Editar Reporte"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmitEdit}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={editData.descripcion || ''}
              onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows="4"
            />
          </div>
          {selectedReporte?.tipo?.nombre?.includes('Personal') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <input
                type="text"
                value={editData.area || ''}
                onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}
          {selectedReporte?.tipo?.nombre?.includes('Vehículo') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entrada/Salida</label>
              <select
                value={editData.entrada_salida || ''}
                onChange={(e) => setEditData({ ...editData, entrada_salida: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Entrada">Entrada</option>
                <option value="Salida">Salida</option>
              </select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReportesPage;
