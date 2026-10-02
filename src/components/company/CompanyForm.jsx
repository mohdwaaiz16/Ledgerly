import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CompanyForm = ({ initialData, isSetup = false }) => {
  const { user, refreshCompany } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || '',
    address: initialData?.address || '',
    email: initialData?.email || '',
    gst_number: initialData?.gst_number || '',
    phone: initialData?.phone || '',
    pan: initialData?.pan || '',
    website: initialData?.website || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSave = {
        ...formData,
        company_name: formData.company_name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        user_id: user.id
      };

      let query;
      if (initialData?.id) {
        query = supabase.from('companies').update(dataToSave).eq('id', initialData.id);
      } else {
        query = supabase.from('companies').insert([dataToSave]);
      }

      const { error: dbError } = await query;
      if (dbError) throw dbError;

      await refreshCompany();

      if (isSetup) {
        navigate('/dashboard');
      } else {
        setSuccess('Company information saved successfully.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-100">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-md text-sm font-medium border border-green-100">{success}</div>}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input type="text" name="company_name" required className="input-field" value={formData.company_name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input type="text" name="pan" className="input-field" value={formData.pan} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea name="address" required className="input-field min-h-[100px]" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input type="text" name="state" className="input-field" value={formData.state} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input type="text" name="pincode" className="input-field" value={formData.pincode} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Tax Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
          <input type="text" name="gst_number" className="input-field" value={formData.gst_number} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark border-b border-gray-100 pb-2">Online Presence</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input type="url" name="website" className="input-field" value={formData.website} onChange={handleChange} placeholder="https://" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary min-w-[150px]">
          {loading ? 'Saving...' : (isSetup ? 'Create Company' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};
