import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReportTypes } from '../../hooks/useReportTypes';
import { useForm } from '../../hooks/useForm';
import { useVehicles } from '../../hooks/useVehicles';
import { createReporte, getStatusReporteByNombre } from '../../services/api.service';
import { useAuth } from '../../contexts/AuthContext';

function VehiclesReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();
  const { vehiculos, loading: loadingVehiculos } = useVehicles();
  const [statusId, setStatusId] = useState(1);

  const { formData, setFormData, handleChange } = useForm({
    placa: '',
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
      let tipoElegido = tipoSeleccionado;
      
      if (!tipoElegido) {
        const tipoVehiculo = tipos.find(t => t.nombre === 'Entrada/Salida Vehículos');
        if (tipoVehiculo) {
          tipoElegido = tipoVehiculo.nombre;
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

  const handlePlacaChange = (e) => {
    const selectedPlaca = e.target.value;
    setFormData(prev => ({
      ...prev,
      placa: selectedPlaca,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tipoEncontrado = tipos.find(t => t.nombre === formData.tipo);
    const idTipoReporte = tipoEncontrado ? (tipoEncontrado.id || tipoEncontrado.id_tipo_reporte) : 1;

    const vehiculoSeleccionado = vehiculos.find(v => v.placa === formData.placa);
    const vehiculoId = vehiculoSeleccionado?.id_vehiculo;

    const userId = user?.usuario?.id_usuario || 1;

    const dataToSend = {
      descripcion: formData.descripcion || `Registro de ${formData.entrada_salida} de vehículo - Placa: ${formData.placa}`,
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
      vehiculo_id_vehiculo: vehiculoId
    };

    console.log("Enviando reporte de vehículo:", dataToSend);

    try {
      await createReporte(dataToSend);
      alert('Reporte de vehículo creado exitosamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al crear reporte:', error);
      alert('Error al crear el reporte: ' + (error.message || 'Error desconocido'));
    }
  };

  if (loading || loadingVehiculos) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Ingreso/Salida de Vehículos</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Placa del Vehículo</label>
            <select
              name="placa"
              value={formData.placa}
              onChange={handlePlacaChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              required
            >
              <option value="">Seleccione una placa</option>
              {vehiculos.map((v) => (
                <option key={v.id_vehiculo || v.id} value={v.placa}>
                  {v.placa} - {v.marca_modelo || v.marca || ''}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 cursor-not-allowed"
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
            <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Crear Reporte
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehiclesReport;
