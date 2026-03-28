import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createReporte } from '../../services/reporte.service';
import { useReportTypes } from '../../hooks/useReportTypes';
import { useForm } from '../../hooks/useForm';

function IncidentsReport() {
  const [searchParams] = useSearchParams();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();

  const { formData, setFormData, handleChange } = useForm({
    titulo: '',
    descripcion: '',
    tipo: '',
    severidad: 'media',
    ubicacion: '',
  });

  useEffect(() => {
    if (!loading && tipoSeleccionado) {
      const tipoEncontrado = tipos.find(tipo => tipo.nombre === tipoSeleccionado);
      if (tipoEncontrado) {
        setFormData(prev => ({ ...prev, tipo: tipoEncontrado.nombre }));
      }
    }
  }, [loading, tipos, tipoSeleccionado, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoEncontrado = tipos.find(t => t.nombre === formData.tipo);
    const idTipoReporte = tipoEncontrado ? (tipoEncontrado.id || tipoEncontrado.id_tipo_reporte) : 1;

    const dataToSend = {
      descripcion: `Incidente: ${formData.titulo} [Severidad: ${formData.severidad}] en ${formData.ubicacion}. Detalle: ${formData.descripcion}`,
      fecha_creacion: new Date().toISOString(),
      status_reporte_id_status_reporte: 1,
      tipo_reporte_id_tipo_reporte: idTipoReporte,
      usuario_id_usuario_generador: 1,
    };

    try {
      await createReporte(dataToSend);
      alert('Reporte de incidente creado exitosamente');

      // Resetear formulario manteniendo el tipo
      setFormData({
        titulo: '',
        descripcion: '',
        tipo: formData.tipo,
        severidad: 'media',
        ubicacion: '',
      });
    } catch (error) {
      console.error('Error al crear reporte:', error);
      alert('Error al crear el reporte');
    }
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