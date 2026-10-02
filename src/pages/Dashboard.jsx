import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Scale, Files } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentLedgers } from '../components/dashboard/RecentLedgers';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatCurrency, calculateTotalDebit, calculateTotalCredit, calculateBalance } from '../utils/ledgerCalculations';

export const Dashboard = () => {
  const { company } = useAuth();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!company) return;
      try {
        const { data, error } = await supabase
          .from('ledgers')
          .select('*, transactions(*)')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLedgers(data || []);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [company]);

  // Calculate global stats across all ledgers
  const allTransactions = ledgers.flatMap(l => l.transactions || []);
  const totalDebit = calculateTotalDebit(allTransactions);
  const totalCredit = calculateTotalCredit(allTransactions);
  const closingBalance = calculateBalance(allTransactions);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Debit"
          value={loading ? '...' : formatCurrency(totalDebit)}
          icon={ArrowDownRight}
        />
        <StatCard
          title="Total Credit"
          value={loading ? '...' : formatCurrency(totalCredit)}
          icon={ArrowUpRight}
        />
        <StatCard
          title="Closing Balance"
          value={loading ? '...' : formatCurrency(closingBalance)}
          icon={Scale}
        />
        <StatCard
          title="Total Ledgers"
          value={loading ? '...' : String(ledgers.length)}
          icon={Files}
        />
      </div>

      <RecentLedgers ledgers={ledgers} loading={loading} />
    </div>
  );
};
