import React, { useState } from 'react';
import { Users, Car, Building2, AlertTriangle, Plus, Search, ChevronDown } from 'lucide-react';
import { Tree, TreeNode } from 'react-organizational-chart';
import type { Vendor } from '../types/vendor';
import { Dialog } from '@headlessui/react';

const stats = [
  { name: 'Total Vendors', value: '24', icon: Building2 },
  { name: 'Active Drivers', value: '156', icon: Users },
  { name: 'Total Vehicles', value: '89', icon: Car },
  { name: 'Pending Approvals', value: '12', icon: AlertTriangle },
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Super Vendor Corp',
    level: 'super',
    email: 'super@vendor.com',
    phone: '+1234567890',
    location: 'National',
    status: 'active',
    createdAt: '2024-03-15',
    permissions: ['all'],
    children: [
      {
        id: '2',
        name: 'Regional Vendor East',
        level: 'regional',
        parentId: '1',
        email: 'east@vendor.com',
        phone: '+1234567891',
        location: 'East Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_drivers', 'manage_vehicles'],
        children: [
          {
            id: '4',
            name: 'Mumbai City Vendor',
            level: 'city',
            parentId: '2',
            email: 'mumbai@vendor.com',
            phone: '+1234567893',
            location: 'Mumbai',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers'],
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'Regional Vendor West',
        level: 'regional',
        parentId: '1',
        email: 'west@vendor.com',
        phone: '+1234567892',
        location: 'West Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_drivers', 'manage_vehicles'],
        children: [],
      },
    ],
  },
];

interface VendorNodeProps {
  vendor: Vendor;
  onEdit?: (vendor: Vendor) => void;
  onAddChild?: (vendor: Vendor) => void;
}

function VendorNode({ vendor, onEdit, onAddChild }: VendorNodeProps) {
  return (
    <div className="relative p-4 bg-white rounded-lg shadow-md border border-gray-200 min-w-[200px]">
      <div className="flex items-center mb-2">
        <div className="h-10 w-10 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{vendor.name}</h3>
          <p className="text-xs text-gray-500">{vendor.level}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onEdit?.(vendor)}
          className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
        >
          Edit
        </button>
        <button
          onClick={() => onAddChild?.(vendor)}
          className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
        >
          Add Sub-vendor
        </button>
      </div>
    </div>
  );
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentVendor?: Vendor;
}

function AddVendorModal({ isOpen, onClose, parentVendor }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    level: parentVendor ? 
      (parentVendor.level === 'super' ? 'regional' : 
       parentVendor.level === 'regional' ? 'city' : 'local') : 'super',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {parentVendor ? `Add Sub-vendor under ${parentVendor.name}` : 'Add Super Vendor'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <input
                type="text"
                value={formData.level}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add Vendor
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function renderVendorTree(
  vendor: Vendor,
  onEdit: (vendor: Vendor) => void,
  onAddChild: (vendor: Vendor) => void
) {
  return (
    <TreeNode
      key={vendor.id}
      label={
        <VendorNode
          vendor={vendor}
          onEdit={onEdit}
          onAddChild={onAddChild}
        />
      }
    >
      {vendor.children?.map((child) =>
        renderVendorTree(child, onEdit, onAddChild)
      )}
    </TreeNode>
  );
}

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParentVendor, setSelectedParentVendor] = useState<Vendor | undefined>();

  const handleEditVendor = (vendor: Vendor) => {
    // Handle vendor editing
    console.log('Edit vendor:', vendor);
  };

  const handleAddChild = (parentVendor: Vendor) => {
    setSelectedParentVendor(parentVendor);
    setIsAddModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your vendor hierarchy and monitor system performance
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

      <div className="mt-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-gray-900">Vendor Hierarchy</h2>
            <p className="mt-2 text-sm text-gray-700">
              View and manage your vendor organization structure
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setSelectedParentVendor(undefined);
                setIsAddModalOpen(true);
              }}
              className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Super Vendor
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="overflow-x-auto">
            <Tree
              lineWidth="2px"
              lineColor="#E5E7EB"
              lineBorderRadius="6px"
              label={<div className="mb-4">Organization Structure</div>}
            >
              {mockVendors.map((vendor) =>
                renderVendorTree(vendor, handleEditVendor, handleAddChild)
              )}
            </Tree>
          </div>
        </div>
      </div>

      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedParentVendor(undefined);
        }}
        parentVendor={selectedParentVendor}
      />

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">
                  New driver onboarded by Regional Vendor (Mumbai)
                </p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}