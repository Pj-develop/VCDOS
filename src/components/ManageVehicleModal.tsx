import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { Vehicle, Driver } from '../types/vendor';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Vehicle>) => Promise<Vehicle>;
  onDelete: (id: string) => Promise<void>;
  availableDrivers: Driver[];
}

export function ManageVehicleModal({ vehicle, onClose, onUpdate, onDelete}: Props) {
  const [formData, setFormData] = useState({
    registrationNumber: vehicle.registrationNumber,
    model: vehicle.model,
    type: vehicle.type,
    seatingCapacity: vehicle.seatingCapacity,
    fuelType: vehicle.fuelType,
    status: vehicle.status,
    documents: vehicle.documents
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onUpdate(vehicle.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await onDelete(vehicle.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentStatusChange = (documentType: keyof Vehicle['documents'], status: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: status
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Manage Vehicle</h2>
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
            {/* Vehicle Details Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
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
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
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
                  value={formData.fuelType}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Vehicle['status'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <div className="space-y-4">
                {Object.entries(formData.documents).map(([docType, status]) => (
                  <div key={docType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {docType.replace('_', ' ')}
                      </h4>
                      <p className={`text-sm ${
                        status === 'valid' ? 'text-green-600' :
                        status === 'expired' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {status}
                      </p>
                    </div>
                    <select
                      value={status}
                      onChange={(e) => handleDocumentStatusChange(docType as keyof Vehicle['documents'], e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="valid">Valid</option>
                      <option value="expired">Expired</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Vehicle
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Delete Vehicle</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-red-400"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 