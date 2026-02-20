import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          Welcome, <span className="font-medium text-gray-800">{user?.name}</span>
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
          {user?.role}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
