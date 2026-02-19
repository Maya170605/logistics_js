import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { activityAPI } from '../../services/api';
import VehiclesSection from './Driver/VehiclesSection';
import './Dashboard.css';

const ActivityLog = ({ activities }) => {
  // Убедитесь, что activities существует
  if (!activities || !Array.isArray(activities)) {
    return <div className="activity-log">Нет данных об активностях</div>;
  }

  if (activities.length === 0) {
    return <div className="activity-log">Нет активностей</div>;
  }

  return (
    <div className="activity-log">
      <h3>Активности</h3>
      <div className="activity-list">
        {activities.map((activity) => {
          // Используйте правильное поле для даты
          const activityDate = activity.activityDate || activity.createdAt;
          return (
            <div key={activity.id || activity.activityId} className="activity-item">
              <div className="activity-description">{activity.description}</div>
              <div className="activity-date">
                {activityDate ? new Date(activityDate).toLocaleString('ru-RU') : 'Нет даты'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('DriverDashboard mounted, user:', user);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Загружаем данные для водителя...');
      
      // Загружаем активности
      try {
        const activitiesRes = await activityAPI.getRecentByUser(user.id, 20);
        console.log('Активности водителя загружены:', activitiesRes.data);
        setActivities(activitiesRes.data || []);
      } catch (activityError) {
        console.error('Ошибка загрузки активностей:', activityError);
        setActivities([]);
      }
      
    } catch (error) {
      console.error('Общая ошибка загрузки данных:', error);
      setError('Ошибка загрузки данных');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (description) => {
    try {
      console.log('🚀 Водитель: Добавление активности:', description);
      console.log('👤 Водитель username:', user?.username);
      console.log('🆔 Водитель ID:', user?.id);
      
      await activityAPI.createForUserId(user.id, { description });
      
      console.log('✅ Активность создана');
      
      // Обновляем список активностей
      const activitiesRes = await activityAPI.getRecentByUser(user.id, 20);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('❌ Ошибка добавления активности:', error);
      console.error('❌ Детали ошибки:', error.response?.data || error.message);
      
      const newActivity = {
        id: Date.now(),
        description,
        activityDate: new Date().toISOString()
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  const handleUpdate = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка данных водителя...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Панель водителя</h1>
        <div className="header-actions">
          <span className="user-name">Привет, {user.name || user.username}!</span>
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
        <div className="dashboard-main">
          <VehiclesSection 
            onActivity={handleAddActivity}
          />
        </div>
      </div>

      {/* ActivityLog - фиксированный снизу */}
      <div className="activity-log-container">
        <ActivityLog activities={activities} />
      </div>
    </div>
  );
};

export default DriverDashboard;