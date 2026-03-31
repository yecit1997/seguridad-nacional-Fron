import React, { useEffect, useState } from 'react';
import { getVehiculos, createVehiculo, updateVehiculo, deleteVehiculo, getConductores } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const VehiclesList = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    conductor_id_fk_persona: ''
  });
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const columns = [
    { key: 'id_vehiculo', label: 'ID' },
    { key: 'placa', label: 'Placa', render: (v) => <span className="font-mono font-bold text-sky-700 uppercase">{v}</span> },
    { 
      key: 'conductor', 
      label: 'Conductor',
      render: (_, item) => item.conductor?.persona ? `${item.conductor.persona.nombre} ${item.conductor.persona.apellido || ''}` : 'Sin asignar'
    },
  ];

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const data = await getVehiculos();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar vehículos:", err);
      showError('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const fetchConductores = async () => {
    try {
      const data = await getConductores();
      setConductores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar conductores:", err);
    }
  };

  useEffect(() => {
    fetchVehiculos();
    fetchConductores();
  }, []);

  const handleOpenModal = (vehiculo = null) => {
    if (vehiculo) {
      setSelectedVehiculo(vehiculo);
      setFormData({
        placa: vehiculo.placa || '',
        conductor_id_fk_persona: vehiculo.conductor_id_fk_persona || ''
      });
    } else {
      setSelectedVehiculo(null);
      setFormData({
        placa: '',
        conductor_id_fk_persona: ''
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVehiculo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        placa: formData.placa,
        conductor_id_fk_persona: formData.conductor_id_fk_persona ? parseInt(formData.conductor_id_fk_persona) : null
      };
      
      if (selectedVehiculo) {
        await updateVehiculo(selectedVehiculo.id_vehiculo, data);
        showSuccess('Vehículo actualizado correctamente');
      } else {
        await createVehiculo(data);
        showSuccess('Vehículo creado correctamente');
      }
      handleCloseModal();
      fetchVehiculos();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al guardar vehículo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVehiculo) return;
    setSaving(true);
    try {
      await deleteVehiculo(selectedVehiculo.id_vehiculo);
      showSuccess('Vehículo eliminado correctamente');
      setDeleteModalOpen(false);
      setSelectedVehiculo(null);
      fetchVehiculos();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al eliminar vehículo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setDeleteModalOpen(true);
  };

  const conductorOptions = [
    { value: '', label: 'Sin asignar' },
    ...conductores.map(c => ({
      value: c.id_fk_persona,
      label: c.persona ? `${c.persona.nombre} ${c.persona.apellido || ''} - ${c.licencia}` : `ID: ${c.id_fk_persona}`
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🚗 Vehículos</h1>
          <p className="text-gray-500 mt-1">Gestión de vehículos del sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Vehículo
          </span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vehiculos}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        searchPlaceholder="Buscar por placa..."
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedVehiculo ? '✏️ Editar Vehículo' : '➕ Nuevo Vehículo'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>
              {selectedVehiculo ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Placa"
            name="placa"
            value={formData.placa}
            onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
            required
            placeholder="Ej: ABC-123"
          />
          <Select
            label="Conductor Asignado"
            name="conductor_id_fk_persona"
            value={formData.conductor_id_fk_persona}
            onChange={(e) => setFormData({ ...formData, conductor_id_fk_persona: e.target.value })}
            options={conductorOptions}
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
          ¿Está seguro de eliminar el vehículo con placa <strong>{selectedVehiculo?.placa}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

export default VehiclesList;
