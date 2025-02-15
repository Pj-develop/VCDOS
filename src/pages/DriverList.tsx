import { useState } from 'react';
import { ChevronDown, Plus, Search, User, FileText, Truck, AlertCircle } from 'lucide-react';
import type { Driver, DriverOnboardingStatus } from '../types/vendor';
import { useDriverStore } from '../stores/driverStore';
import { AddDriverModal } from '../components/AddDriverModal';
import { ManageDriverModal } from '../components/ManageDriverModal';

export default function DriverList() {
  const { 
    drivers,
    addDriver,
    updateOnboardingStatus,
    uploadDocument 
  } = useDriverStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | DriverOnboardingStatus>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Filter drivers based on search term and status
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || driver.onboardingStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-50 text-green-700 ring-green-600/20',
      inactive: 'bg-gray-50 text-gray-700 ring-gray-600/20',
      suspended: 'bg-red-50 text-red-700 ring-red-600/20',
      pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
      in_progress: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      completed: 'bg-green-50 text-green-700 ring-green-600/20',
      rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getDocumentStatusIcon = (driver: Driver) => {
    const hasAllDocuments = Object.keys(driver.documents).length >= 3; // DL, RC, Permit
    const allVerified = Object.values(driver.documents).every(doc => doc.status === 'verified');
    
    if (!hasAllDocuments) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" aria-label="Missing Documents" />;
    }
    return allVerified ? 
      <FileText className="h-5 w-5 text-green-500" aria-label="All Documents Verified" /> : 
      <FileText className="h-5 w-5 text-gray-400" aria-label="Pending Verification" />;
  };

  const handleAddDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'onboardingStatus' | 'documents'>) => {
    try {
      await addDriver({
        ...driverData,
        documents: {}  // Add empty documents object
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to add driver:', error);
      // You might want to show an error toast/notification here
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage drivers, documents, and onboarding status
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="mt-4 sm:mt-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Pending Verifications
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Driver
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        License
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Vehicle
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Documents
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Onboarding
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {driver.name}
                              </div>
                              <div className="text-gray-500">{driver.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {driver.licenseNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Truck className="mr-2 h-4 w-4 text-gray-400" />
                            {driver.vehicleId || 'Not assigned'}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {getDocumentStatusIcon(driver)}
                            <span className="ml-2">
                              {Object.keys(driver.documents).length}/3
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(driver.status)}`}
                          >
                            {driver.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeColor(driver.onboardingStatus)}`}
                          >
                            {driver.onboardingStatus}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button 
                            onClick={() => setSelectedDriver(driver)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Manage<span className="sr-only">, {driver.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showUploadModal && (
        <AddDriverModal 
          onClose={() => setShowUploadModal(false)} 
          onAdd={handleAddDriver}
          vendorId="your-vendor-id" // Replace with actual vendor ID from your auth context or props
        />
      )}

      {/* Manage Driver Modal */}
      {selectedDriver && (
        <ManageDriverModal 
          driver={selectedDriver} 
          onClose={() => setSelectedDriver(null)}
          onUploadDocument={uploadDocument}
          onUpdateStatus={updateOnboardingStatus}
        />
      )}
    </div>
  );
}