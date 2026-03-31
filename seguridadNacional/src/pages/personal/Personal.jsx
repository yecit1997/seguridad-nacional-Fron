import React, { useState, useEffect } from 'react';
import { personalService, getUsuarios } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Personal = () => {
    const { showSuccess, showError } = useToast();
    const [personal, setPersonal] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const [formData, setFormData] = useState({
        usuario_id_usuario: '',
        cargo: ''
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
            key: 'cargo', 
            label: 'Cargo',
            render: (value) => <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{value}</span>
        },
    ];

    const fetchPersonal = async () => {
        try {
            setLoading(true);
            const data = await getPersonal();
            setPersonal(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar personal');
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
        fetchPersonal();
        fetchUsuarios();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setSelectedPersonal(item);
            setFormData({
                usuario_id_usuario: item.usuario_id_usuario,
                cargo: item.cargo || ''
            });
        } else {
            setSelectedPersonal(null);
            setFormData({ usuario_id_usuario: '', cargo: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPersonal(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                usuario_id_usuario: parseInt(formData.usuario_id_usuario),
                cargo: formData.cargo
            };
            if (selectedPersonal) {
                await updatePersonal(selectedPersonal.usuario_id_usuario, data);
                showSuccess('Personal actualizado');
            } else {
                await createPersonal(data);
                showSuccess('Personal creado');
            }
            handleCloseModal();
            fetchPersonal();
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
        if (!selectedPersonal) return;
        setSaving(true);
        try {
            await deletePersonal(selectedPersonal.usuario_id_usuario);
            showSuccess('Personal eliminado');
            setDeleteModalOpen(false);
            setSelectedPersonal(null);
            fetchPersonal();
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
                    <h1 className="text-3xl font-bold text-gray-800">💼 Personal Administrativo</h1>
                    <p className="text-gray-500 mt-1">Gestión de personal administrativo</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Personal
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={personal}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={(p) => { setSelectedPersonal(p); setDeleteModalOpen(true); }}
                searchPlaceholder="Buscar personal..."
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedPersonal ? '✏️ Editar Personal' : '➕ Nuevo Personal'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedPersonal ? 'Actualizar' : 'Crear'}
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
                        label="Cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        required
                        placeholder="Ej: Gerente, Secretario, etc."
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
                <p className="text-gray-700">¿Está seguro de eliminar este personal?</p>
            </Modal>
        </div>
    );
};

export default Personal;
