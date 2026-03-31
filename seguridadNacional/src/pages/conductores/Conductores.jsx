import React, { useState, useEffect } from 'react';
import { conductorService, personaService } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Conductores = () => {
    const { showSuccess, showError } = useToast();
    const [conductores, setConductores] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [formData, setFormData] = useState({
        idPersona: '',
        numeroLicencia: ''
    });
    const [saving, setSaving] = useState(false);

    const columns = [
        { key: 'id_fk_persona', label: 'ID Persona' },
        { 
            key: 'persona', 
            label: 'Nombre Completo',
            render: (_, item) => item.persona ? `${item.persona.nombre} ${item.persona.apellido || ''}` : 'N/A'
        },
        { 
            key: 'licencia', 
            label: 'Número de Licencia',
            render: (value) => <span className="font-mono font-bold">{value}</span>
        },
        { 
            key: 'telefono', 
            label: 'Teléfono',
            render: (_, item) => item.persona?.telefono || 'N/A'
        },
    ];

    const fetchConductores = async () => {
        try {
            setLoading(true);
            const data = await conductorService.getAll();
            setConductores(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar los conductores');
        } finally {
            setLoading(false);
        }
    };

    const fetchPersonas = async () => {
        try {
            const data = await personaService.getAll();
            setPersonas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchConductores();
        fetchPersonas();
    }, []);

    const handleOpenModal = (conductor = null) => {
        if (conductor) {
            setSelectedConductor(conductor);
            setFormData({
                idPersona: conductor.id_fk_persona,
                numeroLicencia: conductor.licencia
            });
        } else {
            setSelectedConductor(null);
            setFormData({ idPersona: '', numeroLicencia: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedConductor(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                id_fk_persona: parseInt(formData.idPersona),
                licencia: formData.numeroLicencia
            };
            if (selectedConductor) {
                await conductorService.update(selectedConductor.id_fk_persona, data);
                showSuccess('Conductor actualizado');
            } else {
                await conductorService.create(data);
                showSuccess('Conductor creado');
            }
            handleCloseModal();
            fetchConductores();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedConductor) return;
        setSaving(true);
        try {
            await conductorService.delete(selectedConductor.id_fk_persona);
            showSuccess('Conductor eliminado');
            setDeleteModalOpen(false);
            setSelectedConductor(null);
            fetchConductores();
        } catch (error) {
            showError('Error al eliminar');
        } finally {
            setSaving(false);
        }
    };

    const personaOptions = personas.map(p => ({
        value: p.id_persona,
        label: `${p.dni} - ${p.nombre} ${p.apellido || ''}`
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🪪 Conductores</h1>
                    <p className="text-gray-500 mt-1">Gestión de conductores registrados</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Conductor
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={conductores}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={(c) => { setSelectedConductor(c); setDeleteModalOpen(true); }}
                searchPlaceholder="Buscar por nombre o licencia..."
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedConductor ? '✏️ Editar Conductor' : '➕ Nuevo Conductor'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedConductor ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Persona"
                        name="idPersona"
                        value={formData.idPersona}
                        onChange={(e) => setFormData({ ...formData, idPersona: e.target.value })}
                        options={personaOptions}
                        required
                    />
                    <Input
                        label="Número de Licencia"
                        name="numeroLicencia"
                        value={formData.numeroLicencia}
                        onChange={(e) => setFormData({ ...formData, numeroLicencia: e.target.value })}
                        required
                        placeholder="Ej: L-12345678"
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
                    ¿Está seguro de eliminar este conductor?
                </p>
            </Modal>
        </div>
    );
};

export default Conductores;
