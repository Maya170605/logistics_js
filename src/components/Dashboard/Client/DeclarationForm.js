import React, { useState, useEffect } from 'react';
import './Form.css';

const DeclarationForm = ({ declaration, clientId, onSave, onCancel, isAdmin = false, allUsers = [], onApprove, onReject }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    declarationType: '',
    tnvedCode: '',
    productDescription: '',
    productValue: '',
    netWeight: '',
    quantity: '',
    countryOfOrigin: '',
    countryOfDestination: '',
    customsOffice: '',
  });

  useEffect(() => {
    if (declaration) {
      setFormData({
        clientId: declaration.clientId || '',
        declarationType: declaration.declarationType || '',
        tnvedCode: declaration.tnvedCode || '',
        productDescription: declaration.productDescription || '',
        productValue: declaration.productValue || '',
        netWeight: declaration.netWeight || '',
        quantity: declaration.quantity || '',
        countryOfOrigin: declaration.countryOfOrigin || '',
        countryOfDestination: declaration.countryOfDestination || '',
        customsOffice: declaration.customsOffice || '',
      });
    }
  }, [declaration]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      clientId: isAdmin ? formData.clientId : clientId,
      declarationType: formData.declarationType,
      tnvedCode: formData.tnvedCode || null,
      productDescription: formData.productDescription,
      productValue: parseFloat(formData.productValue) || 0,
      netWeight: formData.netWeight ? parseFloat(formData.netWeight) : null,
      quantity: formData.quantity ? parseInt(formData.quantity) : null,
      countryOfOrigin: formData.countryOfOrigin || null,
      countryOfDestination: formData.countryOfDestination || null,
      customsOffice: formData.customsOffice || null,
    };
    onSave(data);
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <h3>{declaration ? 'Редактировать декларацию' : 'Добавить декларацию'}</h3>
        <form onSubmit={handleSubmit}>
          {isAdmin && (
            <div className="form-group">
              <label>Клиент *</label>
              <select
                name="clientId"
                value={formData.clientId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Выберите клиента</option>
                {allUsers
                  .filter((u) => u.role === 'CLIENT')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Тип декларации *</label>
            <input
              type="text"
              name="declarationType"
              value={formData.declarationType}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Код ТН ВЭД</label>
            <input
              type="text"
              name="tnvedCode"
              value={formData.tnvedCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Описание товара *</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Стоимость товара *</label>
              <input
                type="number"
                step="0.01"
                name="productValue"
                value={formData.productValue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Чистый вес</label>
              <input
                type="number"
                step="0.01"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Количество</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Страна происхождения</label>
              <input
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Страна назначения</label>
              <input
                type="text"
                name="countryOfDestination"
                value={formData.countryOfDestination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Таможенный пост</label>
            <input
              type="text"
              name="customsOffice"
              value={formData.customsOffice}
              onChange={handleChange}
            />
          </div>

          {isAdmin && declaration && (
            <div className="form-group">
              <label>Текущий статус</label>
              <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '5px', marginBottom: '10px' }}>
                <span className={`status-badge status-${declaration.status?.toLowerCase()?.replace('_', '-')}`}>
                  {declaration.status}
                </span>
              </div>
              {(declaration.status === 'PENDING' || declaration.status === 'UNDER_REVIEW') && (
                <>
                  <label>Изменить статус</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Одобрить декларацию?')) {
                          onApprove(declaration.id);
                        }
                      }}
                      className="btn-approve"
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      ✓ Одобрить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Отклонить декларацию?')) {
                          onReject(declaration.id);
                        }
                      }}
                      className="btn-reject"
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      ✗ Отклонить
                    </button>
                  </div>
                </>
              )}
            </div>
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

export default DeclarationForm;

