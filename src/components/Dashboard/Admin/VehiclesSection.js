import React, { useState, useEffect } from 'react';
import { vehicleAPI, userAPI } from '../../../services/api';
import AdminVehicleList from './AdminVehicleList';
import VehicleForm from '../Driver/VehicleForm';
import '../Client/Section.css';

const AdminVehiclesSection = ({ vehicles, onUpdate }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'available', 'rented'

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setAllUsers(res.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleView = (vehicle) => {
    setViewingVehicle(vehicle);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleCloseView = () => {
    setViewingVehicle(null);
  };

  const handleSave = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id, vehicleData);
      } else {
        await vehicleAPI.create(vehicleData);
      }
      onUpdate();
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка сохранения машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка сохранения машины';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту машину?')) {
      try {
        await vehicleAPI.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления машины:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка удаления машины';
        alert(errorMessage);
      }
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeFilter === 'available') {
      return vehicle.isAvailable && !vehicle.driverId;
    } else if (activeFilter === 'rented') {
      return vehicle.driverId != null;
    }
    return true; // 'all'
  });

  return (
    <div className="section">
      <div className="section-header">
        <h2>Машины</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                ...(activeFilter === 'all'
                  ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
                  : { background: '#f0f0f0', color: '#333', border: '1px solid #ddd' })
              }}
            >
              Все
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                ...(activeFilter === 'available'
                  ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
                  : { background: '#f0f0f0', color: '#333', border: '1px solid #ddd' })
              }}
            >
              Доступные
            </button>
            <button
              onClick={() => setActiveFilter('rented')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                ...(activeFilter === 'rented'
                  ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
                  : { background: '#f0f0f0', color: '#333', border: '1px solid #ddd' })
              }}
            >
              В аренде
            </button>
          </div>
          <button onClick={handleAdd} className="btn-primary">
            Добавить машину
          </button>
        </div>
      </div>

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          allUsers={allUsers}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
        />
      )}

      {viewingVehicle && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр машины</h3>
              <button onClick={handleCloseView} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Госномер:</strong> {viewingVehicle.licensePlate}
              </div>
              <div className="detail-row">
                <strong>Модель:</strong> {viewingVehicle.model || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Тип:</strong> {viewingVehicle.vehicleType || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Год выпуска:</strong> {viewingVehicle.yearOfManufacture || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Грузоподъемность:</strong> {viewingVehicle.capacity ? `${viewingVehicle.capacity} т` : 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Владелец:</strong> {viewingVehicle.clientName || `ID: ${viewingVehicle.clientId}`}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong>{' '}
                {viewingVehicle.driverId ? (
                  <span style={{ color: '#ff9800', fontWeight: 'bold' }}>
                    В аренде (Водитель: {viewingVehicle.driverName || `ID: ${viewingVehicle.driverId}`})
                  </span>
                ) : (
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Доступна</span>
                )}
              </div>
              {viewingVehicle.driverId && (
                <>
                  <div className="detail-row">
                    <strong>Дата начала аренды:</strong>{' '}
                    {viewingVehicle.rentalStartDate
                      ? new Date(viewingVehicle.rentalStartDate).toLocaleString('ru-RU')
                      : 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Дата окончания аренды:</strong>{' '}
                    {viewingVehicle.rentalEndDate
                      ? new Date(viewingVehicle.rentalEndDate).toLocaleString('ru-RU')
                      : 'N/A'}
                  </div>
                </>
              )}
              <div className="detail-row">
                <strong>Дата создания:</strong>{' '}
                {viewingVehicle.createdAt
                  ? new Date(viewingVehicle.createdAt).toLocaleString('ru-RU')
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminVehicleList
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminVehiclesSection;

