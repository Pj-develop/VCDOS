import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Car, Building2, AlertTriangle } from 'lucide-react';

export default function CityDashboard() {
  const { currentVendor, hasPermission } = useAuth();

  const stats = [
    { name: 'Active Drivers', value: '18', icon: Users },
    { name: 'Available Vehicles', value: '12', icon: Car },
    { name: 'Ongoing Trips', value: '25', icon: Building2 },
    { name: 'Pending Tasks', value: '3', icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          City Dashboard - {currentVendor?.location}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your city operations and local services
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Status</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">12 Drivers On Duty</span>
                  </div>
                  <button className="text-sm text-green-600 hover:text-green-700">
                    View Details
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">3 Document Renewals Due</span>
                  </div>
                  <button className="text-sm text-yellow-600 hover:text-yellow-700">
                    Process Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasPermission('manage_vehicles') && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Operations</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">8 Vehicles Available</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Assign Drivers
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-900">4 Maintenance Scheduled</span>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Activity</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    Driver Rajesh completed 8 trips
                  </p>
                  <p className="text-xs text-gray-400">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">
                    Vehicle MH01AB1234 maintenance completed
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}