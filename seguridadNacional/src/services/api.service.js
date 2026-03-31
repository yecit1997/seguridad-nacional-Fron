import client from "../api/client";

const BASE_URL = "";

const handleResponse = (response) => {
    if (response?.success === false) {
        throw new Error(response?.message || 'Error en la operación');
    }
    return response?.data;
};

// ============ PERSONAS ============
export const personaService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/personas`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/personas/${id}`);
        return handleResponse(data);
    },
    getByDni: async (dni) => {
        const { data } = await client.get(`${BASE_URL}/personas/dni/${dni}`);
        return handleResponse(data);
    },
    create: async (persona) => {
        const { data } = await client.post(`${BASE_URL}/personas`, persona);
        return handleResponse(data);
    },
    update: async (id, persona) => {
        const { data } = await client.put(`${BASE_URL}/personas/${id}`, persona);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/personas/${id}`);
        return handleResponse(data);
    },
};

// ============ USUARIOS ============
export const usuarioService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/usuarios`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/usuarios/${id}`);
        return handleResponse(data);
    },
    create: async (usuario) => {
        const { data } = await client.post(`${BASE_URL}/usuarios`, usuario);
        return handleResponse(data);
    },
    update: async (id, usuario) => {
        const { data } = await client.put(`${BASE_URL}/usuarios/${id}`, usuario);
        return handleResponse(data);
    },
    cambiarStatus: async (id, activo) => {
        const { data } = await client.patch(`${BASE_URL}/usuarios/${id}/status?activo=${activo}`);
        return handleResponse(data);
    },
    asignarRol: async (id, idRol) => {
        const { data } = await client.post(`${BASE_URL}/usuarios/${id}/roles/${idRol}`);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/usuarios/${id}`);
        return handleResponse(data);
    },
};

// ============ ROLES ============
export const rolService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/roles`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/roles/${id}`);
        return handleResponse(data);
    },
    create: async (rol) => {
        const { data } = await client.post(`${BASE_URL}/roles`, rol);
        return handleResponse(data);
    },
    update: async (id, rol) => {
        const { data } = await client.put(`${BASE_URL}/roles/${id}`, rol);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/roles/${id}`);
        return handleResponse(data);
    },
};

// ============ REPORTES ============
export const reporteService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/reportes`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/reportes/${id}`);
        return handleResponse(data);
    },
    getByUsuario: async (idUsuario) => {
        const { data } = await client.get(`${BASE_URL}/reportes/usuario/${idUsuario}`);
        return handleResponse(data) || [];
    },
    getByTipo: async (idTipo) => {
        const { data } = await client.get(`${BASE_URL}/reportes/tipo/${idTipo}`);
        return handleResponse(data) || [];
    },
    getByStatus: async (idStatus) => {
        const { data } = await client.get(`${BASE_URL}/reportes/status/${idStatus}`);
        return handleResponse(data) || [];
    },
    create: async (reporte) => {
        const { data } = await client.post(`${BASE_URL}/reportes`, reporte);
        return handleResponse(data);
    },
    update: async (id, reporte) => {
        const { data } = await client.put(`${BASE_URL}/reportes/${id}`, reporte);
        return handleResponse(data);
    },
    updateStatus: async (id, idStatus) => {
        const { data } = await client.patch(`${BASE_URL}/reportes/${id}/status/${idStatus}`);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/reportes/${id}`);
        return handleResponse(data);
    },
};

// Alias para compatibilidad
export const getReportes = () => reporteService.getAll();
export const getReportesByTipo = (idTipo) => reporteService.getByTipo(idTipo);
export const getReportesByStatus = (idStatus) => reporteService.getByStatus(idStatus);
export const createReporte = (data) => reporteService.create(data);
export const updateReporteStatus = (id, idStatus) => reporteService.updateStatus(id, idStatus);

// ============ VEHÍCULOS ============
export const vehiculoService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/vehiculos`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/vehiculos/${id}`);
        return handleResponse(data);
    },
    getByPlaca: async (placa) => {
        const { data } = await client.get(`${BASE_URL}/vehiculos/placa/${placa}`);
        return handleResponse(data);
    },
    create: async (vehiculo) => {
        const { data } = await client.post(`${BASE_URL}/vehiculos`, vehiculo);
        return handleResponse(data);
    },
    update: async (id, vehiculo) => {
        const { data } = await client.put(`${BASE_URL}/vehiculos/${id}`, vehiculo);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/vehiculos/${id}`);
        return handleResponse(data);
    },
};

// ============ CONDUCTORES ============
export const conductorService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/conductores`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/conductores/${id}`);
        return handleResponse(data);
    },
    create: async (conductor) => {
        const { data } = await client.post(`${BASE_URL}/conductores`, conductor);
        return handleResponse(data);
    },
    update: async (id, conductor) => {
        const { data } = await client.put(`${BASE_URL}/conductores/${id}`, conductor);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/conductores/${id}`);
        return handleResponse(data);
    },
};

// ============ ALERTAS ============
export const alertaService = {
    getByUsuario: async (idUsuario) => {
        const { data } = await client.get(`${BASE_URL}/alertas/usuario/${idUsuario}`);
        return handleResponse(data) || [];
    },
    getNoLeidas: async (idUsuario) => {
        const { data } = await client.get(`${BASE_URL}/alertas/usuario/${idUsuario}/no-leidas`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/alertas/${id}`);
        return handleResponse(data);
    },
    create: async (alerta) => {
        const { data } = await client.post(`${BASE_URL}/alertas`, alerta);
        return handleResponse(data);
    },
    marcarLeida: async (id) => {
        const { data } = await client.patch(`${BASE_URL}/alertas/${id}/leer`);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/alertas/${id}`);
        return handleResponse(data);
    },
};

// ============ GUARDAS ============
export const guardaService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/guardas`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/guardas/${id}`);
        return handleResponse(data);
    },
    getBySupervisor: async (supervisorId) => {
        const { data } = await client.get(`${BASE_URL}/guardas/supervisor/${supervisorId}`);
        return handleResponse(data) || [];
    },
    create: async (guarda) => {
        const { data } = await client.post(`${BASE_URL}/guardas`, guarda);
        return handleResponse(data);
    },
    update: async (id, guarda) => {
        const { data } = await client.put(`${BASE_URL}/guardas/${id}`, guarda);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/guardas/${id}`);
        return handleResponse(data);
    },
};

// ============ SUPERVISORES ============
export const supervisorService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/supervisores`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/supervisores/${id}`);
        return handleResponse(data);
    },
    create: async (supervisor) => {
        const { data } = await client.post(`${BASE_URL}/supervisores`, supervisor);
        return handleResponse(data);
    },
    update: async (id, supervisor) => {
        const { data } = await client.put(`${BASE_URL}/supervisores/${id}`, supervisor);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/supervisores/${id}`);
        return handleResponse(data);
    },
};

// ============ PERSONAL ADMINISTRATIVO ============
export const personalService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/personal`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/personal/${id}`);
        return handleResponse(data);
    },
    create: async (personal) => {
        const { data } = await client.post(`${BASE_URL}/personal`, personal);
        return handleResponse(data);
    },
    update: async (id, personal) => {
        const { data } = await client.put(`${BASE_URL}/personal/${id}`, personal);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/personal/${id}`);
        return handleResponse(data);
    },
};

// ============ CATÁLOGOS ============
export const tipoReporteService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/tipos-reporte`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/tipos-reporte/${id}`);
        return handleResponse(data);
    },
    create: async (tipo) => {
        const { data } = await client.post(`${BASE_URL}/tipos-reporte`, tipo);
        return handleResponse(data);
    },
    update: async (id, tipo) => {
        const { data } = await client.put(`${BASE_URL}/tipos-reporte/${id}`, tipo);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/tipos-reporte/${id}`);
        return handleResponse(data);
    },
};

export const statusReporteService = {
    getAll: async () => {
        const { data } = await client.get(`${BASE_URL}/status-reporte`);
        return handleResponse(data) || [];
    },
    getById: async (id) => {
        const { data } = await client.get(`${BASE_URL}/status-reporte/${id}`);
        return handleResponse(data);
    },
    create: async (status) => {
        const { data } = await client.post(`${BASE_URL}/status-reporte`, status);
        return handleResponse(data);
    },
    update: async (id, status) => {
        const { data } = await client.put(`${BASE_URL}/status-reporte/${id}`, status);
        return handleResponse(data);
    },
    delete: async (id) => {
        const { data } = await client.delete(`${BASE_URL}/status-reporte/${id}`);
        return handleResponse(data);
    },
};

// Alias para compatibilidad
export const getTipos = () => tipoReporteService.getAll();
export const getTiposReporte = () => tipoReporteService.getAll();
export const getStatusReportes = () => statusReporteService.getAll();

export const getStatusReporteByNombre = async (nombre) => {
    const statusList = await statusReporteService.getAll();
    return statusList.find(s => s.nombre?.toLowerCase() === nombre.toLowerCase());
};

// ============ AUTH ============
export const authService = {
    login: async (credentials) => {
        const { data } = await client.post(`${BASE_URL}/auth/login`, credentials);
        return handleResponse(data);
    },
    registro: async (usuario) => {
        const { data } = await client.post(`${BASE_URL}/auth/registro`, usuario);
        return handleResponse(data);
    },
};

// ============ ALIAS PARA COMPATIBILIDAD ============
// Personal
export const getPersonal = () => personalService.getAll();
export const createPersonal = (data) => personalService.create(data);
export const updatePersonal = (id, data) => personalService.update(id, data);
export const deletePersonal = (id) => personalService.delete(id);

// Vehículos
export const getVehiculos = () => vehiculoService.getAll();
export const getVehiculoById = (id) => vehiculoService.getById(id);
export const createVehiculo = (data) => vehiculoService.create(data);
export const updateVehiculo = (id, data) => vehiculoService.update(id, data);
export const deleteVehiculo = (id) => vehiculoService.delete(id);

// Conductores
export const getConductores = () => conductorService.getAll();

// Tipos de Reporte
export const createTipo = (data) => tipoReporteService.create(data);
export const updateTipo = (id, data) => tipoReporteService.update(id, data);
export const deleteTipo = (id) => tipoReporteService.delete(id);

// Status de Reporte
export const createStatusReporte = (data) => statusReporteService.create(data);
export const updateStatusReporte = (id, data) => statusReporteService.update(id, data);
export const deleteStatusReporte = (id) => statusReporteService.delete(id);

// Personas
export const getPersonaByDni = (dni) => personaService.getByDni(dni);

export const getUsuarios = () => usuarioService.getAll();
