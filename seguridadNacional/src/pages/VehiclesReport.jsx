import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReportTypes } from '../hooks/useReportTypes';
import { useForm } from '../hooks/useForm';
import { createReporte } from '../services/reporte.service';

function VehiclesReport() {
  const [searchParams] = useSearchParams();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();

  const { formData, setFormData, handleChange } = useForm({
    placa: '',
    marca: '',
    tipo: '',
    hora: new Date().toLocaleTimeString(),
  });

  // Efecto específico para la preselección por URL
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
      descripcion: `Vehículo Placa: ${formData.placa}, Marca/Modelo: ${formData.marca}`,
      fecha_creacion: new Date().toISOString(),
      status_reporte_id_status_reporte: 1,
      tipo_reporte_id_tipo_reporte: idTipoReporte,
      usuario_id_usuario_generador: 1, // Idealmente obtener del AuthContext
    };

    try {
      await createReporte(dataToSend);
      alert('Reporte de vehículo creado exitosamente');
      // Podrías resetear el formulario aquí si lo deseas
    } catch (error) {
      console.error('Error al crear reporte:', error);
      alert('Error al crear el reporte');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Ingreso/Salida de Vehículos</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Placa del Vehículo</label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Marca/Modelo</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
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
            {/* Input hidden para enviar el valor disabled */}
            <input type="hidden" name="tipo" value={formData.tipo} />
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