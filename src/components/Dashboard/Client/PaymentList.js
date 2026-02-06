import React from 'react';
import './List.css';

const PaymentList = ({ payments, onEdit, onView, onDelete }) => {
  if (payments.length === 0) {
    return <div className="empty-state">Нет платежей</div>;
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Сумма</th>
            <th>Валюта</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Срок оплаты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.paymentNumber || 'N/A'}</td>
              <td>{payment.amount}</td>
              <td>{payment.currency}</td>
              <td>{payment.paymentType || 'N/A'}</td>
              <td>
                <span className={`status-badge status-${payment.status?.toLowerCase()}`}>
                  {payment.status}
                </span>
              </td>
              <td>
                {payment.dueDate
                  ? new Date(payment.dueDate).toLocaleDateString('ru-RU')
                  : 'N/A'}
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onView(payment)} className="btn-view">
                    Просмотр
                  </button>
                  {payment.status !== 'PAID' && (
                    <button onClick={() => onEdit(payment)} className="btn-edit">
                      Редактировать
                    </button>
                  )}
                  <button onClick={() => onDelete(payment.id)} className="btn-delete">
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;

