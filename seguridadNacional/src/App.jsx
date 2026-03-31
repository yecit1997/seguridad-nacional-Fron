import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import Login from './components/Login';
import Layout from './components/Layout';
import Home from './pages/Home';
import PersonalReport from './pages/personal/PersonalReport';
import VehiclesReport from './pages/vehiculos/VehiculosReport';
import VehiclesList from './pages/vehiculos/VehiclesList';
import IncidentsReport from './pages/incidente/IncidentsReport';
import ApprovalReports from './pages/supervisor/ApprovalReports';
import Admin from './pages/admin/Admin';
import TipoReportes from './pages/report/TipoReportes';
import StatusReportes from './pages/report/StatusReportes';
import Personas from './pages/personas/Personas';
import Usuarios from './pages/usuarios/Usuarios';
import Alertas from './pages/alertas/Alertas';
import Supervisores from './pages/supervisores/Supervisores';
import Guardas from './pages/guardas/Guardas';
import Conductores from './pages/conductores/Conductores';
import Personal from './pages/personal/Personal';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ToastProvider>
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
              <Route path="personas" element={<Personas />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="alertas" element={<Alertas />} />
              <Route path="vehiculos" element={<VehiclesList />} />
              <Route path="supervisores" element={<Supervisores />} />
              <Route path="guardas" element={<Guardas />} />
              <Route path="conductores" element={<Conductores />} />
              <Route path="personal" element={<Personal />} />
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
    </ToastProvider>
  );
};

export default App;
