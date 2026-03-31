import React, { useState, useEffect } from 'react';
import { personaService } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Personas = () => {
    const { showSuccess, showError } = useToast();
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [formData, setFormData] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: ''
    });
    const [saving, setSaving] = useState(false);

    const columns = [
        { key: 'id_persona', label: 'ID' },
        { key: 'dni', label: 'DNI' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'correo', label: 'Correo' },
        { key: 'telefono', label: 'Teléfono' },
    ];

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const data = await personaService.getAll();
            setPersonas(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar las personas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    const handleOpenModal = (persona = null) => {
        if (persona) {
            setSelectedPersona(persona);
            setFormData({
                dni: persona.dni || '',
                nombre: persona.nombre || '',
                apellido: persona.apellido || '',
                correo: persona.correo || '',
                telefono: persona.telefono || ''
            });
        } else {
            setSelectedPersona(null);
            setFormData({ dni: '', nombre: '', apellido: '', correo: '', telefono: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPersona(null);
        setFormData({ dni: '', nombre: '', apellido: '', correo: '', telefono: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (selectedPersona) {
                await personaService.update(selectedPersona.id_persona, formData);
                showSuccess('Persona actualizada correctamente');
            } else {
                await personaService.create(formData);
                showSuccess('Persona creada correctamente');
            }
            handleCloseModal();
            fetchPersonas();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al guardar la persona');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPersona) return;
        setSaving(true);
        try {
            await personaService.delete(selectedPersona.id_persona);
            showSuccess('Persona eliminada correctamente');
            setDeleteModalOpen(false);
            setSelectedPersona(null);
            fetchPersonas();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al eliminar la persona');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (persona) => {
        setSelectedPersona(persona);
        setDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">👥 Personas</h1>
                    <p className="text-gray-500 mt-1">Gestión de personas registradas en el sistema</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nueva Persona
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={personas}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
                searchPlaceholder="Buscar por nombre, DNI o correo..."
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedPersona ? '✏️ Editar Persona' : '➕ Nueva Persona'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedPersona ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="DNI"
                        name="dni"
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        required
                        placeholder="Ej: 12345678"
                    />
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        placeholder="Nombre completo"
                    />
                    <Input
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        placeholder="Apellido"
                    />
                    <Input
                        label="Correo Electrónico"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        placeholder="correo@ejemplo.com"
                    />
                    <Input
                        label="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej: 3001234567"
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
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete} loading={saving}>
                            Eliminar
                        </Button>
                    </>
                }
            >
                <p className="text-gray-700">
                    ¿Está seguro de eliminar a <strong>{selectedPersona?.nombre} {selectedPersona?.apellido}</strong>?
                    Esta acción no se puede deshacer.
                </p>
            </Modal>
        </div>
    );
};

export default Personas;
