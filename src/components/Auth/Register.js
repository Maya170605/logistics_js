import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [role, setRole] = useState('CLIENT');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    unp: '',
    email: '',
    activityType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      username: formData.username,
      password: formData.password,
      role: role,
    };

    if (role === 'CLIENT') {
      userData.name = formData.name;
      userData.unp = formData.unp;
      userData.email = formData.email;
      userData.activityType = formData.activityType;
    }

    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Регистрация</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Роль</label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              required
              disabled={loading}
            >
              <option value="CLIENT">Клиент</option>
              <option value="DRIVER">Водитель</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Логин *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {role === 'CLIENT' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="unp">УНП *</label>
                <input
                  type="text"
                  id="unp"
                  name="unp"
                  value={formData.unp}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="activityType">Тип деятельности *</label>
                <input
                  type="text"
                  id="activityType"
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="auth-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

