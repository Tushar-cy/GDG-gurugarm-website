import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('gdg_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Auto-enable edit mode for admins
        if (parsedUser.role === 'admin') {
          setIsEditMode(true);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('gdg_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // For now, simple mock authentication
    if (email === 'admin@gdg.com' && password === 'Kronos@998#') {
      const adminUser: User = {
        id: '1',
        email: 'admin@gdg.com',
        name: 'Admin User',
        role: 'admin',
      };
      setUser(adminUser);
      setIsEditMode(true); // Auto-enable edit mode for admins
      localStorage.setItem('gdg_user', JSON.stringify(adminUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsEditMode(false);
    localStorage.removeItem('gdg_user');
  };

  const toggleEditMode = () => {
    if (user?.role === 'admin') {
      setIsEditMode(!isEditMode);
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    user,
    login,
    logout,
    isEditMode,
    toggleEditMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};