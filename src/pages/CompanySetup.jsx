import React from 'react';
import { CompanyForm } from '../components/company/CompanyForm';

export const CompanySetup = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start pt-12 md:pt-20">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-dark">Welcome to Ledgerly</h2>
          <p className="text-gray-600 mt-2">Let's set up your company profile to get started.</p>
        </div>
        <div className="p-8">
          <CompanyForm isSetup={true} />
        </div>
      </div>
    </div>
  );
};
