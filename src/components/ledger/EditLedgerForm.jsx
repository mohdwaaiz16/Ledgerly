import React, { useState } from 'react';

export const EditLedgerForm = ({ ledger, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    ledger_name: ledger?.ledger_name || '',
    ledger_type: ledger?.ledger_type || 'General',
    account_reference: ledger?.account_reference || '',
    from_date: ledger?.from_date || '',
    to_date: ledger?.to_date || '',
    opening_balance: ledger?.opening_balance || 0,
    opening_balance_type: ledger?.opening_balance_type || 'Debit',
    currency: ledger?.currency || 'INR (₹)',
    description: ledger?.description || '',
    status: ledger?.status || 'Active'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.ledger_name.trim()) {
      return setError('Ledger name is required.');
    }

    if (formData.from_date && formData.to_date) {
      if (new Date(formData.from_date) > new Date(formData.to_date)) {
        return setError('From Date cannot be after To Date.');
      }
    }
    
    if (formData.opening_balance < 0) {
      return setError('Opening Balance cannot be negative.');
    }

    const cleanedData = {
      ledger_name: formData.ledger_name.trim(),
      ledger_type: formData.ledger_type,
      account_reference: formData.account_reference.trim() || null,
      from_date: formData.from_date || null,
      to_date: formData.to_date || null,
      opening_balance: Number(formData.opening_balance) || 0,
      opening_balance_type: formData.opening_balance_type,
      currency: formData.currency,
      description: formData.description.trim() || null,
      status: formData.status
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">{error}</div>}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name *</label>
          <input 
            type="text" 
            name="ledger_name" 
            required 
            className="input-field" 
            value={formData.ledger_name} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Type</label>
            <select name="ledger_type" className="input-field" value={formData.ledger_type} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="Sales">Sales</option>
              <option value="Purchase">Purchase</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account / Reference Number</label>
            <input 
              type="text" 
              name="account_reference" 
              className="input-field" 
              value={formData.account_reference} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input 
              type="date" 
              name="from_date" 
              className="input-field" 
              value={formData.from_date || ''} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input 
              type="date" 
              name="to_date" 
              className="input-field" 
              value={formData.to_date || ''} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input 
                type="number" 
                step="0.01"
                min="0"
                name="opening_balance" 
                className="input-field pl-8" 
                value={formData.opening_balance} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance Type</label>
            <select name="opening_balance_type" className="input-field" value={formData.opening_balance_type} onChange={handleChange}>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select name="currency" className="input-field" value={formData.currency} onChange={handleChange}>
              <option value="INR (₹)">INR (₹)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" className="input-field" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
            <textarea 
              name="description" 
              className="input-field resize-none" 
              rows="3"
              value={formData.description || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Ledger'}</button>
      </div>
    </form>
  );
};
