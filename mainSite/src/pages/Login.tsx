import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If already logged in, go to home
    if (user) {
      navigate('/');
    } else {
      // Redirect to admin login page
      navigate('/admin/login');
    }
  }, [user, navigate]);

  return null;
}