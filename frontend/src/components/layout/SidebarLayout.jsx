import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, CheckSquare, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#f8f9fe] border-r border-indigo-100/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-indigo-100/50">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-indigo-200">
            <CheckSquare className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-indigo-950 tracking-tight">TaskFlow</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-slate-500 hover:bg-indigo-50/50 hover:text-indigo-700'
                }`}
              >
                <item.icon className={`mr-3 w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-3 w-5 h-5 text-slate-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm z-10">
          <h2 className="text-lg font-medium text-slate-800">Overview</h2>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
