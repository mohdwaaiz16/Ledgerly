import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Settings, Menu, X, Activity, FileBarChart } from 'lucide-react';

export const Layout = () => {
  const { signOut, company } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Ledgers', path: '/ledgers', icon: FileText },
    { name: 'Transactions', path: '/transactions', icon: Activity, disabled: true },
    { name: 'Reports', path: '/reports', icon: FileBarChart, disabled: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-dark">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-dark">Ledgerly</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.disabled) {
              return (
                <button key={item.name} disabled className="flex items-center px-4 py-3 w-full text-left text-gray-400 rounded-md cursor-not-allowed">
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive ? 'bg-accent text-dark font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-semibold truncate">{company?.company_name}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation for Mobile */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <Link to="/" className="text-xl font-bold text-dark">Ledgerly</Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-dark focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[65px] bg-white z-20 flex flex-col">
            <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                if (item.disabled) {
                  return (
                    <button key={item.name} disabled className="flex items-center px-4 py-3 w-full text-left text-gray-400 rounded-md cursor-not-allowed">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-accent text-dark font-medium' : 'text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold truncate">{company?.company_name}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center px-4 py-3 w-full text-left text-red-600 font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
