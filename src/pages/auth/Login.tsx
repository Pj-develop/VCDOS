import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2 } from 'lucide-react';
import { useAuthRedirect } from '../../utils/useAuthRedirect';
import { vendorLevelPermissions } from '../../types/vendor';

interface LoginFormData {
  email: string;
  password: string;
  vendorId: string;
}

const mockVendors = [
  {
    id: '1',
    name: 'Super Vendor HQ',
    location: 'Global HQ',
    permissions: vendorLevelPermissions.super.defaultPermissions,
    level: 'super' as const,
    email: 'super@vendor.com',
    phone: '123-456-7890',
    status: 'active' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'North Region Vendor',
    location: 'North Region',
    permissions: vendorLevelPermissions.regional.defaultPermissions,
    level: 'regional' as const,
    email: 'north@vendor.com',
    phone: '123-456-7891',
    status: 'active' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'City A Vendor',
    location: 'City A', 
    permissions: vendorLevelPermissions.city.defaultPermissions,
    level: 'city' as const,
    email: 'citya@vendor.com',
    phone: '123-456-7892',
    status: 'active' as const,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Local Vendor A',
    location: 'Local Area A',
    permissions: vendorLevelPermissions.local.defaultPermissions,
    level: 'local' as const,
    email: 'local@vendor.com',
    phone: '123-456-7893',
    status: 'active' as const,
    createdAt: new Date().toISOString()
  }
];

export default function Login() {
  useAuthRedirect();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    vendorId: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  // Get the redirect path from location state, or default to '/'
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find the selected vendor
      const selectedVendor = mockVendors.find(v => v.id === formData.vendorId);
      
      if (!selectedVendor) {
        throw new Error('Please select a vendor role');
      }

      if (formData.email !== selectedVendor.email) {
        throw new Error('Invalid email for selected vendor');
      }

      // In a real app, you would validate the password here
      if (formData.password.length < 6) {
        throw new Error('Invalid password');
      }

      login(selectedVendor);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Vendor Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                id="vendorId"
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Select a role</option>
                {mockVendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>Super Admin: super@vendor.com</p>
              <p>Regional Admin: north@vendor.com</p>
              <p>City Admin: citya@vendor.com</p>
              <p>Local Admin: local@vendor.com</p>
              <p className="text-xs">Password: any 6+ characters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}