import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, FileText, Trash2, Edit } from 'lucide-react';
import { formatCurrency, calculateTotalDebit, calculateTotalCredit, calculateBalance } from '../utils/ledgerCalculations';

export const Ledgers = () => {
  const { company } = useAuth();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLedgers = async () => {
    if (!company) return;
    try {
      const { data, error } = await supabase
        .from('ledgers')
        .select('*, transactions(*)')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLedgers(data || []);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, [company]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ledger? All transactions inside it will also be deleted. This cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase.from('ledgers').delete().eq('id', id);
      if (error) throw error;
      setLedgers(ledgers.filter(l => l.id !== id));
    } catch (error) {
      console.error(error);
      alert('Unable to delete ledger. Please try again later.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-dark">Your Ledgers</h1>
          <p className="text-gray-600 mt-2">Create and manage your business ledgers.</p>
        </div>
        <Link to="/ledgers/new" className="btn-primary flex items-center shadow-sm w-fit">
          <Plus className="w-5 h-5 mr-2" />
          Create Ledger
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading ledgers...</div>
      ) : ledgers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">No ledgers yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Create your first ledger to start recording transactions.
          </p>
          <Link to="/ledgers/new" className="btn-secondary">
            Create Ledger
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ledgers.map(ledger => {
            const debit = calculateTotalDebit(ledger.transactions);
            const credit = calculateTotalCredit(ledger.transactions);
            const balance = calculateBalance(ledger.transactions);

            return (
              <div key={ledger.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-dark truncate pr-4" title={ledger.ledger_name}>{ledger.ledger_name}</h3>
                    <div className="flex space-x-2 text-gray-400">
                      <button onClick={() => handleDelete(ledger.id)} className="hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    {ledger.from_date && ledger.to_date ? `${ledger.from_date} to ${ledger.to_date}` : 'All time'}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transactions</span>
                      <span className="font-medium text-dark">{ledger.transactions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Debit</span>
                      <span className="font-medium text-dark">{formatCurrency(debit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Credit</span>
                      <span className="font-medium text-dark">{formatCurrency(credit)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-50 mt-2">
                      <span className="text-gray-700 font-semibold">Balance</span>
                      <span className={`font-bold ${balance >= 0 ? 'text-dark' : 'text-red-600'}`}>
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <Link to={`/ledgers/${ledger.id}`} className="text-sm font-semibold text-dark hover:text-accent transition-colors block text-center w-full">
                    Open Ledger
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
