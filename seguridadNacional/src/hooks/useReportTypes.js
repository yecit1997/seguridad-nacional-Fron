import { useState, useEffect } from 'react';
import { getTipos } from '../services/api.service';

export const useReportTypes = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await getTipos();
        const items = Array.isArray(response) ? response : [];
        setTipos(items);
      } catch (error) {
        console.error('Error al cargar tipos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTipos();
  }, []);

  return { tipos, loading };
};