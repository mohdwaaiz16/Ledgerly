import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Download, Printer, Share2 } from 'lucide-react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { LedgerDocument } from '../pdf/LedgerDocument';

export const LedgerPreview = () => {
  const { ledgerId } = useParams();
  const navigate = useNavigate();
  const { company } = useAuth();
  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledgerRes, transactionsRes] = await Promise.all([
          supabase.from('ledgers').select('*').eq('id', ledgerId).single(),
          supabase.from('transactions').select('*').eq('ledger_id', ledgerId).order('transaction_date', { ascending: true })
        ]);

        if (ledgerRes.error) throw ledgerRes.error;
        if (transactionsRes.error) throw transactionsRes.error;

        // Verify company ownership to ensure strict RLS handling on the client side just in case
        if (ledgerRes.data.company_id !== company?.id) {
          throw new Error('Unauthorized');
        }

        setLedger(ledgerRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        console.error('Error fetching data for PDF preview:', err);
        navigate('/ledgers');
      } finally {
        setLoading(false);
      }
    };

    if (company) {
      fetchData();
    }
  }, [ledgerId, company, navigate]);

  if (loading) return <div className="text-center py-12">Generating preview...</div>;
  if (!ledger) return <div className="text-center py-12">Ledger not found</div>;

  const fileName = `Ledgerly_${ledger.ledger_name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  const handlePrint = async () => {
    try {
      const blob = await pdf(<LedgerDocument company={company} ledger={ledger} transactions={transactions} />).toBlob();
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } catch (err) {
      console.error('Print failed', err);
    }
  };

  const handleShare = async () => {
    try {
      const blob = await pdf(<LedgerDocument company={company} ledger={ledger} transactions={transactions} />).toBlob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Ledger document for ${ledger.ledger_name}`,
        });
      } else {
        alert('File sharing is not supported on this device/browser. Please download the PDF instead.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 shrink-0">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Link to={`/ledgers/${ledgerId}`} className="text-gray-500 hover:text-dark flex items-center bg-gray-50 px-3 py-2 rounded-md transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ledger
          </Link>
          <h2 className="text-lg font-bold text-dark hidden md:block">Document Preview</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button onClick={handlePrint} className="btn-secondary flex-1 sm:flex-none justify-center">
            <Printer className="w-4 h-4 mr-2" /> Print
          </button>
          <button onClick={handleShare} className="btn-secondary flex-1 sm:flex-none justify-center">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          
          <PDFDownloadLink
            document={<LedgerDocument company={company} ledger={ledger} transactions={transactions} />}
            fileName={fileName}
            className="btn-primary flex-1 sm:flex-none flex justify-center items-center"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Preparing...' : <><Download className="w-4 h-4 mr-2" /> Download PDF</>
            }
          </PDFDownloadLink>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
        <PDFViewer width="100%" height="100%" className="border-none">
          <LedgerDocument company={company} ledger={ledger} transactions={transactions} />
        </PDFViewer>
      </div>
    </div>
  );
};
