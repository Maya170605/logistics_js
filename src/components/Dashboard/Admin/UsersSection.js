import React, { useState } from 'react';
import { userAPI } from '../../../services/api';
import UserForm from './UserForm';
import UserList from './UserList';
import '../Client/Section.css';

const AdminUsersSection = ({ users, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleView = (user) => {
    setViewingUser(user);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCloseView = () => {
    setViewingUser(null);
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, userData);
      } else {
        await userAPI.createUser(userData);
      }
      onUpdate();
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
      alert('Ошибка сохранения пользователя');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await userAPI.deleteUser(id);
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert('Ошибка удаления пользователя');
      }
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Пользователи</h2>
        <button onClick={handleAdd} className="btn-primary">
          Добавить пользователя
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      )}

      {viewingUser && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр пользователя</h3>
              <button onClick={handleCloseView} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Имя:</strong> {viewingUser.name || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Логин:</strong> {viewingUser.username}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {viewingUser.email || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>УНП:</strong> {viewingUser.unp || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Тип деятельности:</strong> {viewingUser.activityType || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Роль:</strong> {viewingUser.role}
              </div>
            </div>
          </div>
        </div>
      )}

      <UserList
        users={users}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminUsersSection;

