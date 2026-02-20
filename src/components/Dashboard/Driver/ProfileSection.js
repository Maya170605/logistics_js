// Driver/ProfileSection.js
import React, { useState } from 'react';
import { userAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const ProfileSection = ({ user, onUpdate, onActivity }) => {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSave = async () => {
    // Валидация
    if (!formData.username.trim()) {
      setError('Логин не может быть пустым');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      const updateData = {
        username: formData.username,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updated = await userAPI.updateUser(user.id, updateData);
      updateUser(updated.data); // обновляем данные в контексте
      onActivity('Профиль обновлён');
      setIsEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
      onUpdate();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка обновления профиля';
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
      try {
        await userAPI.deleteUser(user.id);
        onActivity('Аккаунт удалён');
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
            <label>Логин</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Новый пароль (оставьте пустым, если не хотите менять)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите новый пароль"
            />
          </div>
          <div className="form-group">
            <label>Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button onClick={handleSave} className="btn-primary">
              Сохранить
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  username: user.username || '',
                  password: '',
                  confirmPassword: '',
                });
                setError('');
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
            <strong>Логин:</strong> {user.username}
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