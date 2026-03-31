import React, { useState, useEffect } from 'react';
import { usuarioService, rolService, personaService, getUsuarios } from '../../services/api.service';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select, Badge } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Usuarios = () => {
    const { showSuccess, showError } = useToast();
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        contrasena: '',
        persona_id_persona: '',
        rol_id_rol: ''
    });
    const [saving, setSaving] = useState(false);

    const columns = [
        { key: 'id_usuario', label: 'ID' },
        { 
            key: 'nombre_usuario', 
            label: 'Usuario',
            render: (value) => <span className="font-medium text-sky-700">{value}</span>
        },
        { 
            key: 'persona', 
            label: 'Persona',
            render: (_, item) => item.persona ? `${item.persona.nombre} ${item.persona.apellido || ''}` : 'N/A'
        },
        { 
            key: 'roles', 
            label: 'Rol',
            render: (_, item) => {
                const roles = item.roles || [];
                return roles.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                        {roles.map((r, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {r.nombre}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">Sin rol</span>
                );
            }
        },
        { 
            key: 'status', 
            label: 'Estado',
            render: (value) => (
                <Badge variant={value ? 'success' : 'danger'}>
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        },
    ];

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAll();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar los usuarios');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await rolService.getAll();
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar roles:', error);
        }
    };

    const fetchPersonas = async () => {
        try {
            const data = await personaService.getAll();
            setPersonas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar personas:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
        fetchPersonas();
    }, []);

    const handleOpenModal = (usuario = null) => {
        if (usuario) {
            setSelectedUsuario(usuario);
            const currentRole = usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].id_rol : '';
            setFormData({
                nombre_usuario: usuario.nombre_usuario || '',
                contrasena: '',
                persona_id_persona: usuario.persona_id_persona || '',
                rol_id_rol: currentRole
            });
        } else {
            setSelectedUsuario(null);
            setFormData({ nombre_usuario: '', contrasena: '', persona_id_persona: '', rol_id_rol: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUsuario(null);
        setFormData({ nombre_usuario: '', contrasena: '', persona_id_persona: '', rol_id_rol: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (selectedUsuario) {
                const updateData = {
                    nombre_usuario: formData.nombre_usuario,
                    persona_id_persona: parseInt(formData.persona_id_persona)
                };
                if (formData.contrasena) {
                    updateData.contrasena = formData.contrasena;
                }
                await usuarioService.update(selectedUsuario.id_usuario, updateData);
                if (formData.rol_id_rol) {
                    await usuarioService.asignarRol(selectedUsuario.id_usuario, formData.rol_id_rol);
                }
                showSuccess('Usuario actualizado correctamente');
            } else {
                const rolId = formData.rol_id_rol ? parseInt(formData.rol_id_rol) : null;
                const roles = rolId ? [rolId] : [];
                const usuarioData = {
                    nombre_usuario: formData.nombre_usuario,
                    contrasena: formData.contrasena,
                    persona_id_persona: parseInt(formData.persona_id_persona),
                    roles
                };
                await usuarioService.create(usuarioData);
                showSuccess('Usuario creado correctamente');
            }
            handleCloseModal();
            fetchUsuarios();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al guardar el usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (usuario) => {
        try {
            await usuarioService.cambiarStatus(usuario.id_usuario, !usuario.status);
            showSuccess(`Usuario ${usuario.status ? 'deshabilitado' : 'habilitado'} correctamente`);
            fetchUsuarios();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al cambiar el estado');
        }
    };

    const handleDelete = async () => {
        if (!selectedUsuario) return;
        setSaving(true);
        try {
            await usuarioService.delete(selectedUsuario.id_usuario);
            showSuccess('Usuario eliminado correctamente');
            setDeleteModalOpen(false);
            setSelectedUsuario(null);
            fetchUsuarios();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al eliminar el usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (usuario) => {
        setSelectedUsuario(usuario);
        setDeleteModalOpen(true);
    };

    const rolOptions = roles.map(r => ({ value: r.id_rol, label: r.nombre }));

    const personaOptions = [
        { value: '', label: 'Seleccione una persona' },
        ...personas.map(p => ({
            value: p.id_persona,
            label: `${p.dni} - ${p.nombre} ${p.apellido || ''}`
        }))
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">👥 Usuarios</h1>
                    <p className="text-gray-500 mt-1">Gestión de usuarios del sistema</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nuevo Usuario
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={usuarios}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
                searchPlaceholder="Buscar por nombre de usuario..."
                customActions={(item) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2 py-1 text-xs rounded ${
                                item.status 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        >
                            {item.status ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedUsuario ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedUsuario ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nombre de Usuario"
                        name="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                        required
                        placeholder="Nombre de usuario único"
                    />
                    <Input
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        value={formData.contrasena}
                        onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                        required={!selectedUsuario}
                        placeholder={selectedUsuario ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña segura"}
                    />
                    <Select
                        label="Persona"
                        name="persona_id_persona"
                        value={formData.persona_id_persona}
                        onChange={(e) => setFormData({ ...formData, persona_id_persona: e.target.value })}
                        options={personaOptions}
                        required
                    />
                    <Select
                        label="Rol"
                        name="rol_id_rol"
                        value={formData.rol_id_rol}
                        onChange={(e) => setFormData({ ...formData, rol_id_rol: e.target.value })}
                        options={rolOptions}
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
                    ¿Está seguro de eliminar al usuario <strong>{selectedUsuario?.nombre_usuario}</strong>?
                    Esta acción no se puede deshacer.
                </p>
            </Modal>
        </div>
    );
};

export default Usuarios;
