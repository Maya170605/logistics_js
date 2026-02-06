import React from 'react';
import { useAuth } from '../../context/AuthContext';
import VehiclesSection from './Driver/VehiclesSection';
import './Dashboard.css';

const DriverDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Панель водителя</h1>
        <div className="header-actions">
          <span className="user-name">Привет, {user.username}!</span>
          <a href="/" className="btn-link">Главная страница</a>
          <button onClick={logout} className="btn-secondary">
            Выйти
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <VehiclesSection />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

