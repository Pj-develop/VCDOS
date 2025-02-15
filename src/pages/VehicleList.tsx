import { useState, useEffect } from 'react';
import { 

  Plus, 
  Search, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import type { Vehicle, DocumentStatus } from '../types/vendor';
import { useVehicleStore } from '../stores/vehicleStore';
import { useDriverStore } from '../stores/driverStore';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { ManageVehicleModal } from '../components/ManageVehicleModal';

export default function VehicleList() {
  const { 
    vehicles,
    loading: vehicleLoading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    checkVehicleCompliance,
    getNonCompliantVehicles,
    verifyDocument
  } = useVehicleStore();

  const {
    drivers,
    getActiveDrivers,
    getCompliantDrivers
  } = useDriverStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Vehicle['status']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [complianceWarnings, setComplianceWarnings] = useState<Record<string, string[]>>({});
  const [documentVerificationLoading, setDocumentVerificationLoading] = useState<string | null>(null);

  // Get non-compliant vehicles for highlighting
  const nonCompliantVehicles = getNonCompliantVehicles();
  const activeDrivers = getActiveDrivers();

  // Enhanced compliance check
  useEffect(() => {
    const checkCompliance = () => {
      const warnings: Record<string, string[]> = {};
      vehicles.forEach(vehicle => {
        const issues: string[] = [];
        
        // Check document statuses
        Object.entries(vehicle.documents).forEach(([docType, status]) => {
          switch (status) {
            case 'expired':
              issues.push(`${docType.charAt(0).toUpperCase() + docType.slice(1)} has expired`);
              break;
            case 'pending':
              issues.push(`${docType.charAt(0).toUpperCase() + docType.slice(1)} verification pending`);
              break;
            case 'rejected':
              issues.push(`${docType.charAt(0).toUpperCase() + docType.slice(1)} was rejected`);
              break;
          }
        });

        // Check driver assignment if required
        if (!vehicle.driverId && vehicle.status === 'active') {
          issues.push('No driver assigned');
        }

        if (issues.length > 0) {
          warnings[vehicle.id] = issues;
        }
      });
      setComplianceWarnings(warnings);
    };

    checkCompliance();
    const interval = setInterval(checkCompliance, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, [vehicles]);

  // Handle document verification
  const handleVerifyDocument = async (
    vehicleId: string, 
    documentType: keyof Vehicle['documents'], 
    newStatus: DocumentStatus
  ) => {
    setDocumentVerificationLoading(vehicleId);
    try {
      await verifyDocument(vehicleId, documentType, newStatus);
      
      // Check if all documents are verified
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        const allVerified = Object.values(vehicle.documents).every(status => status === 'valid');
        if (allVerified) {
          await updateVehicle(vehicleId, { status: 'active' });
        }
      }
    } catch (error) {
      console.error('Failed to verify document:', error);
    } finally {
      setDocumentVerificationLoading(null);
    }
  };

  // Get status badge color with enhanced states
  const getStatusBadgeColor = (status: Vehicle['status']) => {
    const colors = {
      active: 'bg-green-50 text-green-700 ring-green-600/20',
      inactive: 'bg-gray-50 text-gray-700 ring-gray-600/20',
      suspended: 'bg-red-50 text-red-700 ring-red-600/20',
      pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
    };
    return colors[status];
  };

  // Enhanced compliance status with verification actions
  const getComplianceStatus = (vehicle: Vehicle) => {
    const warnings = complianceWarnings[vehicle.id] || [];
    const isVerifying = documentVerificationLoading === vehicle.id;

    if (isVerifying) {
      return {
        icon: <Loader className="h-5 w-5 text-blue-500 animate-spin" />,
        text: 'Verifying...',
        className: 'text-blue-500'
      };
    }

    if (warnings.length > 0) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: warnings.join(', '),
        className: 'text-red-500',
        actions: (
          <div className="flex space-x-2">
            {Object.entries(vehicle.documents).map(([docType, status]) => {
              if (status === 'pending') {
                return (
                  <div key={docType} className="flex space-x-1">
                    <button
                      onClick={() => handleVerifyDocument(vehicle.id, docType as keyof Vehicle['documents'], 'valid')}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleVerifyDocument(vehicle.id, docType as keyof Vehicle['documents'], 'rejected')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )
      };
    }

    return {
      icon: <FileText className="h-5 w-5 text-green-500" />,
      text: 'Compliant',
      className: 'text-green-500'
    };
  };

  // Filter vehicles based on search term and status
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      await addVehicle(vehicleData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add vehicle:', error);
    }
  };

  // Loading state handling
  if (vehicleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading vehicles...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your vehicles, track compliance, and handle assignments
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="max-w-xs">
            <label htmlFor="search" className="sr-only">Search vehicles</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <select
            id="status"
            name="status"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Vehicle['status'])}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Registration
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Model
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Capacity
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Fuel
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Compliance
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => {
                  const compliance = getComplianceStatus(vehicle);
                  const isNonCompliant = nonCompliantVehicles.includes(vehicle);

                  return (
                    <tr key={vehicle.id} className={isNonCompliant ? 'bg-red-50' : ''}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {vehicle.registrationNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {vehicle.model}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {vehicle.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {vehicle.seatingCapacity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {vehicle.fuelType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className={`flex items-center justify-between ${compliance.className}`}>
                          <div className="flex items-center">
                            {compliance.icon}
                            <span className="ml-2">{compliance.text}</span>
                          </div>
                          {compliance.actions}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Manage<span className="sr-only">, {vehicle.registrationNumber}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddVehicle}
          vendorId="your-vendor-id"
          availableDrivers={getCompliantDrivers()}
        />
      )}

      {selectedVehicle && (
        <ManageVehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdate={updateVehicle}
          onDelete={deleteVehicle}
          availableDrivers={activeDrivers}
        />
      )}
    </div>
  );
}