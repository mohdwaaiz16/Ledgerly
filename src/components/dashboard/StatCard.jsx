import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-dark">{value}</h4>
        {trend && (
          <p className="text-xs mt-2 font-medium text-gray-500">
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.value}
            </span>{' '}
            {trend.label}
          </p>
        )}
      </div>
      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-dark" />
      </div>
    </div>
  );
};
