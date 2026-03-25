import client from "../api/client";

const REPORTES_URL = "/reportes";

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