import React, { useState, useEffect } from 'react';
import { guardaService, supervisorService, getUsuarios } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Guardas = () => {
    const { showSuccess, showError } = useToast();
    const [guardas, setGuardas] = useState([]);
    const [supervisores, setSupervisores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedGuarda, setSelectedGuarda] = useState(null);
    const [formData, setFormData] = useState({
        usuario_id_usuario: '',
        supervisor_id_supervisor: '',
        areaAsignada: ''
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
            key: 'areaAsignada', 
            label: 'Área Asignada',
            render: (value) => <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded">{value}</span>
        },
        { 
            key: 'supervisor', 
            label: 'Supervisor',
            render: (_, item) => item.supervisor?.usuario?.persona ? `${item.supervisor.usuario.persona.nombre} ${item.supervisor.usuario.persona.apellido || ''}` : 'Sin asignar'
        },
    ];

    const fetchGuardas = async () => {
        try {
            setLoading(true);
            const data = await guardaService.getAll();
            setGuardas(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar guardas');
        } finally {
            setLoading(false);
        }
    };

    const fetchSupervisores = async () => {
        try {
            const data = await supervisorService.getAll();
            setSupervisores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
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
        fetchGuardas();
        fetchSupervisores();
        fetchUsuarios();
    }, []);

    const handleOpenModal = (guarda = null) => {
        if (guarda) {
            setSelectedGuarda(guarda);
            setFormData({
                usuario_id_usuario: guarda.usuario_id_usuario,
                supervisor_id_supervisor: guarda.supervisor_id_supervisor || '',
                areaAsignada: guarda.areaAsignada || ''
            });
        } else {
            setSelectedGuarda(null);
            setFormData({ usuario_id_usuario: '', supervisor_id_supervisor: '', areaAsignada: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedGuarda(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                usuario_id_usuario: parseInt(formData.usuario_id_usuario),
                supervisor_id_supervisor: formData.supervisor_id_supervisor ? parseInt(formData.supervisor_id_supervisor) : null,
                areaAsignada: formData.areaAsignada
            };
            if (selectedGuarda) {
                await guardaService.update(selectedGuarda.usuario_id_usuario, data);
                showSuccess('Guarda actualizado');
            } else {
                await guardaService.create(data);
                showSuccess('Guarda creado');
            }
            handleCloseModal();
            fetchGuardas();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedGuarda) return;
        setSaving(true);
        try {
            await guardaService.delete(selectedGuarda.usuario_id_usuario);
            showSuccess('Guarda eliminado');
            setDeleteModalOpen(false);
            setSelectedGuarda(null);
            fetchGuardas();
        } catch (error) {
            showError('Error al eliminar');
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

    const supervisorOptions = [
        { value: '', label: 'Sin asignar' },
        ...supervisores.map(s => ({
            value: s.usuario_id_usuario,
            label: s.usuario?.persona ? `${s.usuario.persona.nombre} ${s.usuario.persona.apellido || ''}` : `ID: ${s.usuario_id_usuario}`
        }))
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🛡️ Guardas</h1>
                    <p className="text-gray-500 mt-1">Gestión de personal de seguridad</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Guarda
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={guardas}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={(g) => { setSelectedGuarda(g); setDeleteModalOpen(true); }}
                searchPlaceholder="Buscar guarda..."
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedGuarda ? '✏️ Editar Guarda' : '➕ Nuevo Guarda'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedGuarda ? 'Actualizar' : 'Crear'}
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
                        label="Área Asignada"
                        name="areaAsignada"
                        value={formData.areaAsignada}
                        onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                        required
                        placeholder="Ej: Zona Norte"
                    />
                    <Select
                        label="Supervisor"
                        name="supervisor_id_supervisor"
                        value={formData.supervisor_id_supervisor}
                        onChange={(e) => setFormData({ ...formData, supervisor_id_supervisor: e.target.value })}
                        options={supervisorOptions}
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
                <p className="text-gray-700">¿Está seguro de eliminar este guarda?</p>
            </Modal>
        </div>
    );
};

export default Guardas;
