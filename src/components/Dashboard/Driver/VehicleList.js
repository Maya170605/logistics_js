import React from 'react';
import '../Client/List.css';

const VehicleList = ({ vehicles, activeTab, onRent, onReturn }) => {
  if (vehicles.length === 0) {
    return (
      <div className="empty-state">
        {activeTab === 'available' ? 'Нет доступных машин' : 'У вас нет арендованных машин'}
      </div>
    );
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Госномер</th>
            <th>Модель</th>
            <th>Тип</th>
            <th>Год выпуска</th>
            <th>Грузоподъемность</th>
            <th>Владелец</th>
            {activeTab === 'rented' && (
              <>
                <th>Дата начала</th>
                <th>Дата окончания</th>
              </>
            )}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const isEarlyReturnPossible = activeTab === 'rented' && 
              vehicle.rentalEndDate && 
              new Date(vehicle.rentalEndDate) > new Date();
            
            return (
            <tr key={vehicle.id} style={isEarlyReturnPossible ? { backgroundColor: '#fff9e6' } : {}}>
              <td><strong>{vehicle.licensePlate}</strong></td>
              <td>{vehicle.model || 'N/A'}</td>
              <td>{vehicle.vehicleType || 'N/A'}</td>
              <td>{vehicle.yearOfManufacture || 'N/A'}</td>
              <td>{vehicle.capacity ? `${vehicle.capacity} т` : 'N/A'}</td>
              <td>{vehicle.clientName || `ID: ${vehicle.clientId}`}</td>
              {activeTab === 'rented' && (
                <>
                  <td>
                    {vehicle.rentalStartDate
                      ? new Date(vehicle.rentalStartDate).toLocaleDateString('ru-RU')
                      : 'N/A'}
                  </td>
                  <td>
                    {vehicle.rentalEndDate ? (
                      <>
                        {new Date(vehicle.rentalEndDate).toLocaleDateString('ru-RU')}
                        {new Date(vehicle.rentalEndDate) > new Date() && (
                          <span style={{ 
                            display: 'block', 
                            fontSize: '12px', 
                            color: '#ff9800',
                            fontWeight: 'bold',
                            marginTop: '4px'
                          }}>
                            (Досрочный возврат возможен)
                          </span>
                        )}
                      </>
                    ) : 'N/A'}
                  </td>
                </>
              )}
              <td>
                <div className="action-buttons">
                  {activeTab === 'available' ? (
                    <button
                      onClick={() => onRent(vehicle)}
                      className="btn-primary"
                      disabled={!vehicle.isAvailable}
                    >
                      Арендовать
                    </button>
                  ) : (
                    <>
                      {vehicle.rentalEndDate && new Date(vehicle.rentalEndDate) > new Date() ? (
                        <button
                          onClick={() => onReturn(vehicle.id)}
                          className="btn-warning"
                          style={{
                            background: '#ff9800',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Вернуть досрочно
                        </button>
                      ) : (
                        <button
                          onClick={() => onReturn(vehicle.id)}
                          className="btn-secondary"
                        >
                          Вернуть
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;

