import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Driver } from '../types/vendor';

interface AddDriverFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
}

interface Props {
  onClose: () => void;
  onAdd: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'onboardingStatus' | 'documents'>) => Promise<void>;
  vendorId: string;
}

export function AddDriverModal({ onClose, onAdd, vendorId }: Props) {
  const [formData, setFormData] = useState<AddDriverFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'basic' | 'bank'>('basic');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('bank.')) {
      const bankField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onAdd({
        ...formData,
        vendorId,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Driver</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Step indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setCurrentStep('basic')}
                className={`flex-1 text-center pb-4 border-b-2 ${
                  currentStep === 'basic'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                Basic Details
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('bank')}
                className={`flex-1 text-center pb-4 border-b-2 ${
                  currentStep === 'bank'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                Bank Details
              </button>
            </div>
          </div>

          {currentStep === 'basic' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  id="licenseNumber"
                  required
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="bank.accountHolderName" className="block text-sm font-medium text-gray-700">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="bank.accountHolderName"
                  id="bank.accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="bank.accountNumber" className="block text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bank.accountNumber"
                  id="bank.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="bank.bankName" className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank.bankName"
                  id="bank.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="bank.ifscCode" className="block text-sm font-medium text-gray-700">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="bank.ifscCode"
                  id="bank.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Cancel
            </button>
            {currentStep === 'basic' ? (
              <button
                type="button"
                onClick={() => setCurrentStep('bank')}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:bg-indigo-400"
              >
                {loading ? 'Adding...' : 'Add Driver'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 