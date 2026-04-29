import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import RoomInfo from './pages/student/RoomInfo';
import WardenDashboard from './pages/warden/Dashboard';
import WardenComplaints from './pages/warden/Complaints';
import MaintenanceDashboard from './pages/maintenance/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRooms from './pages/admin/Rooms';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  const defaultRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'warden') return '/warden/dashboard';
    if (user.role === 'maintenance') return '/maintenance/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRedirect()} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/complaints/new" element={<ProtectedRoute roles={['student']}><SubmitComplaint /></ProtectedRoute>} />
      <Route path="/student/complaints" element={<ProtectedRoute roles={['student']}><MyComplaints /></ProtectedRoute>} />
      <Route path="/student/room" element={<ProtectedRoute roles={['student']}><RoomInfo /></ProtectedRoute>} />

      {/* Warden */}
      <Route path="/warden/dashboard" element={<ProtectedRoute roles={['warden']}><WardenDashboard /></ProtectedRoute>} />
      <Route path="/warden/complaints" element={<ProtectedRoute roles={['warden']}><WardenComplaints /></ProtectedRoute>} />

      {/* Maintenance */}
      <Route path="/maintenance/dashboard" element={<ProtectedRoute roles={['maintenance']}><MaintenanceDashboard /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/rooms" element={<ProtectedRoute roles={['admin']}><AdminRooms /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
