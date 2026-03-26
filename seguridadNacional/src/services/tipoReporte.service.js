import client from "../api/client";

const TIPOS_URL = "/tipos-reporte";

// Función para obtener todos los tipos de reporte
export const getTipos = async () => {
    try {
        const response = await client.get(TIPOS_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener tipos de reporte", error);
        throw error;
    }
};