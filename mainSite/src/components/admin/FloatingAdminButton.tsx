import React from 'react';
import { PencilIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

export const FloatingAdminButton: React.FC = () => {
  const { user, isEditMode, toggleEditMode, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {/* Admin Badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm">
        <ShieldCheckIcon className="h-4 w-4 text-gray-900" />
        <span className="text-sm font-medium text-gray-900">
          {user.email?.split('@')[0]}
        </span>
      </div>

      {/* Edit Mode Toggle */}
      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-2.5 px-5 py-3 rounded-full transition-all shadow-sm border ${
          isEditMode
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <PencilIcon className="h-5 w-5" />
        <span className="text-sm font-semibold">
          {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
        </span>
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-5 py-3 bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <span className="text-sm font-semibold">Logout</span>
      </button>
    </div>
  );
};
