import React, { useState } from 'react';
import { userAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './Section.css';

const ProfileSection = ({ user, onUpdate, onActivity }) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    unp: user.unp || '',
    activityType: user.activityType || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Включаем обязательные поля для обновления
      const updateData = {
        ...formData,
        username: user.username, // Сохраняем текущий username
        role: user.role, // Сохраняем текущую роль
      };
      const updated = await userAPI.updateUser(user.id, updateData);
      updateUser(updated.data);
      onActivity('Профиль обновлен');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка обновления профиля';
      alert(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
      try {
        await userAPI.deleteUser(user.id);
        onActivity('Аккаунт удален');
        window.location.href = '/login';
      } catch (error) {
        console.error('Ошибка удаления аккаунта:', error);
        alert('Ошибка удаления аккаунта');
      }
    }
  };


  return (
    <div className="section">
      <div className="section-header">
        <h2>Профиль</h2>
        <div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Редактировать
            </button>
          )}
          <button onClick={handleDelete} className="btn-delete">
            Удалить аккаунт
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="profile-form">
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>УНП</label>
            <input
              type="text"
              name="unp"
              value={formData.unp}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Тип деятельности</label>
            <input
              type="text"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="btn-primary">
              Сохранить
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name || '',
                  email: user.email || '',
                  unp: user.unp || '',
                  activityType: user.activityType || '',
                });
              }}
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-view">
          <div className="detail-row">
            <strong>Имя:</strong> {user.name || 'N/A'}
          </div>
          <div className="detail-row">
            <strong>Логин:</strong> {user.username}
          </div>
          <div className="detail-row">
            <strong>Email:</strong> {user.email || 'N/A'}
          </div>
          <div className="detail-row">
            <strong>УНП:</strong> {user.unp || 'N/A'}
          </div>
          <div className="detail-row">
            <strong>Тип деятельности:</strong> {user.activityType || 'N/A'}
          </div>
          <div className="detail-row">
            <strong>Роль:</strong> {user.role}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;

