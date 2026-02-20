import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import VehicleList from './VehicleList';
import RentModal from './RentModal';
import '../Client/Section.css';
import './RentModal.css';


const VehiclesSection = ({ onActivity }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rented'); // По умолчанию показываем арендованные машины
  const [rentingVehicle, setRentingVehicle] = useState(null); // Машина, которую арендуют
  const [rentingLoading, setRentingLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [activeTab]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      if (activeTab === 'available') {
        const res = await vehicleAPI.getAvailable();
        setVehicles(res.data);
      } else {
        const res = await vehicleAPI.getRentedByDriver(user.id);
        setVehicles(res.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки машин:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (vehicle) => {
    setRentingVehicle(vehicle);
  };

  const handleRentConfirm = async (days) => {
    if (!rentingVehicle) return;

    try {
      setRentingLoading(true);
      
      await vehicleAPI.rent(rentingVehicle.id, days);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Арендовал машину ${rentingVehicle.licensePlate} на ${days} ${getDaysText(days)}`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      alert(`Машина успешно арендована на ${days} ${getDaysText(days)}!`);
      setRentingVehicle(null);
      loadVehicles();
    } catch (error) {
      console.error('Ошибка аренды машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка аренды машины';
      alert(errorMessage);
    } finally {
      setRentingLoading(false);
    }
  };

  const getDaysText = (days) => {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
  };

  const handleRentCancel = () => {
    setRentingVehicle(null);
  };

  const handleReturn = async (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const rentalEndDate = vehicle?.rentalEndDate 
      ? new Date(vehicle.rentalEndDate).toLocaleDateString('ru-RU')
      : 'N/A';
    
    const isEarlyReturn = vehicle?.rentalEndDate && new Date(vehicle.rentalEndDate) > new Date();
    const message = isEarlyReturn
      ? `Вы уверены, что хотите вернуть эту машину досрочно?\nПланируемая дата возврата: ${rentalEndDate}`
      : 'Вы уверены, что хотите вернуть эту машину?';
    
    if (window.confirm(message)) {
      try {
        setLoading(true);
        
        await vehicleAPI.return(vehicleId);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          const message = `Вернул машину ${vehicle?.licensePlate || vehicleId}`;
          
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
        
        alert('Машина успешно возвращена!');
        loadVehicles();
      } catch (error) {
        console.error('Ошибка возврата машины:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка возврата машины';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = async (vehicleId) => {
    try {
      const res = await vehicleAPI.getById(vehicleId);
      const vehicle = res.data;
      
      // Вызываем onActivity для логирования просмотра
      if (onActivity && typeof onActivity === 'function') {
        const message = `Просмотрел детали машины ${vehicle.licensePlate}`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      // Показываем детали в alert или можно сделать модальное окно
      const details = `
        Детали машины:
        • Госномер: ${vehicle.licensePlate}
        • Модель: ${vehicle.model || 'Не указано'}
        • Тип: ${vehicle.vehicleType || 'Не указано'}
        • Год выпуска: ${vehicle.yearOfManufacture || 'Не указано'}
        • Грузоподъемность: ${vehicle.capacity ? `${vehicle.capacity} т` : 'Не указано'}
        • Статус: ${vehicle.driverId ? 'В аренде' : vehicle.isAvailable ? 'Доступна' : 'Недоступна'}
        • Владелец: ${vehicle.clientName || `ID: ${vehicle.clientId}` || 'Не указано'}
      `;
      
      alert(details);
    } catch (error) {
      console.error('Ошибка получения деталей машины:', error);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Аренда машин</h2>
        <div className="section-actions">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('rented')}
              className={`filter-btn ${activeTab === 'rented' ? 'active' : ''}`}
            >
              Мои аренды {activeTab === 'rented' && `(${vehicles.length})`}
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`filter-btn ${activeTab === 'available' ? 'active' : ''}`}
            >
              Доступные для аренды
            </button>
          </div>
          
          
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Загрузка машин...</p>
        </div>
      )}

      {!loading && (
        <>
          <VehicleList
            vehicles={vehicles}
            activeTab={activeTab}
            onRent={handleRentClick}
            onReturn={handleReturn}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
          {rentingVehicle && (
            <RentModal
              vehicle={rentingVehicle}
              onClose={handleRentCancel}
              onConfirm={handleRentConfirm}
              loading={rentingLoading}
            />
          )}
        </>
      )}
      
      {/* Добавлен CSS для стилей */}
      <style jsx>{`
        .section-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }
        
        .filter-btn:hover:not(.active) {
          background: #e0e0e0;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }
        
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        
        
        
      `}</style>
    </div>
  );
};

export default VehiclesSection;