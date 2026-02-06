import React from 'react';
import './ActivityLog.css';

const ActivityLog = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="activity-log">
      <h3>Активности</h3>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-description">{activity.description}</div>
            <div className="activity-date">
              {new Date(activity.activityDate || activity.createdAt).toLocaleString('ru-RU')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;

