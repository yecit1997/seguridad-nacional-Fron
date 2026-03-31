import React, { useEffect, useState } from 'react';
import { getTipos, createTipo, updateTipo, deleteTipo } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const TipoReportes = () => {
  const { showSuccess, showError } = useToast();
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { key: 'id_tipo_reporte', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const data = await getTipos();
      setTipos(Array.isArray(data) ? data : []);
    } catch (err) {
      showError('Error al cargar tipos de reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleOpenModal = (tipo = null) => {
    if (tipo) {
      setSelectedTipo(tipo);
      setFormData({ nombre: tipo.nombre || '', descripcion: tipo.descripcion || '' });
    } else {
      setSelectedTipo(null);
      setFormData({ nombre: '', descripcion: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTipo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedTipo) {
        await updateTipo(selectedTipo.id_tipo_reporte, formData);
        showSuccess('Tipo de reporte actualizado correctamente');
      } else {
        await createTipo(formData);
        showSuccess('Tipo de reporte creado correctamente');
      }
      handleCloseModal();
      fetchTipos();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al guardar tipo de reporte');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTipo) return;
    setSaving(true);
    try {
      await deleteTipo(selectedTipo.id_tipo_reporte);
      showSuccess('Tipo de reporte eliminado correctamente');
      setDeleteModalOpen(false);
      setSelectedTipo(null);
      fetchTipos();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al eliminar tipo de reporte');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (tipo) => {
    setSelectedTipo(tipo);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Tipos de Reporte</h1>
          <p className="text-gray-500 mt-1">Gestión de tipos de reporte del sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Tipo
          </span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tipos}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        searchPlaceholder="Buscar por nombre..."
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedTipo ? '✏️ Editar Tipo de Reporte' : '➕ Nuevo Tipo de Reporte'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>
              {selectedTipo ? 'Actualizar' : 'Crear'}
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
            placeholder="Ej: Entrada/Salida de Personal"
          />
          <Input
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción del tipo de reporte"
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
          ¿Está seguro de eliminar el tipo de reporte <strong>{selectedTipo?.nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

export default TipoReportes;
