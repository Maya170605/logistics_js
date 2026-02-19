import React, { useState, useEffect } from 'react';
import { vehicleAPI, userAPI } from '../../../services/api';
import AdminVehicleList from './AdminVehicleList';
import VehicleForm from '../Driver/VehicleForm';
import '../Client/Section.css';

const AdminVehiclesSection = ({ vehicles, onUpdate, onActivity }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id, vehicleData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Обновил машину: ${vehicleData.licensePlate || editingVehicle.licensePlate}`;
          
          // Добавляем детали изменений
          const changes = [];
          if (vehicleData.model && vehicleData.model !== editingVehicle.model) {
            changes.push(`модель: "${editingVehicle.model}" → "${vehicleData.model}"`);
          }
          if (vehicleData.vehicleType && vehicleData.vehicleType !== editingVehicle.vehicleType) {
            changes.push(`тип: "${editingVehicle.vehicleType}" → "${vehicleData.vehicleType}"`);
          }
          if (vehicleData.capacity && vehicleData.capacity !== editingVehicle.capacity) {
            changes.push(`грузоподъемность: "${editingVehicle.capacity}" → "${vehicleData.capacity}" т`);
          }
          if (vehicleData.clientId && vehicleData.clientId !== editingVehicle.clientId) {
            const oldOwner = allUsers.find(u => u.id === editingVehicle.clientId);
            const newOwner = allUsers.find(u => u.id === vehicleData.clientId);
            changes.push(`владелец: "${oldOwner?.username || editingVehicle.clientId}" → "${newOwner?.username || vehicleData.clientId}"`);
          }
          
          if (changes.length > 0) {
            message += ` (${changes.join(', ')})`;
          } else {
            message += ` (без изменений данных)`;
          }
          
          message += ` (ID: ${editingVehicle.id})`;
          
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
      } else {
        const response = await vehicleAPI.create(vehicleData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Добавил новую машину: ${vehicleData.licensePlate}`;
          
          if (vehicleData.model) {
            message += ` (${vehicleData.model})`;
          }
          if (vehicleData.vehicleType) {
            message += `, тип: ${vehicleData.vehicleType}`;
          }
          if (vehicleData.capacity) {
            message += `, грузоподъемность: ${vehicleData.capacity} т`;
          }
          
          if (vehicleData.clientId) {
            const owner = allUsers.find(u => u.id === vehicleData.clientId);
            message += `, владелец: ${owner?.username || vehicleData.clientId}`;
          }
          
          if (response.data && response.data.id) {
            message += ` (ID: ${response.data.id})`;
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
      console.error('Ошибка сохранения машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка сохранения машины';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const vehicleToDelete = vehicles.find(v => v.id === id);
    
    if (!vehicleToDelete) {
      alert('Машина не найдена');
      return;
    }
    
    if (!window.confirm(`Удалить машину "${vehicleToDelete.licensePlate}"?\n\nЭто действие нельзя отменить.`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      await vehicleAPI.delete(id);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        let message = `Удалил машину: ${vehicleToDelete.licensePlate}`;
        if (vehicleToDelete.model) {
          message += ` (${vehicleToDelete.model})`;
        }
        if (vehicleToDelete.vehicleType) {
          message += `, тип: ${vehicleToDelete.vehicleType}`;
        }
        message += ` (ID: ${id})`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка удаления машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка удаления машины';
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async (vehicleId, driverId, days) => {
    try {
      setLoading(true);
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      const driver = allUsers.find(u => u.id === driverId);
      
      if (!vehicle) {
        alert('Машина не найдена');
        return;
      }
      
      if (!driver) {
        alert('Водитель не найден');
        return;
      }
      
      const response = await vehicleAPI.rent(vehicleId, days);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Выдал машину ${vehicle.licensePlate} в аренду водителю ${driver.username} на ${days} дней`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка аренды машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка аренды машины';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (vehicleId) => {
    try {
      setLoading(true);
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      
      if (!vehicle) {
        alert('Машина не найдена');
        return;
      }
      
      const response = await vehicleAPI.return(vehicleId);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Принял машину ${vehicle.licensePlate} из аренды`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка возврата машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка возврата машины';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (vehicleId, driverId) => {
    try {
      setLoading(true);
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      const driver = allUsers.find(u => u.id === driverId);
      
      if (!vehicle) {
        alert('Машина не найдена');
        return;
      }
      
      // Обновляем машину с новым водителем
      await vehicleAPI.update(vehicleId, {
        ...vehicle,
        driverId: driverId || null
      });
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        let message;
        if (driverId) {
          message = `Назначил машину ${vehicle.licensePlate} водителю ${driver?.username || driverId}`;
        } else {
          message = `Отвязал водителя от машины ${vehicle.licensePlate}`;
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
      console.error('Ошибка назначения водителя:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка назначения водителя';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (vehicleId, isAvailable) => {
    try {
      setLoading(true);
      
      const vehicle = vehicles.find(v => v.id === vehicleId);
      
      if (!vehicle) {
        alert('Машина не найдена');
        return;
      }
      
      await vehicleAPI.update(vehicleId, {
        ...vehicle,
        isAvailable: isAvailable
      });
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const status = isAvailable ? 'доступна' : 'недоступна';
        const message = `Изменил статус машины ${vehicle.licensePlate} на "${status}"`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка изменения статуса';
      alert(errorMessage);
    } finally {
      setLoading(false);
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
        <h2>Машины ({filteredVehicles.length}/{vehicles.length})</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn-primary ${activeFilter === 'all' ? 'active' : ''}`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`btn-primary ${activeFilter === 'available' ? 'active' : ''}`}
            >
              Доступные
            </button>
            <button
              onClick={() => setActiveFilter('rented')}
              className={`btn-primary ${activeFilter === 'rented' ? 'active' : ''}`}
            >
              В аренде
            </button>
          </div>
          <button onClick={handleAdd} className="btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Добавить машину'}
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
        <VehicleForm
          vehicle={editingVehicle}
          allUsers={allUsers}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
          loading={loading}
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
                <strong>ID:</strong> {viewingVehicle.id}
              </div>
              <div className="detail-row">
                <strong>Госномер:</strong> {viewingVehicle.licensePlate}
              </div>
              <div className="detail-row">
                <strong>Модель:</strong> {viewingVehicle.model || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Тип:</strong> {viewingVehicle.vehicleType || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Год выпуска:</strong> {viewingVehicle.yearOfManufacture || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Грузоподъемность:</strong> {viewingVehicle.capacity ? `${viewingVehicle.capacity} т` : 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Владелец:</strong> {viewingVehicle.clientName || `ID: ${viewingVehicle.clientId}` || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong>{' '}
                {viewingVehicle.driverId ? (
                  <span className="status-badge rented">
                    В аренде (Водитель: {viewingVehicle.driverName || `ID: ${viewingVehicle.driverId}`})
                  </span>
                ) : viewingVehicle.isAvailable ? (
                  <span className="status-badge available">Доступна</span>
                ) : (
                  <span className="status-badge unavailable">Недоступна</span>
                )}
              </div>
              {viewingVehicle.driverId && (
                <>
                  <div className="detail-row">
                    <strong>Дата начала аренды:</strong>{' '}
                    {viewingVehicle.rentalStartDate
                      ? new Date(viewingVehicle.rentalStartDate).toLocaleString('ru-RU')
                      : 'Не указано'}
                  </div>
                  <div className="detail-row">
                    <strong>Дата окончания аренды:</strong>{' '}
                    {viewingVehicle.rentalEndDate
                      ? new Date(viewingVehicle.rentalEndDate).toLocaleString('ru-RU')
                      : 'Не указано'}
                  </div>
                </>
              )}
              <div className="detail-row">
                <strong>Дата создания:</strong>{' '}
                {viewingVehicle.createdAt
                  ? new Date(viewingVehicle.createdAt).toLocaleString('ru-RU')
                  : 'Не указано'}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleEdit(viewingVehicle)} className="btn-primary">
                Редактировать
              </button>
              <button onClick={handleCloseView} className="btn-secondary">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminVehicleList
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onRent={handleRent}
        onReturn={handleReturn}
        onAssignDriver={handleAssignDriver}
        onChangeStatus={handleChangeStatus}
        allUsers={allUsers}
        loading={loading}
      />
      
      
    </div>
  );
};

export default AdminVehiclesSection;