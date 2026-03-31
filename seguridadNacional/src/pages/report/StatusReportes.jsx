import React, { useEffect, useState } from 'react';
import { getStatusReportes, createStatusReporte, updateStatusReporte, deleteStatusReporte } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const StatusReportes = () => {
  const { showSuccess, showError } = useToast();
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'id_status_reporte', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getStatusReportes();
      setStatusList(Array.isArray(data) ? data : []);
    } catch (err) {
      showError('Error al cargar estados de reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOpenModal = (status = null) => {
    if (status) {
      setSelectedStatus(status);
      setFormData({ nombre: status.nombre || '', descripcion: status.descripcion || '' });
    } else {
      setSelectedStatus(null);
      setFormData({ nombre: '', descripcion: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedStatus) {
        await updateStatusReporte(selectedStatus.id_status_reporte, formData);
        showSuccess('Estado de reporte actualizado correctamente');
      } else {
        await createStatusReporte(formData);
        showSuccess('Estado de reporte creado correctamente');
      }
      handleCloseModal();
      fetchStatus();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al guardar estado de reporte');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStatus) return;
    setSaving(true);
    try {
      await deleteStatusReporte(selectedStatus.id_status_reporte);
      showSuccess('Estado de reporte eliminado correctamente');
      setDeleteModalOpen(false);
      setSelectedStatus(null);
      fetchStatus();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al eliminar estado de reporte');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (status) => {
    setSelectedStatus(status);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Estados de Reporte</h1>
          <p className="text-gray-500 mt-1">Gestión de estados de reporte del sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Estado
          </span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={statusList}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        searchPlaceholder="Buscar por nombre..."
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedStatus ? '✏️ Editar Estado de Reporte' : '➕ Nuevo Estado de Reporte'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>
              {selectedStatus ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            placeholder="Ej: Pendiente, Completado, Cancelado"
          />
          <Input
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción del estado"
          />
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="⚠️ Confirmar Eliminación"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Eliminar</Button>
          </>
        }
      >
        <p className="text-gray-700">
          ¿Está seguro de eliminar el estado <strong>{selectedStatus?.nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

export default StatusReportes;
