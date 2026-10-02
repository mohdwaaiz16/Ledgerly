import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateBalance } from '../../utils/ledgerCalculations';

export const RecentLedgers = ({ ledgers = [], loading = false }) => {
  const recent = ledgers.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-dark">Recent Ledgers</h3>
        <Link to="/ledgers" className="text-sm font-medium text-gray-500 hover:text-dark transition-colors">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading...</div>
      ) : recent.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-dark mb-2">No ledgers yet</h4>
          <p className="text-gray-500 mb-6 max-w-sm">
            Create your first ledger to start recording business transactions.
          </p>
          <Link to="/ledgers/new" className="btn-secondary">
            Create Ledger
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {recent.map((ledger) => {
            const balance = calculateBalance(ledger.transactions || []);
            
            return (
              <Link 
                key={ledger.id} 
                to={`/ledgers/${ledger.id}`}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <FileText className="w-5 h-5 text-dark" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">{ledger.ledger_name}</h4>
                    <p className="text-sm text-gray-500">
                      {ledger.from_date && ledger.to_date ? `${ledger.from_date} to ${ledger.to_date}` : 'All time'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:space-x-8 pl-14 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500 mb-0.5">Balance</p>
                    <p className={`font-semibold ${balance >= 0 ? 'text-dark' : 'text-red-600'}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-dark transition-colors hidden sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
