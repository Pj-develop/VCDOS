import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Vehicle, Driver, DocumentStatus } from '../types/vendor';

interface AddVehicleFormData {
  registrationNumber: string;
  model: string;
  type: string;
  seatingCapacity: number;
  fuelType: string;
  driverId?: string;
  documents: {
    registration: DocumentStatus;
    insurance: DocumentStatus;
    permit: DocumentStatus;
  };
}

interface Props {
  onClose: () => void;
  onAdd: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  vendorId: string;
  availableDrivers: Driver[];
}

export function AddVehicleModal({ onClose, onAdd, vendorId }: Props) {
  const [formData, setFormData] = useState<AddVehicleFormData>({
    registrationNumber: '',
    model: '',
    type: '',
    seatingCapacity: 4,
    fuelType: '',
    documents: {
      registration: 'pending' as DocumentStatus,
      insurance: 'pending' as DocumentStatus,
      permit: 'pending' as DocumentStatus
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const vehicleData: Omit<Vehicle, 'id'> = {
        ...formData,
        vendorId,
        status: 'inactive',
        documents: {
          registration: formData.documents.registration as DocumentStatus,
          insurance: formData.documents.insurance as DocumentStatus,
          permit: formData.documents.permit as DocumentStatus
        }
      };
      await onAdd(vehicleData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Vehicle</h2>
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

          <div className="space-y-4">
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                required
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="MPV">MPV</option>
              </select>
            </div>

            <div>
              <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700">
                Seating Capacity
              </label>
              <input
                type="number"
                id="seatingCapacity"
                name="seatingCapacity"
                required
                min="2"
                max="20"
                value={formData.seatingCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, seatingCapacity: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <select
                id="fuelType"
                name="fuelType"
                required
                value={formData.fuelType}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select fuel type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:bg-indigo-400"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 