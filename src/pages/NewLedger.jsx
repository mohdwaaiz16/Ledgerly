import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const NewLedger = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ledger_name: '',
    ledger_type: 'General',
    account_reference: '',
    from_date: '',
    to_date: '',
    opening_balance: 0,
    opening_balance_type: 'Debit',
    currency: 'INR (₹)',
    description: '',
    status: 'Active',
    gst_no: '',
    email: '',
    phone: '',
    address: '',
    state: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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

    if (!company) {
      return setError('No company associated with your account.');
    }

    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('ledgers')
        .insert([{
          company_id: company.id,
          ledger_name: formData.ledger_name.trim(),
          ledger_type: formData.ledger_type,
          account_reference: formData.account_reference.trim() || null,
          from_date: formData.from_date || null,
          to_date: formData.to_date || null,
          opening_balance: Number(formData.opening_balance) || 0,
          opening_balance_type: formData.opening_balance_type,
          currency: formData.currency,
          description: formData.description.trim() || null,
          status: formData.status,
          gst_no: formData.gst_no.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          address: formData.address.trim() || null,
          state: formData.state.trim() || null
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      navigate(`/ledgers/${data.id}`);
    } catch (err) {
      setError(err.message || 'Error creating ledger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-8 mb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Create Ledger</h1>
        <p className="text-gray-600 mt-2">Set up a new ledger account.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-dark mb-6 pb-4 border-b border-gray-100">Ledger Information</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-100 mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name *</label>
            <input 
              type="text" 
              name="ledger_name" 
              required 
              className="input-field" 
              value={formData.ledger_name} 
              onChange={handleChange} 
              placeholder="e.g. Canara Bank Account"
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
                placeholder="XXXX1234"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                name="from_date" 
                className="input-field" 
                value={formData.from_date} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                name="to_date" 
                className="input-field" 
                value={formData.to_date} 
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
            
          </div>
            
            <div className="md:col-span-2 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-dark mb-4">Contact & Tax Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input type="text" name="gst_no" className="input-field uppercase" placeholder="e.g. 29ABCDE1234F1Z5" value={formData.gst_no} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" className="input-field" placeholder="e.g. Karnataka" value={formData.state} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" className="input-field" placeholder="client@example.com" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" className="input-field" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea name="address" rows="2" className="input-field" placeholder="Complete address" value={formData.address} onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
              <textarea 
                name="description" 
                className="input-field resize-none" 
                rows="3"
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Current account used for business receipts and payments."
              />
            </div>
          

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/ledgers')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[150px]">
              {loading ? 'Creating...' : 'Create Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
