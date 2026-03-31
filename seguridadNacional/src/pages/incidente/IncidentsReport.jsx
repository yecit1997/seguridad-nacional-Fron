import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createReporte, getStatusReporteByNombre } from '../../services/api.service';
import { useReportTypes } from '../../hooks/useReportTypes';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../contexts/AuthContext';

function IncidentsReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();
  const [statusId, setStatusId] = useState(1);

  const { formData, setFormData, handleChange } = useForm({
    titulo: '',
    descripcion: '',
    tipo: '',
    severidad: 'media',
    ubicacion: '',
    hora: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getStatusReporteByNombre('Pendiente');
        if (status) {
          setStatusId(status.id_status_reporte);
        }
      } catch (err) {
        console.error("Error al obtener status:", err);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!loading && tipos.length > 0) {
      let tipoElegido = tipoSeleccionado;
      
      if (!tipoElegido) {
        const tipoIncidente = tipos.find(t => t.nombre === 'Incidentes/Accidentes');
        if (tipoIncidente) {
          tipoElegido = tipoIncidente.nombre;
        }
      }
      
      if (tipoElegido) {
        const tipoEncontrado = tipos.find(tipo => tipo.nombre === tipoElegido);
        if (tipoEncontrado) {
          setFormData(prev => ({ ...prev, tipo: tipoEncontrado.nombre }));
        }
      }
    }
  }, [loading, tipos, tipoSeleccionado, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoEncontrado = tipos.find(t => t.nombre === formData.tipo);
    const idTipoReporte = tipoEncontrado ? (tipoEncontrado.id || tipoEncontrado.id_tipo_reporte) : 1;

    const userId = user?.usuario?.id_usuario || 1;

    const dataToSend = {
      descripcion: `INCIDENTE: ${formData.titulo}\nSeveridad: ${formData.severidad}\nUbicación: ${formData.ubicacion}\nDetalle: ${formData.descripcion}`,
      fecha_creacion: (() => {
        const now = new Date();
        const [hours, minutes] = formData.hora.split(':');
        now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        return now.toISOString();
      })(),
      status_reporte_id_status_reporte: statusId,
      tipo_reporte_id_tipo_reporte: idTipoReporte,
      usuario_id_usuario_generador: userId,
    };

    console.log("Enviando reporte de incidente:", dataToSend);

    try {
      await createReporte(dataToSend);
      alert('Reporte de incidente creado exitosamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al crear reporte:', error);
      alert('Error al crear el reporte: ' + (error.message || 'Error desconocido'));
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

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
              placeholder="Ej: Accidente de tránsito, Incendio, Robo"
            />
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
              placeholder="Ej: calle 10 # 5-20"
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
              placeholder="Describa los detalles del incidente..."
            ></textarea>
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
            <input type="hidden" name="tipo" value={formData.tipo} />
          </div>
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
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
