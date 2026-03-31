import React, { useState, useEffect } from 'react';
import { supervisorService, getUsuarios, personaService } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Supervisores = () => {
    const { showSuccess, showError } = useToast();
    const [supervisores, setSupervisores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [formData, setFormData] = useState({
        usuario_id_usuario: '',
        fecha_ascenso: ''
    });
    const [saving, setSaving] = useState(false);

    const columns = [
        { key: 'usuario_id_usuario', label: 'ID Usuario' },
        { 
            key: 'nombre', 
            label: 'Nombre',
            render: (_, item) => item.usuario?.persona ? `${item.usuario.persona.nombre} ${item.usuario.persona.apellido || ''}` : 'N/A'
        },
        { 
            key: 'telefono', 
            label: 'Teléfono',
            render: (_, item) => item.usuario?.persona?.telefono || 'N/A'
        },
        { 
            key: 'correo', 
            label: 'Correo',
            render: (_, item) => item.usuario?.persona?.correo || 'N/A'
        },
        { 
            key: 'nombre_usuario', 
            label: 'Usuario',
            render: (_, item) => item.usuario?.nombre_usuario || 'N/A'
        },
        { 
            key: 'fecha_ascenso', 
            label: 'Fecha Ascenso',
            render: (value) => value ? new Date(value).toLocaleDateString('es-ES') : 'N/A'
        },
    ];

    const fetchSupervisores = async () => {
        try {
            setLoading(true);
            const data = await supervisorService.getAll();
            setSupervisores(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar supervisores');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchSupervisores();
        fetchUsuarios();
    }, []);

    const handleOpenModal = (supervisor = null) => {
        if (supervisor) {
            setSelectedSupervisor(supervisor);
            setFormData({ 
                usuario_id_usuario: supervisor.usuario_id_usuario,
                fecha_ascenso: supervisor.fecha_ascenso || ''
            });
        } else {
            setSelectedSupervisor(null);
            setFormData({ usuario_id_usuario: '', fecha_ascenso: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSupervisor(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { 
                usuario_id_usuario: parseInt(formData.usuario_id_usuario),
                fecha_ascenso: formData.fecha_ascenso || null
            };
            if (selectedSupervisor) {
                await supervisorService.update(selectedSupervisor.usuario_id_usuario, data);
                showSuccess('Supervisor actualizado');
            } else {
                await supervisorService.create(data);
                showSuccess('Supervisor creado');
            }
            handleCloseModal();
            fetchSupervisores();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const usuarioOptions = [
        { value: '', label: 'Seleccione un usuario' },
        ...usuarios.map(u => ({
            value: u.id_usuario,
            label: u.persona ? `${u.persona.nombre} ${u.persona.apellido || ''} (${u.nombre_usuario})` : `Usuario: ${u.nombre_usuario}`
        }))
    ];

    const handleDelete = async () => {
        if (!selectedSupervisor) return;
        setSaving(true);
        try {
            await supervisorService.delete(selectedSupervisor.usuario_id_usuario);
            showSuccess('Supervisor eliminado');
            setDeleteModalOpen(false);
            setSelectedSupervisor(null);
            fetchSupervisores();
        } catch (error) {
            showError('Error al eliminar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📋 Supervisores</h1>
                    <p className="text-gray-500 mt-1">Gestión de supervisores del sistema</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Supervisor
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={supervisores}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={(s) => { setSelectedSupervisor(s); setDeleteModalOpen(true); }}
                searchPlaceholder="Buscar supervisor..."
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedSupervisor ? '✏️ Editar Supervisor' : '➕ Nuevo Supervisor'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedSupervisor ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Usuario"
                        name="usuario_id_usuario"
                        value={formData.usuario_id_usuario}
                        onChange={(e) => setFormData({ ...formData, usuario_id_usuario: e.target.value })}
                        options={usuarioOptions}
                        required
                    />
                    <Input
                        label="Fecha de Ascenso"
                        name="fecha_ascenso"
                        type="date"
                        value={formData.fecha_ascenso}
                        onChange={(e) => setFormData({ ...formData, fecha_ascenso: e.target.value })}
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
                <p className="text-gray-700">¿Está seguro de eliminar este supervisor?</p>
            </Modal>
        </div>
    );
};

export default Supervisores;
