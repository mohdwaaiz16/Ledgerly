import React, { useState } from 'react';

export const TransactionForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    transaction_date: initialData?.transaction_date || '',
    particulars: initialData?.particulars || '',
    voucher_type: initialData?.voucher_type || '',
    voucher_number: initialData?.voucher_number || '',
    debit: initialData?.debit || '',
    credit: initialData?.credit || ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const debit = Number(formData.debit) || 0;
    const credit = Number(formData.credit) || 0;

    if (debit < 0 || credit < 0) {
      return setError('Negative values are not allowed.');
    }

    if (debit > 0 && credit > 0) {
      return setError('A transaction cannot have both Debit and Credit greater than zero.');
    }

    if (debit === 0 && credit === 0) {
      return setError('At least one of Debit or Credit must be greater than zero.');
    }

    onSubmit({
      ...formData,
      debit,
      credit
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" name="transaction_date" required className="input-field" value={formData.transaction_date} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Type</label>
          <input type="text" name="voucher_type" className="input-field" value={formData.voucher_type} onChange={handleChange} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Particulars *</label>
          <input type="text" name="particulars" required className="input-field" value={formData.particulars} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Number</label>
          <input type="text" name="voucher_number" className="input-field" value={formData.voucher_number} onChange={handleChange} />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Debit</label>
            <input type="number" step="0.01" min="0" name="debit" className="input-field" value={formData.debit} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
            <input type="number" step="0.01" min="0" name="credit" className="input-field" value={formData.credit} onChange={handleChange} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Transaction'}</button>
      </div>
    </form>
  );
};
