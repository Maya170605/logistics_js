import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { declarationAPI, paymentAPI, activityAPI } from '../../services/api';
import DeclarationsSection from './Client/DeclarationsSection';
import PaymentsSection from './Client/PaymentsSection';
import ProfileSection from './Client/ProfileSection';
import ActivityLog from './Client/ActivityLog';
import './Dashboard.css';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('declarations');
  const [declarations, setDeclarations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Загружаем декларации и платежи
      const [declarationsRes, paymentsRes] = await Promise.all([
        declarationAPI.getByClient(user.id),
        paymentAPI.getByClient(user.id),
      ]);
      setDeclarations(declarationsRes.data);
      setPayments(paymentsRes.data);
      
      // Загружаем активности отдельно, чтобы ошибка не блокировала остальные данные
      try {
        const activitiesRes = await activityAPI.getRecentByUser(user.id, 20);
        setActivities(activitiesRes.data);
      } catch (activityError) {
        console.error('Ошибка загрузки активностей:', activityError);
        setActivities([]); // Устанавливаем пустой массив при ошибке
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
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

  const handleDeclarationChange = () => {
    loadData();
  };

  const handlePaymentChange = () => {
    loadData();
  };

  const handleProfileUpdate = () => {
    loadData();
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Панель клиента</h1>
        <div className="header-actions">
          <span className="user-name">Привет, {user.name || user.username}!</span>
          <a href="/" className="btn-link">Главная страница</a>
          <button onClick={logout} className="btn-secondary">
            Выйти
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
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
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
        </nav>

        <div className="dashboard-main">
          {activeTab === 'declarations' && (
            <DeclarationsSection
              declarations={declarations}
              clientId={user.id}
              onUpdate={handleDeclarationChange}
              onActivity={handleAddActivity}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentsSection
              payments={payments}
              clientId={user.id}
              declarations={declarations}
              onUpdate={handlePaymentChange}
              onActivity={handleAddActivity}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileSection
              user={user}
              onUpdate={handleProfileUpdate}
              onActivity={handleAddActivity}
            />
          )}
        </div>
      </div>

      <ActivityLog activities={activities} />
    </div>
  );
};

export default ClientDashboard;

