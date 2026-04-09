import { createReporte, getPersonaByDni, getStatusReporteByNombre, personaService } from "../../services/api.service";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReportTypes } from '../../hooks/useReportTypes';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../contexts/AuthContext';

function PersonalReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();
  const [statusId, setStatusId] = useState(1);
  const [tipoLoaded, setTipoLoaded] = useState(false);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await personaService.getAll();
        setPersonas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar personas:", err);
      }
    };
    fetchPersonas();
  }, []);

  const { formData, setFormData, handleChange } = useForm({
    persona_id: '',
    area: '',
    tipo: '',
    descripcion: '',
    hora: new Date().toLocaleTimeString(),
    entrada_salida: 'Entrada'
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
      const tipoPersonal = tipos.find(t => t.nombre === 'Entrada/Salida Personal');
      if (tipoPersonal) {
        setFormData(prev => ({ ...prev, tipo: tipoPersonal.nombre }));
      }
      setTipoLoaded(true);
    }
  }, [loading, tipos, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoEncontrado = tipos.find(t => t.nombre === formData.tipo);
    const idTipoReporte = tipoEncontrado ? (tipoEncontrado.id || tipoEncontrado.id_tipo_reporte) : 1;

    const personaId = formData.persona_id ? parseInt(formData.persona_id) : null;

    if (!personaId) {
      alert("Por favor seleccione una persona");
      return;
    }

    const userId = user?.usuario?.id_usuario || 1;

    const dataToSend = {
      descripcion: formData.descripcion || `Registro de ${formData.entrada_salida} - Área: ${formData.area}`,
      area: formData.area,
      entrada_salida: formData.entrada_salida,
      fecha_creacion: (() => {
        const now = new Date();
        const [hours, minutes] = formData.hora.split(':');
        now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        return now.toISOString();
      })(),
      status_reporte_id_status_reporte: statusId,
      tipo_reporte_id_tipo_reporte: idTipoReporte,
      usuario_id_usuario_generador: userId,
      persona_id_persona: personaId
    };

    console.log("Enviando reporte personal:", dataToSend);

    try {
      await createReporte(dataToSend);
      alert("Reporte creado exitosamente");
      navigate('/home');
    } catch (error) {
      console.error("Error al crear reporte", error);
      alert("Error al crear reporte: " + (error.message || 'Error desconocido'));
    }
  };

  if (loading || !tipoLoaded) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Ingreso/Salida de Personal</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Persona</label>
            <select
              name="persona_id"
              value={formData.persona_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione una persona</option>
              {personas.map((persona) => (
                <option key={persona.id_persona} value={persona.id_persona}>
                  {persona.nombre} {persona.apellido || ''} - {persona.dni}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipo de Registro</label>
            <select
              name="entrada_salida"
              value={formData.entrada_salida}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Área</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Ej: Seguridad, Administración"
            />
          </div>
          {/* ls
          </div> */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Observaciones adicionales"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Crear Reporte
          </button>
        </form>
      </div>
    </div>
  );
}

export default PersonalReport;
