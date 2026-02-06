import React, { useState, useEffect } from 'react';
import '../Client/Form.css';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'CLIENT',
    name: '',
    email: '',
    unp: '',
    activityType: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        password: '',
        role: user.role || 'CLIENT',
        name: user.name || '',
        email: user.email || '',
        unp: user.unp || '',
        activityType: user.activityType || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (user && !data.password) {
      delete data.password;
    }
    onSave(data);
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h3>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Роль *</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="CLIENT">Клиент</option>
              <option value="DRIVER">Водитель</option>
              <option value="ADMIN">Админ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Логин *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль {user ? '(оставьте пустым, чтобы не менять)' : '*'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          </div>

          {(formData.role === 'CLIENT' || formData.role === 'ADMIN') && (
            <>
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
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

