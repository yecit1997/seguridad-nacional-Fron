import { useState, useEffect } from 'react';
import { getVehiculos } from '../services/vehiculos.service';

export const useVehicles = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const data = await getVehiculos();
        const items = Array.isArray(data) ? data : data?.data || [];
        setVehiculos(items);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculos();
  }, []);

  return { vehiculos, loading };
};