import React from 'react';
import '../Client/List.css';

const UserList = ({ users, onEdit, onView, onDelete }) => {
  if (users.length === 0) {
    return <div className="empty-state">Нет пользователей</div>;
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>УНП</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email || 'N/A'}</td>
              <td>
                <span className={`status-badge status-${user.role?.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>{user.unp || 'N/A'}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onView(user)} className="btn-view">
                    Просмотр
                  </button>
                  <button onClick={() => onEdit(user)} className="btn-edit">
                    Редактировать
                  </button>
                  <button onClick={() => onDelete(user.id)} className="btn-delete">
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

export default UserList;

