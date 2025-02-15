import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Vendor, Permission } from '../types/vendor';
import { LoadingScreen } from '../components/LoadingScreen';

interface AuthContextType {
  currentVendor: Vendor | null;
  hasPermission: (permission: Permission) => boolean;
  login: (vendor: Vendor) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const mockVendors: Vendor[] = [
  //   {
  //     id: '1',
  //     name: 'Super Vendor HQ',
  //     location: 'Global HQ',
  //     permissions: ['all'],
  //     level: 'super',
  //     email: 'super@vendor.com',
  //     phone: '123-456-7890',
  //     status: 'active',
  //     createdAt: new Date().toISOString()
  //   },
  //   {
  //     id: '2',
  //     name: 'North Region Vendor',
  //     location: 'North Region',
  //     permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'],
  //     level: 'regional',
  //     email: 'north@vendor.com',
  //     phone: '123-456-7891',
  //     status: 'active',
  //     createdAt: new Date().toISOString()
  //   },
  //   {
  //     id: '3',
  //     name: 'City A Vendor',
  //     location: 'City A',
  //     permissions: ['manage_drivers', 'view_reports'],
  //     level: 'city',
  //     email: 'citya@vendor.com',
  //     phone: '123-456-7892',
  //     status: 'active',
  //     createdAt: new Date().toISOString()
  //   }
  // ];

  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, you would check for an existing session here
        const savedVendor = localStorage.getItem('currentVendor');
        if (savedVendor) {
          setCurrentVendor(JSON.parse(savedVendor));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const hasPermission = (permission: Permission) => {
    if (!currentVendor) return false;
    if (currentVendor.permissions.includes('all')) return true;
    return currentVendor.permissions.includes(permission);
  };

  const login = (vendor: Vendor) => {
    setCurrentVendor(vendor);
    localStorage.setItem('currentVendor', JSON.stringify(vendor));
  };

  const logout = () => {
    setCurrentVendor(null);
    localStorage.removeItem('currentVendor');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ currentVendor, hasPermission, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}