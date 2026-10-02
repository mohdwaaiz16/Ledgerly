import React from 'react';
import { CompanyForm } from '../components/company/CompanyForm';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { company } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your company profile and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          {company ? (
            <CompanyForm initialData={company} isSetup={false} />
          ) : (
            <div className="text-gray-500">Loading company data...</div>
          )}
        </div>
      </div>
    </div>
  );
};
