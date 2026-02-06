import React from 'react';
import './List.css';

const DeclarationList = ({ declarations, onEdit, onView, onDelete }) => {
  if (declarations.length === 0) {
    return <div className="empty-state">Нет деклараций</div>;
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Тип</th>
            <th>Описание</th>
            <th>Стоимость</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {declarations.map((declaration) => (
            <tr key={declaration.id}>
              <td>{declaration.declarationNumber || 'N/A'}</td>
              <td>{declaration.declarationType}</td>
              <td>{declaration.productDescription}</td>
              <td>{declaration.productValue}</td>
              <td>
                <span className={`status-badge status-${declaration.status?.toLowerCase()}`}>
                  {declaration.status}
                </span>
              </td>
              <td>
                {declaration.createdAt
                  ? new Date(declaration.createdAt).toLocaleDateString('ru-RU')
                  : 'N/A'}
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onView(declaration)} className="btn-view">
                    Просмотр
                  </button>
                  {declaration.status !== 'APPROVED' && declaration.status !== 'REJECTED' && (
                    <button onClick={() => onEdit(declaration)} className="btn-edit">
                      Редактировать
                    </button>
                  )}
                  <button onClick={() => onDelete(declaration.id)} className="btn-delete">
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

export default DeclarationList;

