import React, { useState, useEffect } from 'react';
import '../Client/Form.css';

const VehicleForm = ({ vehicle, clientId, onSave, onCancel, isAdmin = false, allUsers = [] }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    licensePlate: '',
    model: '',
    vehicleType: '',
    yearOfManufacture: '',
    capacity: '',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        clientId: vehicle.clientId || '',
        licensePlate: vehicle.licensePlate || '',
        model: vehicle.model || '',
        vehicleType: vehicle.vehicleType || '',
        yearOfManufacture: vehicle.yearOfManufacture || '',
        capacity: vehicle.capacity || '',
      });
    } else if (clientId) {
      setFormData(prev => ({ ...prev, clientId }));
    }
  }, [vehicle, clientId]);

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
      licensePlate: formData.licensePlate,
      model: formData.model || null,
      vehicleType: formData.vehicleType || null,
      yearOfManufacture: formData.yearOfManufacture ? parseInt(formData.yearOfManufacture) : null,
      capacity: formData.capacity ? parseFloat(formData.capacity) : null,
    };
    onSave(data);
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h3>{vehicle ? 'Редактировать машину' : 'Добавить машину'}</h3>
        <form onSubmit={handleSubmit}>
          {isAdmin && (
            <div className="form-group">
              <label>Клиент (владелец) *</label>
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
            <label>Госномер *</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              required
              placeholder="AB1234CD"
            />
          </div>

          <div className="form-group">
            <label>Модель</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Volvo FH16"
            />
          </div>

          <div className="form-group">
            <label>Тип</label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="грузовик, фура, легковой и т.д."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Год выпуска</label>
              <input
                type="number"
                name="yearOfManufacture"
                value={formData.yearOfManufacture}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2020"
              />
            </div>

            <div className="form-group">
              <label>Грузоподъемность (т)</label>
              <input
                type="number"
                step="0.01"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="0"
                placeholder="20.0"
              />
            </div>
          </div>

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

export default VehicleForm;

