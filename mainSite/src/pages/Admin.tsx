import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      // Redirect to home as admin controls are now inline
      navigate('/');
    }
  }, [user, navigate]);

  return null;
};

export default Admin; 