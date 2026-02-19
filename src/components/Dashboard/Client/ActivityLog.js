import React from 'react';
import './ActivityLog.css';

const ActivityLog = ({ activities }) => {
  // Убедитесь, что activities существует
  if (!activities || !Array.isArray(activities)) {
    return <div className="activity-log">Нет данных об активностях</div>;
  }

  if (activities.length === 0) {
    return <div className="activity-log">Нет активностей</div>;
  }

  return (
    <div className="activity-log">
      <h3>Активности</h3>
      <div className="activity-list">
        {activities.map((activity) => {
          // Используйте правильное поле для даты
          const activityDate = activity.activityDate || activity.createdAt;
          return (
            <div key={activity.id || activity.activityId} className="activity-item">
              <div className="activity-description">{activity.description}</div>
              <div className="activity-date">
                {activityDate ? new Date(activityDate).toLocaleString('ru-RU') : 'Нет даты'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLog;

