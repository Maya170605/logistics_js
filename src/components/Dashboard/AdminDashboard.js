import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, declarationAPI, paymentAPI, vehicleAPI } from '../../services/api';
import AdminUsersSection from './Admin/UsersSection';
import AdminDeclarationsSection from './Admin/DeclarationsSection';
import AdminPaymentsSection from './Admin/PaymentsSection';
import AdminVehiclesSection from './Admin/VehiclesSection';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, declarationsRes, paymentsRes, vehiclesRes] = await Promise.all([
        userAPI.getAllUsers(),
        declarationAPI.getAll(),
        paymentAPI.getAll(),
        vehicleAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setDeclarations(declarationsRes.data);
      setPayments(paymentsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadData();
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Панель администратора</h1>
        <div className="header-actions">
          <span className="user-name">Привет, {user.username}!</span>
          <a href="/" className="btn-link">Главная страница</a>
          <button onClick={logout} className="btn-secondary">
            Выйти
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
          <button
            className={activeTab === 'declarations' ? 'active' : ''}
            onClick={() => setActiveTab('declarations')}
          >
            Декларации
          </button>
          <button
            className={activeTab === 'payments' ? 'active' : ''}
            onClick={() => setActiveTab('payments')}
          >
            Платежи
          </button>
          <button
            className={activeTab === 'vehicles' ? 'active' : ''}
            onClick={() => setActiveTab('vehicles')}
          >
            Машины
          </button>
        </nav>

        <div className="dashboard-main">
          {activeTab === 'users' && (
            <AdminUsersSection users={users} onUpdate={handleUpdate} />
          )}
          {activeTab === 'declarations' && (
            <AdminDeclarationsSection
              declarations={declarations}
              onUpdate={handleUpdate}
            />
          )}
          {activeTab === 'payments' && (
            <AdminPaymentsSection payments={payments} onUpdate={handleUpdate} />
          )}
          {activeTab === 'vehicles' && (
            <AdminVehiclesSection vehicles={vehicles} onUpdate={handleUpdate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

