import React from 'react';
import TableReport from '../components/ListReport';

const Home = () => (
  <div className="bg-slate-50 min-h-screen p-6">
    {/* <div className="mb-6">
      <h1 className="text-4xl font-bold text-sky-700">Bienvenido al Panel de Seguridad</h1>
      <p className="text-sm text-slate-600 mt-2">Aquí puedes ver los reportes más recientes del sistema.</p>
    </div> */}

    <div className="bg-white rounded-lg shadow-md p-4">
      <TableReport />
    </div>
  </div>
);

export default Home;