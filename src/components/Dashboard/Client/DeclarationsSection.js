import React, { useState } from 'react';
import { declarationAPI } from '../../../services/api';
import DeclarationForm from './DeclarationForm';
import DeclarationList from './DeclarationList';
import './Section.css';

const DeclarationsSection = ({ declarations, clientId, onUpdate, onActivity }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDeclaration, setEditingDeclaration] = useState(null);
  const [viewingDeclaration, setViewingDeclaration] = useState(null);

  const handleAdd = () => {
    setEditingDeclaration(null);
    setShowForm(true);
  };

  const handleEdit = (declaration) => {
    setEditingDeclaration(declaration);
    setShowForm(true);
  };

  const handleView = (declaration) => {
    setViewingDeclaration(declaration);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDeclaration(null);
  };

  const handleCloseView = () => {
    setViewingDeclaration(null);
  };

  const handleSave = async (declarationData) => {
    try {
      if (editingDeclaration) {
        await declarationAPI.update(editingDeclaration.id, declarationData);
        onActivity(`Декларация #${editingDeclaration.declarationNumber} обновлена`);
      } else {
        await declarationAPI.create(declarationData);
        onActivity('Декларация добавлена');
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
        onActivity('Декларация удалена');
        onUpdate();
      } catch (error) {
        console.error('Ошибка удаления декларации:', error);
        alert('Ошибка удаления декларации');
      }
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
          clientId={clientId}
          onSave={handleSave}
          onCancel={handleCloseForm}
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
                <strong>Тип:</strong> {viewingDeclaration.declarationType}
              </div>
              <div className="detail-row">
                <strong>Описание товара:</strong> {viewingDeclaration.productDescription}
              </div>
              <div className="detail-row">
                <strong>Стоимость:</strong> {viewingDeclaration.productValue}
              </div>
              <div className="detail-row">
                <strong>Статус:</strong> {viewingDeclaration.status}
              </div>
              <div className="detail-row">
                <strong>Дата создания:</strong>{' '}
                {new Date(viewingDeclaration.createdAt).toLocaleString('ru-RU')}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeclarationList
        declarations={declarations}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DeclarationsSection;

