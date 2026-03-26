import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Home from './pages/Home';
import Reportes from './pages/Reportes';
import PersonalReport from './pages/PersonalReport';
import VehiclesReport from './pages/VehiclesReport';
import IncidentsReport from './pages/IncidentsReport';
import ApprovalReports from './pages/ApprovalReports';
import Admin from './pages/Admin';
import TipoReportes from './pages/TipoReportes';
import StatusReportes from './pages/StatusReportes';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Contenido del Dashboard...</p></div>} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Usuarios</h1><p>Gestión de usuarios...</p></div>} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="reportes/personal" element={<PersonalReport />} />
            <Route path="reportes/vehiculos" element={<VehiclesReport />} />
            <Route path="reportes/incidentes" element={<IncidentsReport />} />
            <Route path="reportes/aprobacion" element={<ApprovalReports />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin/tipos-reportes" element={<TipoReportes />} />
            <Route path="admin/status-reportes" element={<StatusReportes />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
