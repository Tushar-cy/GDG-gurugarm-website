import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-lg animate-slide-in-right ${colorClass} min-w-[200px] max-w-[400px]`}>
      <Icon className="flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};


