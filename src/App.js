import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import HomePage from './components/Auth/HomePage'; // Добавьте этот импорт

import Register from './components/Auth/Register';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import DriverDashboard from './components/Dashboard/DriverDashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
             {/* Главная страница - теперь HomePage */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/client"
              element={
                <PrivateRoute allowedRoles={['CLIENT']}>
                  <ClientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <PrivateRoute allowedRoles={['DRIVER']}>
                  <DriverDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

