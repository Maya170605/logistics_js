import React, { useState } from 'react';
import { paymentAPI } from '../../../services/api';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';
import './Section.css';

const PaymentsSection = ({ payments, clientId, declarations, onUpdate, onActivity }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);

  const handleAdd = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleView = (payment) => {
    setViewingPayment(payment);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseView = () => {
    setViewingPayment(null);
  };

  const handleSave = async (paymentData) => {
    try {
      if (editingPayment) {
        await paymentAPI.update(editingPayment.id, paymentData);
        onActivity(`Платеж #${editingPayment.paymentNumber} обновлен`);
      } else {
        await paymentAPI.create(paymentData);
        onActivity('Платеж добавлен');
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
        onActivity('Платеж удален');
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления платежа:', error);
        alert('Ошибка удаления платежа');
      }
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
          clientId={clientId}
          declarations={declarations}
          onSave={handleSave}
          onCancel={handleCloseForm}
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
                <strong>Сумма:</strong> {viewingPayment.amount} {viewingPayment.currency}
              </div>
              <div className="detail-row">
                <strong>Тип:</strong> {viewingPayment.paymentType}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong> {viewingPayment.status}
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
            </div>
          </div>
        </div>
      )}

      <PaymentList
        payments={payments}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PaymentsSection;

