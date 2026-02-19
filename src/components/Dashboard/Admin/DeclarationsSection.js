import React, { useState, useEffect } from 'react';
import { declarationAPI, userAPI } from '../../../services/api';
import DeclarationForm from '../Client/DeclarationForm';
import AdminDeclarationList from './AdminDeclarationList';
import '../Client/Section.css';

const AdminDeclarationsSection = ({ declarations, onUpdate, onActivity }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDeclaration, setEditingDeclaration] = useState(null);
  const [viewingDeclaration, setViewingDeclaration] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setAllUsers(res.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const handleAdd = () => {
    setEditingDeclaration(null);
    setShowForm(true);
  };

  const handleEdit = (declaration) => {
    setEditingDeclaration(declaration);
    setSelectedClientId(declaration.clientId);
    setShowForm(true);
  };

  const handleView = (declaration) => {
    setViewingDeclaration(declaration);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDeclaration(null);
    setSelectedClientId(null);
  };

  const handleCloseView = () => {
    setViewingDeclaration(null);
  };

  const handleSave = async (declarationData) => {
    try {
      setLoading(true);
      
      if (editingDeclaration) {
        await declarationAPI.update(editingDeclaration.id, declarationData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          const message = `Обновил декларацию #${editingDeclaration.declarationNumber}`;
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
      } else {
        const response = await declarationAPI.create(declarationData);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          let message = `Создал новую декларацию`;
          if (response.data?.declarationNumber) {
            message += ` #${response.data.declarationNumber}`;
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
      console.error('Ошибка сохранения декларации:', error);
      alert('Ошибка сохранения декларации');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту декларацию?')) {
      try {
        setLoading(true);
        
        // Найдем декларацию перед удалением для логирования
        const declarationToDelete = declarations.find(d => d.id === id);
        
        if (!declarationToDelete) {
          alert('Декларация не найдена');
          return;
        }
        
        await declarationAPI.delete(id);
        
        // Вызываем onActivity для логирования
        if (onActivity && typeof onActivity === 'function') {
          const message = `Удалил декларацию #${declarationToDelete.declarationNumber}`;
          console.log('📝 Вызываю onActivity:', message);
          try {
            await onActivity(message);
          } catch (activityError) {
            console.error('Ошибка при записи активности:', activityError);
          }
        }
        
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления декларации:', error);
        alert('Ошибка удаления декларации');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      
      // Найдем декларацию перед одобрением для логирования
      const declaration = declarations.find(d => d.id === id);
      
      if (!declaration) {
        alert('Декларация не найдена');
        return;
      }
      
      await declarationAPI.updateStatus(id, 'APPROVED');
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Одобрил декларацию #${declaration.declarationNumber}`;
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка одобрения декларации:', error);
      alert('Ошибка одобрения декларации');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      
      // Найдем декларацию перед отклонением для логирования
      const declaration = declarations.find(d => d.id === id);
      
      if (!declaration) {
        alert('Декларация не найдена');
        return;
      }
      
      await declarationAPI.updateStatus(id, 'REJECTED');
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Отклонил декларацию #${declaration.declarationNumber}`;
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка отклонения декларации:', error);
      alert('Ошибка отклонения декларации');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      
      const declaration = declarations.find(d => d.id === id);
      
      if (!declaration) {
        alert('Декларация не найдена');
        return;
      }
      
      await declarationAPI.updateStatus(id, newStatus);
      
      // Вызываем onActivity для логирования
      if (onActivity && typeof onActivity === 'function') {
        const message = `Изменил статус декларации #${declaration.declarationNumber} на "${newStatus}"`;
        console.log('📝 Вызываю onActivity:', message);
        try {
          await onActivity(message);
        } catch (activityError) {
          console.error('Ошибка при записи активности:', activityError);
        }
      }
      
      onUpdate();
    } catch (error) {
      console.error('Ошибка изменения статуса декларации:', error);
      alert('Ошибка изменения статуса декларации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Декларации ({declarations.length})</h2>
        <div className="section-actions">
          <button onClick={handleAdd} className="btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Добавить декларацию'}
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
        <DeclarationForm
          declaration={editingDeclaration}
          clientId={selectedClientId}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
          allUsers={allUsers}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {viewingDeclaration && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр декларации</h3>
              <button onClick={handleCloseView} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Номер:</strong> {viewingDeclaration.declarationNumber}
              </div>
              <div className="detail-row">
                <strong>Клиент:</strong> {viewingDeclaration.clientName || viewingDeclaration.clientId}
              </div>
              <div className="detail-row">
                <strong>Тип:</strong> {viewingDeclaration.declarationType}
              </div>
              <div className="detail-row">
                <strong>Описание товара:</strong> {viewingDeclaration.productDescription}
              </div>
              <div className="detail-row">
                <strong>Стоимость:</strong> {viewingDeclaration.productValue}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong>{' '}
                <span className={`status-badge status-${viewingDeclaration.status?.toLowerCase()?.replace('_', '-')}`}>
                  {viewingDeclaration.status}
                </span>
              </div>
              <div className="detail-row">
                <strong>Дата создания:</strong>{' '}
                {new Date(viewingDeclaration.createdAt).toLocaleString('ru-RU')}
              </div>
              {(viewingDeclaration.status === 'PENDING' || viewingDeclaration.status === 'UNDER_REVIEW') && (
                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      handleApprove(viewingDeclaration.id);
                      handleCloseView();
                    }}
                    className="btn-approve"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    ✓ Одобрить декларацию
                  </button>
                  <button
                    onClick={() => {
                      handleReject(viewingDeclaration.id);
                      handleCloseView();
                    }}
                    className="btn-reject"
                    style={{ flex: 1 }}
                    disabled={loading}
                  >
                    ✗ Отклонить декларацию
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseView} className="btn-secondary">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminDeclarationList
        declarations={declarations}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
    </div>
  );
};

export default AdminDeclarationsSection;