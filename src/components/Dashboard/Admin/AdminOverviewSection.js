// Admin/AdminOverviewSection.js
import React from 'react';
// Стили уже подключены через Section.css, если нужно, можно добавить отдельный файл

const AdminOverviewSection = ({
  users,
  declarations,
  payments,
  vehicles,
  activities,
  onCreateUser,
  onCreateDeclaration,
  onCreatePayment,
  onCreateVehicle,
}) => {
  // Статистика по пользователям
  const totalUsers = users.length;
  const usersByRole = users.reduce((acc, u) => {
    const role = u.role || 'unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Статистика по декларациям
  const totalDeclarations = declarations.length;
  const declStatusCount = declarations.reduce((acc, d) => {
    const status = d.status || 'Без статуса';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Статистика по платежам
  const totalPayments = payments.length;
  const paymentStatusCount = payments.reduce((acc, p) => {
    const status = p.status || 'Без статуса';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Статистика по машинам с понятными статусами
  const totalVehicles = vehicles.length;
  const vehicleStatusCount = vehicles.reduce((acc, v) => {
    let status = v.status || 'Неизвестно';
    // Приводим к читаемому виду
    if (status === 'available') status = 'Доступна';
    else if (status === 'rented') status = 'В аренде';
    else if (status === 'unavailable') status = 'Недоступна';
    // Если есть другие статусы, можно добавить
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Дополнительно: количество доступных машин (если нужно)
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const rentedVehicles = vehicles.filter(v => v.status === 'rented').length;

  // Последние 5 активностей
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="overview-section">
      {/* Заголовок с быстрыми действиями */}
      <div className="section-header">
        <h2>Обзор системы</h2>
        
      </div>

      {/* Карточки статистики */}
      <div className="stats-grid">
        {/* Пользователи */}
        <div className="stat-card">
          <h3>Пользователи</h3>
          <div className="stat-number">{totalUsers}</div>
          <div className="stat-breakdown">
            {Object.entries(usersByRole).map(([role, count]) => (
              <span key={role} className="stat-item">
                <span className="stat-label">{role}:</span>
                <span className="stat-value">{count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Декларации */}
        <div className="stat-card">
          <h3>Декларации</h3>
          <div className="stat-number">{totalDeclarations}</div>
          <div className="stat-breakdown">
            {Object.entries(declStatusCount).map(([status, count]) => (
              <span key={status} className="stat-item">
                <span className="stat-label">{status}:</span>
                <span className="stat-value">{count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Платежи */}
        <div className="stat-card">
          <h3>Платежи</h3>
          <div className="stat-number">{totalPayments}</div>
          <div className="stat-breakdown">
            {Object.entries(paymentStatusCount).map(([status, count]) => (
              <span key={status} className="stat-item">
                <span className="stat-label">{status}:</span>
                <span className="stat-value">{count}</span>
              </span>
            ))}
          </div>
          {totalAmount > 0 && (
            <div className="total-amount">
              <span>Общая сумма:</span>
              <span>{totalAmount.toLocaleString()} ₽</span>
            </div>
          )}
        </div>

        {/* Машины */}
        <div className="stat-card">
          <h3>Машины</h3>
          <div className="stat-number">{totalVehicles}</div>
          <div className="stat-breakdown">
            {Object.entries(vehicleStatusCount).map(([status, count]) => (
              <span key={status} className="stat-item">
                <span className="stat-label">{status}:</span>
                <span className="stat-value">{count}</span>
              </span>
            ))}
          </div>
          
        </div>
      </div>

      {/* Последние активности */}
      <div className="recent-section">
        <div className="recent-column">
          <h3>Последние действия</h3>
          {recentActivities.length === 0 ? (
            <p className="no-data">Нет активностей</p>
          ) : (
            <ul className="recent-list">
              {recentActivities.map(act => (
                <li key={act.id} className="recent-item">
                  <span className="item-desc">{act.description || 'Действие'}</span>
                  <span className="item-date">
                    {act.createdAt ? new Date(act.createdAt).toLocaleString() : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewSection;