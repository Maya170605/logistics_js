import React, { useState, useEffect } from 'react';
import './Form.css';

const PaymentForm = ({ payment, clientId, declarations, onSave, onCancel, isAdmin = false, allUsers = [], onStatusChange }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    declarationId: '',
    amount: '',
    currency: 'BYN',
    paymentType: '',
    dueDate: '',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        clientId: payment.clientId || '',
        declarationId: payment.declarationId || '',
        amount: payment.amount || '',
        currency: payment.currency || 'BYN',
        paymentType: payment.paymentType || '',
        dueDate: payment.dueDate
          ? new Date(payment.dueDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      clientId: isAdmin ? formData.clientId : clientId,
      declarationId: formData.declarationId || null,
      amount: parseFloat(formData.amount) || 0,
      currency: formData.currency,
      paymentType: formData.paymentType || null,
      dueDate: formData.dueDate || null,
    };
    onSave(data);
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h3>{payment ? 'Редактировать платеж' : 'Добавить платеж'}</h3>
        <form onSubmit={handleSubmit}>
          {isAdmin && (
            <div className="form-group">
              <label>Клиент *</label>
              <select
                name="clientId"
                value={formData.clientId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Выберите клиента</option>
                {allUsers
                  .filter((u) => u.role === 'CLIENT')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Декларация</label>
            <select
              name="declarationId"
              value={formData.declarationId}
              onChange={handleChange}
            >
              <option value="">Не выбрано</option>
              {declarations.map((decl) => (
                <option key={decl.id} value={decl.id}>
                  {decl.declarationNumber || `Декларация #${decl.id}`}
                  {isAdmin && decl.clientName ? ` (${decl.clientName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Сумма *</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Валюта</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="BYN">BYN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Тип платежа</label>
            <input
              type="text"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Срок оплаты</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          {isAdmin && payment && (
            <div className="form-group">
              <label>Текущий статус</label>
              <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '5px', marginBottom: '10px' }}>
                <span className={`status-badge status-${payment.status?.toLowerCase()}`}>
                  {payment.status}
                </span>
              </div>
              <label>Изменить статус</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {payment.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Отметить платеж как оплаченный?')) {
                          onStatusChange(payment.id, 'PAID');
                        }
                      }}
                      className="btn-approve"
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      ✓ Оплачено
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Отметить платеж как просроченный?')) {
                          onStatusChange(payment.id, 'OVERDUE');
                        }
                      }}
                      className="btn-reject"
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      ⚠ Просрочено
                    </button>
                  </>
                )}
                {payment.status === 'PAID' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Вернуть платеж в статус ожидания?')) {
                        onStatusChange(payment.id, 'PENDING');
                      }
                    }}
                    className="btn-secondary-small"
                    style={{ flex: 1, minWidth: '120px' }}
                  >
                    ↻ В ожидание
                  </button>
                )}
                {payment.status === 'OVERDUE' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Отметить платеж как оплаченный?')) {
                        onStatusChange(payment.id, 'PAID');
                      }
                    }}
                    className="btn-approve"
                    style={{ flex: 1, minWidth: '120px' }}
                  >
                    ✓ Оплачено
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

