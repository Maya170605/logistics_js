import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, declarationAPI, paymentAPI, vehicleAPI, activityAPI } from '../../services/api';
import AdminUsersSection from './Admin/UsersSection';
import AdminDeclarationsSection from './Admin/DeclarationsSection';
import AdminPaymentsSection from './Admin/PaymentsSection';
import AdminVehiclesSection from './Admin/VehiclesSection';
import ActivityLog from './Client/ActivityLog';
import AdminOverviewSection from './Admin/AdminOverviewSection'; // импортируем

import './Dashboard.css';


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleQuickCreateUser = () => setActiveTab('users');
  const handleQuickCreateDeclaration = () => setActiveTab('declarations');
  const handleQuickCreatePayment = () => setActiveTab('payments');
  const handleQuickCreateVehicle = () => setActiveTab('vehicles');

  useEffect(() => {
  console.log('AdminDashboard mounted, user:', user);
  console.log('Token:', localStorage.getItem('token'));
  
  // Тест аутентификации
  const testAuth = async () => {
    try {
      const res = await activityAPI.testAuth();
      console.log('Тест аутентификации успешен:', res.data);
    } catch (error) {
      console.error('Тест аутентификации провален:', error);
    }
  };
  
  testAuth();
  loadData();
}, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting data load...');
      
      // Загружаем основные данные
      const [usersRes, declarationsRes, paymentsRes, vehiclesRes] = await Promise.all([
        userAPI.getAllUsers(),
        declarationAPI.getAll(),
        paymentAPI.getAll(),
        vehicleAPI.getAll(),
      ]);
      
      console.log('Основные данные загружены');
      setUsers(usersRes.data);
      setDeclarations(declarationsRes.data);
      setPayments(paymentsRes.data);
      setVehicles(vehiclesRes.data);

    try {
      console.log('Загружаем активности для админа ID:', user.id);
      
      const activitiesRes = await activityAPI.getByUser(user.id);
      console.log('Активности загружены:', activitiesRes.data);
      
      setActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
      
    } catch (activityError) {
      console.error('Ошибка загрузки активностей:', activityError);
      // Фолбэк: попробуем загрузить все активности
      try {
        const allActivities = await activityAPI.getAll();
        setActivities(allActivities.data || []);
      } catch (e) {
        console.log('Используем тестовые данные...');
        setActivities(getMockActivities());
      }
    }
    
  } catch (error) {
    console.error('Общая ошибка загрузки данных:', error);
    setError('Ошибка загрузки данных: ' + error.message);
    setActivities([]);
  } finally {
    setLoading(false);
  }
};

  
  const handleAddActivity = async (description) => {
      try {
        await activityAPI.createForUser(user.username, description);
        const activitiesRes = await activityAPI.getRecentByUser(user.id, 20);
        setActivities(activitiesRes.data);
      } catch (error) {
        console.error('Ошибка добавления активности:', error);
      }
    };

  const handleUpdate = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка данных администратора...</p>
      </div>
    );
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

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={loadData} className="btn-retry">
            Повторить
          </button>
        </div>
      )}

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Обзор
        </button>
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
        {activeTab === 'overview' && (
          <AdminOverviewSection
            users={users}
            declarations={declarations}
            payments={payments}
            vehicles={vehicles}
            activities={activities}
            onCreateUser={handleQuickCreateUser}
            onCreateDeclaration={handleQuickCreateDeclaration}
            onCreatePayment={handleQuickCreatePayment}
            onCreateVehicle={handleQuickCreateVehicle}
          />
        )}
          {activeTab === 'users' && (
            <AdminUsersSection 
              users={users} 
              onUpdate={handleUpdate} 
              onActivity={handleAddActivity}
            />
          )}
          {activeTab === 'declarations' && (
            <AdminDeclarationsSection
              declarations={declarations}
              onUpdate={handleUpdate}
              onActivity={handleAddActivity}
            />
          )}
          {activeTab === 'payments' && (
            <AdminPaymentsSection 
              payments={payments} 
              onUpdate={handleUpdate} 
              onActivity={handleAddActivity}
            />
          )}
          {activeTab === 'vehicles' && (
            <AdminVehiclesSection 
              vehicles={vehicles} 
              onUpdate={handleUpdate} 
              onActivity={handleAddActivity}
            />
          )}
        </div>

        

        {/* ActivityLog - фиксированный снизу */}
        <div className="activity-log-container">
          <ActivityLog activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;