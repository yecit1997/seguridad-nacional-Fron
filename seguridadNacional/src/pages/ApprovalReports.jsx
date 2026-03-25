import React from 'react';
import TableReport from '../components/ListReport';

function ApprovalReports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Aprobación de Reportes</h1>
        <p className="text-gray-600">Revisa y aprueba los reportes pendientes</p>
      </div>
      <TableReport />
    </div>
  );
}

export default ApprovalReports;