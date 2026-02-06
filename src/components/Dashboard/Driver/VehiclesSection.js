import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import VehicleList from './VehicleList';
import RentModal from './RentModal';
import '../Client/Section.css';

const VehiclesSection = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rented'); // По умолчанию показываем арендованные машины
  const [rentingVehicle, setRentingVehicle] = useState(null); // Машина, которую арендуют

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
      await vehicleAPI.rent(rentingVehicle.id, days);
      alert(`Машина успешно арендована на ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}!`);
      setRentingVehicle(null);
      loadVehicles();
    } catch (error) {
      console.error('Ошибка аренды машины:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка аренды машины';
      alert(errorMessage);
    }
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
        await vehicleAPI.return(vehicleId);
        alert('Машина успешно возвращена!');
        loadVehicles();
      } catch (error) {
        console.error('Ошибка возврата машины:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка возврата машины';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Аренда машин</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('rented')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s',
              ...(activeTab === 'rented' 
                ? {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }
                : {
                    background: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd'
                  })
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'rented') {
                e.target.style.background = '#e0e0e0';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'rented') {
                e.target.style.background = '#f0f0f0';
              }
            }}
          >
            Мои аренды {activeTab === 'rented' && `(${vehicles.length})`}
          </button>
          <button
            onClick={() => setActiveTab('available')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s',
              ...(activeTab === 'available' 
                ? {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }
                : {
                    background: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd'
                  })
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'available') {
                e.target.style.background = '#e0e0e0';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'available') {
                e.target.style.background = '#f0f0f0';
              }
            }}
          >
            Доступные для аренды
          </button>
        </div>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <VehicleList
            vehicles={vehicles}
            activeTab={activeTab}
            onRent={handleRentClick}
            onReturn={handleReturn}
          />
          {rentingVehicle && (
            <RentModal
              vehicle={rentingVehicle}
              onClose={handleRentCancel}
              onConfirm={handleRentConfirm}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VehiclesSection;

