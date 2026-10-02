import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardHeader = () => {
  const { company } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-dark mb-1">
          {getGreeting()}, {company?.company_name || 'User'}
        </h1>
        <p className="text-gray-500">{today}</p>
      </div>
      <div>
        <Link to="/ledgers/new" className="btn-primary flex items-center shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Create Ledger
        </Link>
      </div>
    </div>
  );
};
