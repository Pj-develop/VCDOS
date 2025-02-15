import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Plus, Search } from 'lucide-react';
import { Button, Modal, Form, Input, Select } from 'antd';
import type { Vendor, VendorLevel, Permission } from '../types/vendor';
import VendorHierarchyTree from '../components/VendorHierarchyTree';
import { useVendorStore } from '../stores/vendorStore';

export default function VendorList() {
  const { vendors, addVendor, updateVendor } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<VendorLevel | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);

  const handleAddVendor = (level: VendorLevel) => {
    setSelectedLevel(level);
    setIsAddModalVisible(true);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your vendor hierarchy and permissions
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
          <Button
            type="primary"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500"
            icon={<Plus className="h-4 w-4 mr-2" />}
            onClick={() => handleAddVendor('regional')}
          >
            Add Regional Vendor
          </Button>
          <Button
            className="inline-flex items-center"
            icon={<Plus className="h-4 w-4 mr-2" />}
            onClick={() => handleAddVendor('city')}
          >
            Add City Vendor
          </Button>
          <Button
            className="inline-flex items-center"
            icon={<Plus className="h-4 w-4 mr-2" />}
            onClick={() => handleAddVendor('local')}
          >
            Add Local Vendor
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-12 gap-6">
        {/* Hierarchy Tree */}
        <div className="col-span-4">
          <VendorHierarchyTree
            vendors={vendors}
            onVendorSelect={setSelectedVendor}
            selectedVendorId={selectedVendor?.id}
          />
        </div>

        {/* Vendor Details */}
        <div className="col-span-8">
          <div className="sm:flex sm:items-center">
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search vendors..."
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

          {selectedVendor ? (
            <div className="mt-6 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedVendor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedVendor.email}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Level</dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {selectedVendor.level}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedVendor.location}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedVendor.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            selectedVendor.status === 'active'
                              ? 'bg-green-50 text-green-700 ring-green-600/20'
                              : 'bg-red-50 text-red-700 ring-red-600/20'
                          }`}
                        >
                          {selectedVendor.status}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Permissions
                      </dt>
                      <dd className="mt-1 flex flex-wrap gap-2">
                        {selectedVendor.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                          >
                            {permission}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div className="sm:col-span-2 mt-4">
                      <dt className="text-sm font-medium text-gray-500">Statistics</dt>
                      <dd className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Total Drivers</p>
                          <p className="text-lg font-semibold">{selectedVendor.metadata?.totalDrivers || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Total Vehicles</p>
                          <p className="text-lg font-semibold">{selectedVendor.metadata?.totalVehicles || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Active Vehicles</p>
                          <p className="text-lg font-semibold">{selectedVendor.metadata?.activeVehicles || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Pending Approvals</p>
                          <p className="text-lg font-semibold">{selectedVendor.metadata?.pendingApprovals || 0}</p>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    onClick={() => setIsEditModalVisible(true)}
                  >
                    Edit Vendor
                  </button>
                  <button
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setIsPermissionsModalVisible(true)}
                  >
                    Manage Permissions
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12">
              <div className="text-center">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No vendor selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a vendor from the hierarchy tree to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      <AddVendorModal
        visible={isAddModalVisible}
        level={selectedLevel}
        onCancel={() => setIsAddModalVisible(false)}
        onSubmit={async (values) => {
          addVendor({
            ...values,
            level: selectedLevel!,
            permissions: getDefaultPermissions(selectedLevel!),
          });
          setIsAddModalVisible(false);
        }}
        vendors={vendors}
      />

      <EditVendorModal
        visible={isEditModalVisible}
        vendor={selectedVendor}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={async (values) => {
          if (selectedVendor) {
            updateVendor({
              ...selectedVendor,
              ...values,
            });
            setIsEditModalVisible(false);
          }
        }}
      />

      <ManagePermissionsModal
        visible={isPermissionsModalVisible}
        vendor={selectedVendor}
        onCancel={() => setIsPermissionsModalVisible(false)}
        onSubmit={async (permissions) => {
          if (selectedVendor) {
            updateVendor({
              ...selectedVendor,
              permissions,
            });
            setIsPermissionsModalVisible(false);
          }
        }}
      />
    </div>
  );
}

interface AddVendorModalProps {
  visible: boolean;
  level: VendorLevel | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  vendors: Vendor[];
}

function AddVendorModal({ visible, level, onCancel, onSubmit, vendors }: AddVendorModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        status: 'active', // Default status for new vendors
        createdAt: new Date().toISOString(),
        metadata: {
          totalDrivers: 0,
          totalVehicles: 0,
          activeVehicles: 0,
          pendingApprovals: 0
        }
      });
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Helper function to flatten the vendor tree and get all vendors of a specific level
  const getVendorsByLevel = (vendors: Vendor[], targetLevel: VendorLevel): Vendor[] => {
    const result: Vendor[] = [];
    
    const traverse = (vendor: Vendor) => {
      if (vendor.level === targetLevel) {
        result.push(vendor);
      }
      if (vendor.children) {
        vendor.children.forEach(traverse);
      }
    };

    vendors.forEach(traverse);
    return result;
  };

  // Get potential parent vendors based on the selected level
  const getParentVendors = () => {
    if (!level) return [];
    
    switch (level) {
      case 'regional':
        return vendors.filter(v => v.level === 'super');
      case 'city':
        return getVendorsByLevel(vendors, 'regional');
      case 'local':
        return getVendorsByLevel(vendors, 'city');
      default:
        return [];
    }
  };

  const parentVendors = getParentVendors();

  return (
    <Modal
      title={`Add ${level?.charAt(0).toUpperCase()}${level?.slice(1)} Vendor`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Vendor Name"
          rules={[{ required: true, message: 'Please enter vendor name' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="parentId"
          label={`Parent ${level === 'city' ? 'Regional' : level === 'local' ? 'City' : 'Super'} Vendor`}
          rules={[{ required: true, message: 'Please select parent vendor' }]}
        >
          <Select
            className="rounded-md"
            placeholder={`Select parent ${level === 'city' ? 'regional' : level === 'local' ? 'city' : 'super'} vendor`}
          >
            {parentVendors.map(vendor => (
              <Select.Option key={vendor.id} value={vendor.id}>
                {vendor.name} ({vendor.location})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please enter location' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Helper function to get default permissions based on vendor level
function getDefaultPermissions(level: VendorLevel): Permission[] {
  switch (level) {
    case 'super':
      return ['all'];
    case 'regional':
      return ['manage_drivers', 'manage_vehicles', 'view_reports'];
    case 'city':
      return ['manage_drivers', 'view_reports'];
    case 'local':
      return ['manage_drivers'];
    default:
      return [];
  }
}

interface EditVendorModalProps {
  visible: boolean;
  vendor: Vendor | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

function EditVendorModal({ visible, vendor, onCancel, onSubmit }: EditVendorModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (vendor) {
      form.setFieldsValue({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        location: vendor.location,
        status: vendor.status
      });
    }
  }, [vendor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (vendor) {
        await onSubmit({
          ...vendor,
          ...values,
          metadata: vendor.metadata // Preserve existing metadata
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Edit Vendor"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item
          name="name"
          label="Vendor Name"
          rules={[{ required: true, message: 'Please enter vendor name' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please enter location' }]}
        >
          <Input className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select
            className="rounded-md"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

interface ManagePermissionsModalProps {
  visible: boolean;
  vendor: Vendor | null;
  onCancel: () => void;
  onSubmit: (permissions: Permission[]) => Promise<void>;
}

function ManagePermissionsModal({ visible, vendor, onCancel, onSubmit }: ManagePermissionsModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (vendor) {
      form.setFieldsValue({
        permissions: vendor.permissions,
      });
    }
  }, [vendor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values.permissions);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const allPermissions: Permission[] = [
    'manage_drivers',
    'manage_vehicles',
    'view_reports',
    'all'
  ];

  return (
    <Modal
      title="Manage Permissions"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="permissions"
          rules={[{ required: true, message: 'Please select at least one permission' }]}
        >
          <Select
            mode="multiple"
            className="rounded-md"
            placeholder="Select permissions"
            options={allPermissions.map(perm => ({
              label: perm.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '),
              value: perm
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}