import React, { useState } from 'react';
import { parseTransactions } from '../../utils/transactionParser';

export const TransactionParserPreview = ({ onConfirm, onCancel }) => {
  const [text, setText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);

  const handleParse = () => {
    if (!text.trim()) return;
    const result = parseTransactions(text);
    setParsedResult(result);
  };

  return (
    <div className="space-y-6">
      {!parsedResult ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Paste Transaction Text</label>
          <p className="text-xs text-gray-500 mb-2">
            Example: 10-Sep-26 By Canara Bank Receipt 100000
          </p>
          <textarea
            className="input-field min-h-[200px] font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your ledger transactions here..."
          />
          <div className="flex justify-end space-x-3">
            <button onClick={onCancel} className="btn-secondary">Cancel</button>
            <button onClick={handleParse} disabled={!text.trim()} className="btn-primary">Parse Transactions</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-dark">Preview Import</h3>
          
          {parsedResult.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="text-red-800 font-semibold mb-2">Errors found ({parsedResult.errors.length})</h4>
              <ul className="text-sm text-red-700 space-y-2 max-h-40 overflow-y-auto">
                {parsedResult.errors.map((err, idx) => (
                  <li key={idx}>
                    <strong>Line {err.lineNumber}:</strong> {err.reason} <br />
                    <span className="text-red-500/80 block mt-1">"{err.originalText}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Particulars</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Vch Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Vch No.</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Debit</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parsedResult.transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No valid transactions found.</td>
                    </tr>
                  ) : (
                    parsedResult.transactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-green-600 font-medium">Ready</td>
                        <td className="px-4 py-3">{t.transaction_date}</td>
                        <td className="px-4 py-3">{t.particulars}</td>
                        <td className="px-4 py-3">{t.voucher_type}</td>
                        <td className="px-4 py-3">{t.voucher_number}</td>
                        <td className="px-4 py-3 text-right">{t.debit > 0 ? t.debit.toFixed(2) : '-'}</td>
                        <td className="px-4 py-3 text-right">{t.credit > 0 ? t.credit.toFixed(2) : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={() => setParsedResult(null)} className="btn-secondary">Back to Edit</button>
            <button 
              onClick={() => onConfirm(parsedResult.transactions)} 
              disabled={parsedResult.transactions.length === 0} 
              className="btn-primary"
            >
              Confirm Import ({parsedResult.transactions.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
