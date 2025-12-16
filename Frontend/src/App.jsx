import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Ministries from './pages/Ministries';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

import { useState } from 'react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <Navbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 p-8 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect logic based on user role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'admin') return '/admin';
    return '/home';
  };

  return (
    <Routes>
      {/* Public routes - no authentication needed */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Register />} />
      <Route path="/" element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Home />} />

      {/* Authenticated user routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/events" element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      } />

      <Route path="/donations" element={
        <ProtectedRoute>
          <Donations />
        </ProtectedRoute>
      } />

      <Route path="/membership" element={
        <ProtectedRoute>
          <Membership />
        </ProtectedRoute>
      } />

      <Route path="/ministries" element={
        <ProtectedRoute>
          <Ministries />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
