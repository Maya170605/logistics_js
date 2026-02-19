import React, { useState, useEffect } from 'react';
import { paymentAPI, declarationAPI, userAPI } from '../../../services/api';
import PaymentForm from '../Client/PaymentForm';
import AdminPaymentList from './AdminPaymentList';
import '../Client/Section.css';

const AdminPaymentsSection = ({ payments, onUpdate, onActivity }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [declarations, setDeclarations] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeclarations();
    loadUsers();
  }, []);

  const loadDeclarations = async () => {
    try {
      const res = await declarationAPI.getAll();
      setDeclarations(res.data);
    } catch (error) {
      console.error('Ошибка загрузки деклараций:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setAllUsers(res.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const handleAdd = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setSelectedClientId(payment.clientId);
    setShowForm(true);
  };

  const handleView = (payment) => {
    setViewingPayment(payment);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
    setSelectedClientId(null);
  };

  const handleCloseView = () => {
    setViewingPayment(null);
  };

  const handleSave = async (paymentData) => {
    try {
      setLoading(true);
      
      if (editingPayment) {
        await paymentAPI.update(editingPayment.id, paymentData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          const message = `Обновил платеж #${editingPayment.paymentNumber}`;
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
      } else {
        const response = await paymentAPI.create(paymentData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Создал новый платеж`;
          if (response.data?.paymentNumber) {
            message += ` #${response.data.paymentNumber}`;
          }
          if (response.data?.amount) {
            message += ` на сумму ${response.data.amount} ${response.data.currency || 'BYN'}`;
          }
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
      }
      
      onUpdate();
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка сохранения платежа:', error);
      alert('Ошибка сохранения платежа');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        setLoading(true);
        
        // Найдем платеж перед удалением для логирования
        const paymentToDelete = payments.find(p => p.id === id);
        
        if (!paymentToDelete) {
          alert('Платеж не найдена');
          return;
        }
        
        await paymentAPI.delete(id);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          const message = `Удалил платеж #${paymentToDelete.paymentNumber}`;
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
        
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления платежа:', error);
        alert('Ошибка удаления платежа');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      
      const payment = payments.find(p => p.id === id);
      
      if (!payment) {
        alert('Платеж не найден');
        return;
      }
      
      const oldStatus = payment.status;
      await paymentAPI.updateStatus(id, newStatus);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        let message = `Изменил статус платежа #${payment.paymentNumber}`;
        message += ` с "${oldStatus}" на "${newStatus}"`;
        if (payment.amount) {
          message += ` (${payment.amount} ${payment.currency || 'BYN'})`;
        }
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка изменения статуса платежа:', error);
      alert('Ошибка изменения статуса платежа');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (id) => {
    try {
      setLoading(true);
      
      const payment = payments.find(p => p.id === id);
      
      if (!payment) {
        alert('Платеж не найден');
        return;
      }
      
      await paymentAPI.process(id);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Обработал платеж #${payment.paymentNumber} (${payment.amount} ${payment.currency || 'BYN'})`;
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка обработки платежа:', error);
      alert('Ошибка обработки платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Платежи ({payments.length})</h2>
        <div className="section-actions">
          <button onClick={handleAdd} className="btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Добавить платеж'}
          </button>
          
          
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Обработка...</p>
        </div>
      )}

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          clientId={selectedClientId}
          declarations={declarations}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
          allUsers={allUsers}
          onStatusChange={handleStatusChange}
          onProcess={handleProcessPayment}
        />
      )}

      {viewingPayment && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр платежа</h3>
              <button onClick={handleCloseView} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Номер:</strong> {viewingPayment.paymentNumber}
              </div>
              <div className="detail-row">
                <strong>Клиент:</strong> {viewingPayment.clientName || viewingPayment.clientId}
              </div>
              <div className="detail-row">
                <strong>Сумма:</strong> {viewingPayment.amount} {viewingPayment.currency || 'BYN'}
              </div>
              <div className="detail-row">
                <strong>Тип:</strong> {viewingPayment.paymentType}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong>{' '}
                <span className={`status-badge status-${viewingPayment.status?.toLowerCase()}`}>
                  {viewingPayment.status}
                </span>
              </div>
              <div className="detail-row">
                <strong>Срок оплаты:</strong>{' '}
                {viewingPayment.dueDate
                  ? new Date(viewingPayment.dueDate).toLocaleDateString('ru-RU')
                  : 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Декларация:</strong> {viewingPayment.declarationNumber || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Дата создания:</strong>{' '}
                {new Date(viewingPayment.createdAt).toLocaleString('ru-RU')}
              </div>
              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {viewingPayment.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(viewingPayment.id, 'PAID');
                        handleCloseView();
                      }}
                      className="btn-approve"
                      style={{ flex: 1, minWidth: '120px' }}
                      disabled={loading}
                    >
                      ✓ Отметить как оплачено
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(viewingPayment.id, 'OVERDUE');
                        handleCloseView();
                      }}
                      className="btn-reject"
                      style={{ flex: 1, minWidth: '120px' }}
                      disabled={loading}
                    >
                      ⚠ Отметить как просрочено
                    </button>
                  </>
                )}
                {viewingPayment.status === 'PAID' && (
                  <button
                    onClick={() => {
                      handleStatusChange(viewingPayment.id, 'PENDING');
                      handleCloseView();
                    }}
                    className="btn-secondary-small"
                    style={{ flex: 1, minWidth: '120px' }}
                    disabled={loading}
                  >
                    ↻ Вернуть в ожидание
                  </button>
                )}
                {viewingPayment.status === 'OVERDUE' && (
                  <button
                    onClick={() => {
                      handleStatusChange(viewingPayment.id, 'PAID');
                      handleCloseView();
                    }}
                    className="btn-approve"
                    style={{ flex: 1, minWidth: '120px' }}
                    disabled={loading}
                  >
                    ✓ Отметить как оплачено
                  </button>
                )}
                
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseView} className="btn-secondary">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminPaymentList
        payments={payments}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onProcess={handleProcessPayment}
        loading={loading}
      />
      
      
    </div>
  );
};

export default AdminPaymentsSection;