import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { CompanySetup } from './pages/CompanySetup';
import { Settings } from './pages/Settings';
import { Ledgers } from './pages/Ledgers';
import { NewLedger } from './pages/NewLedger';
import { LedgerDetail } from './pages/LedgerDetail';
import { LedgerPreview } from './pages/LedgerPreview';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { UpdatePrompt } from './components/pwa/UpdatePrompt';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InstallPrompt />
        <UpdatePrompt />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/company-setup" element={<ProtectedRoute><CompanySetup /></ProtectedRoute>} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ledgers" element={<Ledgers />} />
            <Route path="ledgers/new" element={<NewLedger />} />
            <Route path="ledgers/:ledgerId" element={<LedgerDetail />} />
            <Route path="ledgers/:ledgerId/preview" element={<LedgerPreview />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
