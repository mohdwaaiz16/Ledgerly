import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Activity, Download, Building2, ArrowRight } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-dark">Ledgerly</div>
        <div className="space-x-4">
          <Link to="/login" className="text-dark font-medium hover:text-dark-secondary transition-colors">Sign In</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6 tracking-tight">
          Modern Ledger <br className="hidden md:block" /> Management
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The professional platform to create accounts, maintain ledgers, calculate balances, and generate beautiful PDFs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-24">
          <Link to="/signup" className="btn-primary flex items-center justify-center text-lg px-8 py-4">
            Start for free <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-dark w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Ledgers</h3>
            <p className="text-gray-600">Easily create and manage ledgers for different clients and vendors.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-dark w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Transactions</h3>
            <p className="text-gray-600">Record debits and credits with automated balance calculations.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
              <Download className="text-dark w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generate PDFs</h3>
            <p className="text-gray-600">Export professional, beautiful PDF statements with a single click.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
              <Building2 className="text-dark w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manage Records</h3>
            <p className="text-gray-600">Organize your company and customer records in one secure place.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
