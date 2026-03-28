import { createReporte } from "../../services/reporte.service";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReportTypes } from '../../hooks/useReportTypes';
import { useForm } from '../../hooks/useForm';

function PersonalReport() {
  const [searchParams] = useSearchParams();
  const tipoSeleccionado = searchParams.get('tipo');
  const { tipos, loading } = useReportTypes();

  const { formData, setFormData, handleChange } = useForm({
    dni: '', //Documento de la persona a la cual se le hace el reporte
    departamento: '',
    tipo: '',
    descripcion: '',
    fecha_creacion: new Date().toLocaleTimeString(),
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

  // Buscamos el objeto del tipo seleccionado para obtener su ID
  const tipoEncontrado = tipos.find(t => t.nombre === formData.tipo);
  const idTipoReporte = tipoEncontrado ? (tipoEncontrado.id || tipoEncontrado.id_tipo_reporte) : 1;

  // Construimos el objeto con la estructura exacta que solicitaste
  // Eliminamos id_reporte para que la DB lo genere automáticamente
  const dataToSend = {
    descripcion: `Personal DNI: ${formData.dni}, Depto: ${formData.departamento}. Obs: ${formData.descripcion}`,
    fecha_creacion: new Date().toISOString(), // Genera el formato 2026-03-14T04:17:17.000Z
    status_reporte_id_status_reporte: 1,
    tipo_reporte_id_tipo_reporte: idTipoReporte,
    usuario_id_usuario_generador: 1,
  };

  try {
    await createReporte(dataToSend);

    alert("Reporte creado exitosamente");

    // Resetear formulario (opcional)
    setFormData({
      dni: '',
      departamento: '',
      tipo: '',
      descripcion: '',
      fecha_creacion: new Date().toLocaleTimeString(),
    });

  } catch (error) {
    console.error("Error al crear reporte", error);
    alert("Error al crear reporte");
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reporte de Ingreso/Salida de Personal</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Departamento</label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
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
            <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Hora</label>
            <input
              type="time"
              name="fecha_creacion"
              value={formData.fecha_creacion}
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