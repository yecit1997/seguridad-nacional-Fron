import React, { useState, useEffect } from 'react';
import { alertaService } from '../../services/api.service';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Input, Button, Select } from '../../components/formComponents';
import { useToast } from '../../components/Toast';

const Alertas = () => {
    const { showSuccess, showError } = useToast();
    const { user } = useAuth();
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAlerta, setSelectedAlerta] = useState(null);
    const [formData, setFormData] = useState({
        idUsuario: '',
        mensaje: '',
        tipo: 'informativa'
    });
    const [saving, setSaving] = useState(false);

    const fetchAlertas = async () => {
        try {
            setLoading(true);
            const userId = user?.usuario?.id_usuario || 1;
            const data = await alertaService.getByUsuario(userId);
            setAlertas(Array.isArray(data) ? data : []);
        } catch (error) {
            showError('Error al cargar las alertas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlertas();
    }, [user]);

    const handleMarcarLeida = async (id) => {
        try {
            await alertaService.marcarLeida(id);
            showSuccess('Alerta marcada como leída');
            fetchAlertas();
        } catch (error) {
            showError('Error al marcar la alerta');
        }
    };

    const handleEliminar = async () => {
        if (!selectedAlerta) return;
        setSaving(true);
        try {
            await alertaService.delete(selectedAlerta.id_alerta);
            showSuccess('Alerta eliminada');
            setDeleteModalOpen(false);
            setSelectedAlerta(null);
            fetchAlertas();
        } catch (error) {
            showError('Error al eliminar la alerta');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (alerta) => {
        setSelectedAlerta(alerta);
        setDeleteModalOpen(true);
    };

    const handleOpenModal = (alerta = null) => {
        if (alerta) {
            setSelectedAlerta(alerta);
            setFormData({
                idUsuario: user?.usuario?.id_usuario || '',
                mensaje: alerta.mensaje || '',
                tipo: alerta.tipo || 'informativa'
            });
        } else {
            setSelectedAlerta(null);
            setFormData({
                idUsuario: user?.usuario?.id_usuario || '',
                mensaje: '',
                tipo: 'informativa'
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAlerta(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                idUsuario: parseInt(formData.idUsuario) || user?.usuario?.id_usuario,
                mensaje: formData.mensaje,
                tipo: formData.tipo
            };
            await alertaService.create(data);
            showSuccess('Alerta creada correctamente');
            handleCloseModal();
            fetchAlertas();
        } catch (error) {
            showError(error.response?.data?.message || 'Error al crear alerta');
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { key: 'id_alerta', label: 'ID' },
        { key: 'mensaje', label: 'Mensaje' },
        { key: 'tipo', label: 'Tipo' },
        { 
            key: 'leida', 
            label: 'Estado',
            render: (value) => value ? <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">Leída</span> : <span className="px-2 py-1 bg-red-100 text-red-700 rounded">No leída</span>
        },
        { 
            key: 'fecha_hora', 
            label: 'Fecha',
            render: (value) => value ? new Date(value).toLocaleString('es-ES') : 'N/A'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </div>
        );
    }

    const handleEditAlerta = (alerta) => {
        handleOpenModal(alerta);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🔔 Alertas</h1>
                    <p className="text-gray-500 mt-1">Notificaciones y alertas del sistema</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nueva Alerta
                    </span>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={alertas}
                loading={loading}
                onEdit={handleEditAlerta}
                onDelete={handleDeleteClick}
                searchPlaceholder="Buscar alertas..."
                customActions={(alerta) => (
                    <div className="flex gap-2">
                        {!alerta.leida && (
                            <button
                                onClick={() => handleMarcarLeida(alerta.id_alerta)}
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                                Marcar leída
                            </button>
                        )}
                    </div>
                )}
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={selectedAlerta ? '✏️ Editar Alerta' : '➕ Nueva Alerta'}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} loading={saving}>
                            {selectedAlerta ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                        required
                        placeholder="Contenido de la alerta"
                    />
                    <Select
                        label="Tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        options={[
                            { value: 'informativa', label: 'Informativa' },
                            { value: 'advertencia', label: 'Advertencia' },
                            { value: 'urgente', label: 'Urgente' },
                            { value: 'emergencia', label: 'Emergencia' }
                        ]}
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
                        <Button variant="danger" onClick={handleEliminar} loading={saving}>Eliminar</Button>
                    </>
                }
            >
                <p className="text-gray-700">
                    ¿Está seguro de eliminar esta alerta?
                </p>
            </Modal>
        </div>
    );
};

export default Alertas;
