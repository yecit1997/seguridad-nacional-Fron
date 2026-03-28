import client from "../api/client";

const TIPOS_URL = "/vehiculos";

// Función para obtener todos los tipos de reporte
export const getVehiculos = async () => {
    try {
        const response = await client.get(TIPOS_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener vehiculos", error);
        throw error;
    }
};