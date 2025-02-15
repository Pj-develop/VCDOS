import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Car, Building2, AlertTriangle } from 'lucide-react';

export default function LocalDashboard() {
  const { currentVendor, hasPermission } = useAuth();

  const stats = [
    { name: 'My Drivers', value: '8', icon: Users },
    { name: 'My Vehicles', value: '5', icon: Car },
    { name: 'Today\'s Trips', value: '15', icon: Building2 },
    { name: 'Alerts', value: '2', icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Local Operations - {currentVendor?.location}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your local fleet and drivers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {hasPermission('manage_drivers') && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Management</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Active Drivers</span>
                      </div>
                      <span className="text-green-600 font-medium">6</span>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Document Updates</span>
                      </div>
                      <span className="text-yellow-600 font-medium">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasPermission('manage_vehicles') && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Status</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">On Duty</span>
                      </div>
                      <span className="text-blue-600 font-medium">4</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Maintenance</span>
                      </div>
                      <span className="text-purple-600 font-medium">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Operations</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    Driver Amit started his shift
                  </p>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    Vehicle MH02CD5678 completed daily inspection
                  </p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}