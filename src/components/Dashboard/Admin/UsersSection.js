import React, { useState } from 'react';
import { userAPI } from '../../../services/api';
import UserForm from './UserForm';
import UserList from './UserList';
import '../Client/Section.css';

const AdminUsersSection = ({ users, onUpdate, onActivity }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, userData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Обновил пользователя: ${userData.username || editingUser.username}`;
          
          // Добавляем детали изменений
          const changes = [];
          if (userData.name && userData.name !== editingUser.name) {
            changes.push(`имя: "${editingUser.name}" → "${userData.name}"`);
          }
          if (userData.email && userData.email !== editingUser.email) {
            changes.push(`email: "${editingUser.email}" → "${userData.email}"`);
          }
          if (userData.role && userData.role !== editingUser.role) {
            changes.push(`роль: "${editingUser.role}" → "${userData.role}"`);
          }
          
          if (changes.length > 0) {
            message += ` (${changes.join(', ')})`;
          } else {
            message += ` (без изменений данных)`;
          }
          
          message += ` (ID: ${editingUser.id})`;
          
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
      } else {
        const response = await userAPI.createUser(userData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Создал нового пользователя: ${userData.username}`;
          if (userData.name) {
            message += ` (${userData.name})`;
          }
          message += ` (роль: ${userData.role || 'CLIENT'})`;
          
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
      console.error('Ошибка сохранения пользователя:', error);
      alert('Ошибка сохранения пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        setLoading(true);
        
        // Найдем пользователя перед удалением для логирования
        const userToDelete = users.find(user => user.id === id);
        
        if (!userToDelete) {
          alert('Пользователь не найден');
          return;
        }
        
        await userAPI.deleteUser(id);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Удалил пользователя: ${userToDelete.username}`;
          if (userToDelete.name) {
            message += ` (${userToDelete.name})`;
          }
          message += ` (ID: ${id}, роль: ${userToDelete.role})`;
          
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
        
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert('Ошибка удаления пользователя');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        alert('Пользователь не найден');
        return;
      }
      
      await userAPI.updateUser(userId, { ...user, role: newRole });
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Изменил роль пользователя ${user.username} с "${user.role}" на "${newRole}" (ID: ${userId})`;
        
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
      alert('Ошибка изменения роли');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Пользователи ({users.length})</h2>
        <div className="section-actions">
          <button onClick={handleAdd} className="btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Добавить пользователя'}
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
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={handleCloseForm}
          loading={loading}
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
                <strong>ID:</strong> {viewingUser.id}
              </div>
              <div className="detail-row">
                <strong>Имя:</strong> {viewingUser.name || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Логин:</strong> {viewingUser.username}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {viewingUser.email || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>УНП:</strong> {viewingUser.unp || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Тип деятельности:</strong> {viewingUser.activityType || 'Не указано'}
              </div>
              <div className="detail-row">
                <strong>Роль:</strong> {viewingUser.role}
              </div>
              <div className="detail-row">
                <strong>Дата создания:</strong> 
                {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleString('ru-RU') : 'Неизвестно'}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleEdit(viewingUser)} className="btn-primary">
                Редактировать
              </button>
              <button onClick={handleCloseView} className="btn-secondary">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <UserList
        users={users}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onRoleChange={handleRoleChange}
        loading={loading}
      />

    </div>
  );
};

export default AdminUsersSection;