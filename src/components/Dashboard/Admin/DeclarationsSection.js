import React, { useState, useEffect } from 'react';
import { declarationAPI, userAPI } from '../../../services/api';
import DeclarationForm from '../Client/DeclarationForm';
import AdminDeclarationList from './AdminDeclarationList';
import '../Client/Section.css';

const AdminDeclarationsSection = ({ declarations, onUpdate }) => {
  const [allUsers, setAllUsers] = useState([]);

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
  const [showForm, setShowForm] = useState(false);
  const [editingDeclaration, setEditingDeclaration] = useState(null);
  const [viewingDeclaration, setViewingDeclaration] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

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
      if (editingDeclaration) {
        await declarationAPI.update(editingDeclaration.id, declarationData);
      } else {
        await declarationAPI.create(declarationData);
      }
      onUpdate();
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка сохранения декларации:', error);
      alert('Ошибка сохранения декларации');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту декларацию?')) {
      try {
        await declarationAPI.delete(id);
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления декларации:', error);
        alert('Ошибка удаления декларации');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await declarationAPI.updateStatus(id, 'APPROVED');
      onUpdate();
    } catch (error) {
      console.error('Ошибка одобрения декларации:', error);
      alert('Ошибка одобрения декларации');
    }
  };

  const handleReject = async (id) => {
    try {
      await declarationAPI.updateStatus(id, 'REJECTED');
      onUpdate();
    } catch (error) {
      console.error('Ошибка отклонения декларации:', error);
      alert('Ошибка отклонения декларации');
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Декларации</h2>
        <button onClick={handleAdd} className="btn-primary">
          Добавить декларацию
        </button>
      </div>

      {showForm && (
        <DeclarationForm
          declaration={editingDeclaration}
          clientId={selectedClientId}
          onSave={handleSave}
          onCancel={handleCloseForm}
          isAdmin={true}
          allUsers={allUsers}
          onApprove={async (id) => {
            await handleApprove(id);
            onUpdate();
            // Обновляем редактируемую декларацию с новым статусом
            if (editingDeclaration && editingDeclaration.id === id) {
              setEditingDeclaration({ ...editingDeclaration, status: 'APPROVED' });
            }
          }}
          onReject={async (id) => {
            await handleReject(id);
            onUpdate();
            // Обновляем редактируемую декларацию с новым статусом
            if (editingDeclaration && editingDeclaration.id === id) {
              setEditingDeclaration({ ...editingDeclaration, status: 'REJECTED' });
            }
          }}
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
                  >
                    ✗ Отклонить декларацию
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AdminDeclarationList
        declarations={declarations}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDeclarationsSection;

