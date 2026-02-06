import React from 'react';
import '../Client/List.css';

const AdminVehicleList = ({ vehicles, onEdit, onView, onDelete }) => {
  if (vehicles.length === 0) {
    return <div className="empty-state">Нет машин</div>;
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
            <th>Статус</th>
            <th>Водитель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr 
              key={vehicle.id}
              style={vehicle.driverId ? { backgroundColor: '#fff9e6' } : {}}
            >
              <td><strong>{vehicle.licensePlate}</strong></td>
              <td>{vehicle.model || 'N/A'}</td>
              <td>{vehicle.vehicleType || 'N/A'}</td>
              <td>{vehicle.yearOfManufacture || 'N/A'}</td>
              <td>{vehicle.capacity ? `${vehicle.capacity} т` : 'N/A'}</td>
              <td>{vehicle.clientName || `ID: ${vehicle.clientId}`}</td>
              <td>
                {vehicle.driverId ? (
                  <span style={{ color: '#ff9800', fontWeight: 'bold' }}>В аренде</span>
                ) : (
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Доступна</span>
                )}
              </td>
              <td>
                {vehicle.driverId ? (
                  <span>{vehicle.driverName || `ID: ${vehicle.driverId}`}</span>
                ) : (
                  <span style={{ color: '#999' }}>—</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onView(vehicle)} className="btn-view">
                    Просмотр
                  </button>
                  <button onClick={() => onEdit(vehicle)} className="btn-edit">
                    Редактировать
                  </button>
                  <button onClick={() => onDelete(vehicle.id)} className="btn-delete">
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

export default AdminVehicleList;

