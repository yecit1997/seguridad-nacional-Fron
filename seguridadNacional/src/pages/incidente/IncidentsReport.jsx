import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTipos } from '../../services/tipoReporte.service';

function IncidentsReport() {
  const [searchParams] = useSearchParams();
  const tipoSeleccionado = searchParams.get('tipo');

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    severidad: 'media',
    ubicacion: '',
  });

  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await getTipos();
        const items = Array.isArray(response) ? response : response.data || [];
        setTipos(items);

        // Preseleccionar el tipo si viene de la URL
        if (tipoSeleccionado) {
          const tipoEncontrado = items.find(tipo => tipo.nombre === tipoSeleccionado);
          if (tipoEncontrado) {
            setFormData(prev => ({ ...prev, tipo: tipoEncontrado.nombre }));
          }
        }
      } catch (error) {
        console.error('Error al cargar tipos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, [tipoSeleccionado]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reporte de Incidente:', formData);
    alert('Reporte creado exitosamente');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Accidentes/Incidentes</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Título del Incidente</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100 cursor-not-allowed"
              required
              disabled
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id || tipo.id_tipo_reporte} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            {/* Input hidden para enviar el valor disabled */}
            <input type="hidden" name="tipo" value={formData.tipo} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Severidad</label>
            <select
              name="severidad"
              value={formData.severidad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Crear Reporte
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncidentsReport;