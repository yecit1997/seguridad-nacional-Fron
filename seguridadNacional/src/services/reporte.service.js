import client from "../api/client";

const REPORTES_URL = "/reportes";

// Función para obtener todos los reportes  
export const getReportes = async () => {
    try {
        const { data } = await client.get(REPORTES_URL);
        console.log("Reportes obtenidos:", data);
        // El backend devuelve: { success, message, data: [...] }
        return data?.data || [];
    } catch (error) {
        console.error("Error al obtener reportes:", error);
        throw error;
    }
};

// Función para obtener un reporte por su ID
export const getReporteById = async (id) => {
    try {
        const { data } = await client.get(`${REPORTES_URL}/${id}`);
        console.log("Reporte obtenido:", data);
        return data?.data || null;
    } catch (error) {
        console.error("Error al obtener reporte:", error);
        throw error;
    }
};


// Función para crear un nuevo reporte
export const createReporte = async (reporteData) => {
    try {
        const { data } = await client.post(REPORTES_URL, reporteData);
        console.log("Reporte creado:", data);
        return data?.data || null;
    } catch (error) {
        console.error("Error al crear reporte:", error);
        throw error;
    }
};