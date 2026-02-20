// Driver/RoutesSection.js
import React from 'react';

const RoutesSection = ({ declarations }) => {
  // Фильтруем только одобренные декларации (разные варианты написания)
   // Для отладки: посмотрим, что приходит
  console.log('Все декларации в RoutesSection:', declarations);

  // Фильтруем только одобренные (статус APPROVED)
  const approvedDeclarations = declarations.filter(dec => {
    // Убираем возможные пробелы и приводим к верхнему регистру для надёжности
    const status = dec.status?.trim().toUpperCase();
    return status === 'APPROVED';
  });

  console.log('Отфильтрованные (APPROVED):', approvedDeclarations);

  return (
    <div className="section">
      <div className="section-header">
        <h2>Маршруты</h2>
      </div>

      {declarations.length === 0 ? (
        <p className="no-data">Нет данных о маршрутах</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>№ декларации</th>
              <th>Вес (кг)</th>
              <th>Таможенный пост</th>
              <th>Клиент</th>
              <th>Маршрут</th>
            <th>Статус</th>

            </tr>
          </thead>
          <tbody>
            {approvedDeclarations.map(dec => (
              <tr key={dec.id}>
                <td>{dec.declarationNumber}</td>
                <td>{dec.netWeight || '—'}</td>
                <td>{dec.customsOffice || '—'}</td>
                <td>{dec.clientName || dec.clientId || '—'}</td>
                <td>
                  {/* замените originCountry и destinationCountry на реальные поля ваших данных */}
                  {dec.countryOfOrigin || '—'} → {dec.countryOfDestination || '—'}
                </td>
                <td>{dec.status}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoutesSection;