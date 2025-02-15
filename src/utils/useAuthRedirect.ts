import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useAuthRedirect() {
  const { currentVendor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is logged in and tries to access /login, redirect to dashboard
    if (currentVendor && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [currentVendor, location, navigate]);

  return { currentVendor };
}