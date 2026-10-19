import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminWrapperProps {
  children: ReactNode;
}

export const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { isAdmin, isEditMode } = useAuth();

  if (!isAdmin || !isEditMode) {
    return null;
  }

  return <>{children}</>;
};


