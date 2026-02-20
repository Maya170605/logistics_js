// Client/OverviewSection.js
import React from 'react';
import './OverviewSection.css';

const OverviewSection = ({ declarations, payments, user, onCreateDeclaration, onCreatePayment }) => {
  // Статистика
  const totalDeclarations = declarations.length;
  const totalPayments = payments.length;

  // Группировка по статусам (если есть поле status)
  const declStatusCount = declarations.reduce((acc, d) => {
    const status = d.status || 'Без статуса';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const paymentStatusCount = payments.reduce((acc, p) => {
    const status = p.status || 'Без статуса';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Общая сумма платежей (если есть поле amount)
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Последние 5 деклараций (сортировка по дате, если есть createdAt)
  const recentDeclarations = [...declarations]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Последние 5 платежей
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="overview-section">
      {/* Приветствие и быстрые действия */}
      <div className="welcome-header">
        <h2>Добро пожаловать, {user.name || user.username}!</h2>
        <div className="quick-actions">
          <button className="btn-secondary" onClick={onCreateDeclaration}>
            + Новая заявка
          </button>
          <button className="btn-secondary" onClick={onCreatePayment}>
            + Новый платёж
          </button>
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="stats-grid">
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
              Общая сумма: {totalAmount.toLocaleString()} ₽
            </div>
          )}
        </div>
      </div>

      {/* Последние декларации и платежи */}
      <div className="recent-section">
        <div className="recent-column">
          <h3>Последние декларации</h3>
          {recentDeclarations.length === 0 ? (
            <p className="no-data">Нет деклараций</p>
          ) : (
            <ul className="recent-list">
              {recentDeclarations.map(dec => (
                <li key={dec.id} className="recent-item">
                  <span className="item-id">№{dec.id}</span>
                  <span className={`item-status status-${dec.status?.toLowerCase() || 'unknown'}`}>
                    {dec.status || 'Неизвестно'}
                  </span>
                  <span className="item-date">
                    {dec.createdAt ? new Date(dec.createdAt).toLocaleDateString() : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="recent-column">
          <h3>Последние платежи</h3>
          {recentPayments.length === 0 ? (
            <p className="no-data">Нет платежей</p>
          ) : (
            <ul className="recent-list">
              {recentPayments.map(pay => (
                <li key={pay.id} className="recent-item">
                  <span className="item-id">№{pay.id}</span>
                  <span className={`item-status status-${pay.status?.toLowerCase() || 'unknown'}`}>
                    {pay.status || 'Неизвестно'}
                  </span>
                  <span className="item-amount">{pay.amount ? `${pay.amount} ₽` : ''}</span>
                  <span className="item-date">
                    {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString() : ''}
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

export default OverviewSection;