import React, { useState, useEffect } from 'react';
import { paymentAPI, declarationAPI, userAPI } from '../../../services/api';
import PaymentForm from '../Client/PaymentForm';
import AdminPaymentList from './AdminPaymentList';
import '../Client/Section.css';

const AdminPaymentsSection = ({ payments, onUpdate }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [declarations, setDeclarations] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

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
      if (editingPayment) {
        await paymentAPI.update(editingPayment.id, paymentData);
      } else {
        await paymentAPI.create(paymentData);
      }
      onUpdate();
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка сохранения платежа:', error);
      alert('Ошибка сохранения платежа');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        await paymentAPI.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления платежа:', error);
        alert('Ошибка удаления платежа');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await paymentAPI.updateStatus(id, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Ошибка изменения статуса платежа:', error);
      alert('Ошибка изменения статуса платежа');
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Платежи</h2>
        <button onClick={handleAdd} className="btn-primary">
          Добавить платеж
        </button>
      </div>

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          clientId={selectedClientId}
          declarations={declarations}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
          allUsers={allUsers}
          onStatusChange={async (id, newStatus) => {
            await handleStatusChange(id, newStatus);
            // Обновляем данные после изменения статуса
            onUpdate();
            // Обновляем редактируемый платеж с новым статусом
            if (editingPayment && editingPayment.id === id) {
              setEditingPayment({ ...editingPayment, status: newStatus });
            }
          }}
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
                <strong>Сумма:</strong> {viewingPayment.amount} {viewingPayment.currency}
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
                  >
                    ✓ Отметить как оплачено
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminPaymentList
        payments={payments}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPaymentsSection;

