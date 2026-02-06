import React, { useState } from 'react';
import '../Client/Section.css';
import '../Client/Form.css';
import './RentModal.css';

const RentModal = ({ vehicle, onClose, onConfirm }) => {
  const [days, setDays] = useState(30);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (days <= 0 || days > 365) {
      setError('Количество дней должно быть от 1 до 365');
      return;
    }

    onConfirm(days);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content rent-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Аренда машины</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="vehicle-info">
            <p><strong>Госномер:</strong> {vehicle.licensePlate}</p>
            <p><strong>Модель:</strong> {vehicle.model || 'N/A'}</p>
            <p><strong>Тип:</strong> {vehicle.vehicleType || 'N/A'}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="days">Срок аренды (дней):</label>
              <input
                type="number"
                id="days"
                min="1"
                max="365"
                value={days}
                onChange={(e) => {
                  setDays(parseInt(e.target.value) || 1);
                  setError('');
                }}
                required
                className={error ? 'error' : ''}
              />
              {error && <div className="error-message">{error}</div>}
              <small>Минимум 1 день, максимум 365 дней</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Арендовать
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RentModal;

