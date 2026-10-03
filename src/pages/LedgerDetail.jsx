import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Trash2, Edit, Plus, Upload, X, FileText, Info } from 'lucide-react';
import { formatCurrency, calculateTotalDebit, calculateTotalCredit, calculateBalance, getBalanceDirection, formatCurrencyWithDirection } from '../utils/ledgerCalculations';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { TransactionParserPreview } from '../components/transaction/TransactionParserPreview';
import { EditLedgerForm } from '../components/ledger/EditLedgerForm';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const LedgerDetail = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showEditLedger, setShowEditLedger] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLedgerAndTransactions = async () => {
    try {
      const [ledgerRes, transactionsRes] = await Promise.all([
        supabase.from('ledgers').select('*').eq('id', ledgerId).single(),
        supabase.from('transactions').select('*').eq('ledger_id', ledgerId).order('transaction_date', { ascending: true })
      ]);

      if (ledgerRes.error) throw ledgerRes.error;
      if (transactionsRes.error) throw transactionsRes.error;

      setLedger(ledgerRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error('Error fetching ledger details:', err);
      navigate('/ledgers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerAndTransactions();
  }, [ledgerId]);

  const handleDeleteLedger = async () => {
    if (!window.confirm('Delete this ledger? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('ledgers').delete().eq('id', ledgerId);
      if (error) throw error;
      navigate('/ledgers');
    } catch (err) {
      console.error(err);
      alert('Unable to delete ledger. Please try again later.');
    }
  };

  const handleUpdateLedger = async (data) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.from('ledgers').update(data).eq('id', ledgerId);
      if (error) throw error;
      
      setLedger({ ...ledger, ...data });
      setShowEditLedger(false);
    } catch (err) {
      console.error(err);
      alert('Unable to save ledger details. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Unable to delete transaction. Please try again.');
    }
  };

  const handleSaveTransaction = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        ledger_id: ledgerId,
        transaction_date: data.transaction_date,
        particulars: data.particulars,
        voucher_type: data.voucher_type,
        voucher_number: data.voucher_number,
        debit: data.debit,
        credit: data.credit
      };

      if (data.id) {
        const { error } = await supabase.from('transactions').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('transactions').insert([payload]);
        if (error) throw error;
      }
      
      await fetchLedgerAndTransactions();
      setShowAddForm(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error(err);
      alert('Unable to save transaction. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportTransactions = async (importedList) => {
    setActionLoading(true);
    try {
      const payload = importedList.map(t => ({
        ledger_id: ledgerId,
        transaction_date: new Date(t.transaction_date).toISOString().split('T')[0],
        particulars: t.particulars,
        voucher_type: t.voucher_type,
        voucher_number: t.voucher_number,
        debit: t.debit,
        credit: t.credit
      }));

      const { error } = await supabase.from('transactions').insert(payload);
      if (error) throw error;

      await fetchLedgerAndTransactions();
      setShowImport(false);
    } catch (err) {
      console.error(err);
      alert('Unable to import transactions. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!ledger) return <div className="text-center py-12">Ledger not found</div>;

  const totalDebit = calculateTotalDebit(transactions);
  const totalCredit = calculateTotalCredit(transactions);
  const balance = calculateBalance(transactions, ledger);
  const balanceDirection = getBalanceDirection(balance, ledger);

  const formattedOpening = formatCurrencyWithDirection(
    ledger.opening_balance || 0,
    ledger.opening_balance_type === 'Credit' ? 'Cr' : 'Dr'
  );
  
  const formattedClosing = formatCurrencyWithDirection(balance, balanceDirection);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-2 text-sm text-gray-500 hover:text-dark">
        <ArrowLeft className="w-4 h-4" />
        <Link to="/ledgers">Back to Ledgers</Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-dark">{ledger.ledger_name}</h1>
          <p className="text-gray-500 mt-1">
            {ledger.ledger_type} Ledger {ledger.status === 'Archived' ? '(Archived)' : ''}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to={`/ledgers/${ledgerId}/preview`} className="btn-secondary flex items-center bg-white border border-gray-200">
            <FileText className="w-4 h-4 mr-2" /> PDF Preview
          </Link>
          <button onClick={handleDeleteLedger} className="btn-secondary text-red-600 hover:text-red-700 flex items-center bg-white border border-red-100 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Ledger Information Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50">
          <div className="flex items-center space-x-3 text-dark">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-dark" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Ledger Information</h3>
              <p className="text-sm text-gray-500">Account metadata & settings</p>
            </div>
          </div>
          <button onClick={() => setShowEditLedger(true)} className="mt-4 sm:mt-0 btn-secondary text-sm flex items-center shrink-0">
            <Edit className="w-4 h-4 mr-2" /> Edit Information
          </button>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="block text-gray-500 mb-1">Type</span>
              <span className="font-medium text-dark">{ledger.ledger_type}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Account / Reference</span>
              <span className="font-medium text-dark">{ledger.account_reference || '-'}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Period</span>
              <span className="font-medium text-dark">
                {ledger.from_date && ledger.to_date ? `${formatDate(ledger.from_date)} to ${formatDate(ledger.to_date)}` : 'All time'}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Status</span>
              <span className="font-medium text-dark">{ledger.status}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Opening Balance</span>
              <span className="font-medium text-dark">{formattedOpening}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Currency</span>
              <span className="font-medium text-dark">{ledger.currency}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-gray-500 mb-1">Description</span>
              <span className="font-medium text-dark block truncate" title={ledger.description}>{ledger.description || '-'}</span>
            </div>
          </div>
          
          {(ledger.gst_no || ledger.email || ledger.phone || ledger.state || ledger.address) && (
            <div className="mt-6 pt-6 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
              {ledger.gst_no && (
                <div>
                  <span className="block text-gray-500 mb-1">GST Number</span>
                  <span className="font-medium text-dark uppercase">{ledger.gst_no}</span>
                </div>
              )}
              {ledger.email && (
                <div>
                  <span className="block text-gray-500 mb-1">Email</span>
                  <span className="font-medium text-dark">{ledger.email}</span>
                </div>
              )}
              {ledger.phone && (
                <div>
                  <span className="block text-gray-500 mb-1">Phone</span>
                  <span className="font-medium text-dark">{ledger.phone}</span>
                </div>
              )}
              {ledger.state && (
                <div>
                  <span className="block text-gray-500 mb-1">State</span>
                  <span className="font-medium text-dark">{ledger.state}</span>
                </div>
              )}
              {ledger.address && (
                <div className="sm:col-span-2">
                  <span className="block text-gray-500 mb-1">Address</span>
                  <span className="font-medium text-dark block truncate" title={ledger.address}>{ledger.address}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Debit</p>
          <h4 className="text-2xl font-bold text-dark">{formatCurrency(totalDebit)}</h4>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Credit</p>
          <h4 className="text-2xl font-bold text-dark">{formatCurrency(totalCredit)}</h4>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-accent/10">
          <p className="text-sm font-medium text-gray-700 mb-1">Closing Balance</p>
          <h4 className={`text-2xl font-bold ${balanceDirection === 'Dr' ? 'text-dark' : 'text-red-600'}`}>
            {formattedClosing}
          </h4>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-dark">Transactions</h2>
          <div className="flex space-x-3">
            <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center text-sm">
              <Upload className="w-4 h-4 mr-2" /> Import
            </button>
            <button onClick={() => { setEditingTransaction(null); setShowAddForm(true); }} className="btn-primary flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Particulars</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Vch Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Vch No.</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Debit</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Credit</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No transactions yet. Add one manually or paste from a document.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">{formatDate(t.transaction_date)}</td>
                    <td className="px-6 py-4 font-medium text-dark max-w-[300px] truncate" title={t.particulars}>{t.particulars}</td>
                    <td className="px-6 py-4 text-gray-600">{t.voucher_type}</td>
                    <td className="px-6 py-4 text-gray-600">{t.voucher_number}</td>
                    <td className="px-6 py-4 text-right font-medium text-dark">{t.debit > 0 ? formatCurrency(t.debit) : '-'}</td>
                    <td className="px-6 py-4 text-right font-medium text-dark">{t.credit > 0 ? formatCurrency(t.credit) : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditingTransaction(t); setShowAddForm(true); }} className="text-gray-400 hover:text-accent mr-3">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals / Overlays */}
      {showEditLedger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-dark">Edit Ledger Information</h3>
                <p className="text-sm text-gray-500 mt-1">Update ledger metadata and settings.</p>
              </div>
              <button onClick={() => setShowEditLedger(false)} className="text-gray-400 hover:text-dark">
                <X className="w-6 h-6" />
              </button>
            </div>
            <EditLedgerForm 
              ledger={ledger}
              onSubmit={handleUpdateLedger}
              onCancel={() => setShowEditLedger(false)}
              isLoading={actionLoading}
            />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-dark">
                <X className="w-6 h-6" />
              </button>
            </div>
            <TransactionForm 
              initialData={editingTransaction} 
              onSubmit={handleSaveTransaction} 
              onCancel={() => setShowAddForm(false)}
              isLoading={actionLoading}
            />
          </div>
        </div>
      )}

      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-dark">Import Transactions</h3>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-dark">
                <X className="w-6 h-6" />
              </button>
            </div>
            <TransactionParserPreview 
              onConfirm={handleImportTransactions}
              onCancel={() => setShowImport(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
