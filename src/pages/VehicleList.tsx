import React, { useState } from 'react';
import { Car, ChevronDown, Plus, Search } from 'lucide-react';
import type { Vehicle } from '../types/vendor';

const mockVehicles: Vehicle[] = [
  {
    id: 'V1',
    registrationNumber: 'MH01AB1234',
    model: 'Toyota Camry',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'Petrol',
    vendorId: '2',
    driverId: '1',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'valid',
    },
  },
];

export default function VehicleList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage vehicles and their documents
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Vehicle
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Driver
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {mockVehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <Car className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {vehicle.model}
                              </div>
                              <div className="text-gray-500">
                                {vehicle.registrationNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {vehicle.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.driverId || 'Unassigned'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              vehicle.status === 'active'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Edit
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
    </div>
  );
}