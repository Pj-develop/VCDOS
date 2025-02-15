import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Car, Building2, AlertTriangle } from 'lucide-react';

export default function RegionalDashboard() {
  const { currentVendor, hasPermission } = useAuth();

  const stats = [
    { name: 'Total Drivers', value: '45', icon: Users },
    { name: 'Active Vehicles', value: '32', icon: Car },
    { name: 'City Vendors', value: '8', icon: Building2 },
    { name: 'Document Approvals', value: '5', icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Regional Dashboard - {currentVendor?.location}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your regional operations and city vendors
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

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {hasPermission('manage_drivers') && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Management</h2>
              <div className="space-y-4">
                <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="font-medium">Onboard New Driver</span>
                  <Users className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="font-medium">Document Verification</span>
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {hasPermission('manage_vehicles') && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Management</h2>
              <div className="space-y-4">
                <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="font-medium">Register New Vehicle</span>
                  <Car className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="font-medium">Maintenance Schedule</span>
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    New driver onboarded in Mumbai city
                  </p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    Vehicle maintenance completed for 5 cars
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