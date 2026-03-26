import React, { useState } from 'react';

const StatusReportes = () => {
  const [status, setStatus] = useState('');
  const [items, setItems] = useState(['Activo', 'Completado', 'Creado', 'Devuelto']);

  const addStatus = (e) => {
    e.preventDefault();
    if (!status.trim()) return;
    if (items.includes(status.trim())) return;
    setItems([...items, status.trim()]);
    setStatus('');
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Statuses de Reporte</h1>
        <p className="text-gray-600 mb-4">Crea y administra estados de reporte (activo, completado, etc.)</p>
        <form onSubmit={addStatus} className="flex gap-2 mb-4">
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Nuevo status"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Agregar</button>
        </form>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="px-4 py-2 border rounded-lg bg-gray-50">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatusReportes;
