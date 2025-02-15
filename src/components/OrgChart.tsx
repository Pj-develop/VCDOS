import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { OrgChartNode, VendorLevel } from '../types/vendor';
import { vendorLevelPermissions } from '../types/vendor';
import { useVendorStore } from '../stores/vendorStore';
import { PlusCircle, Edit2, Settings, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const OrgChart = () => {
  const { vendors, updateVendor, addVendor } = useVendorStore();
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Error boundary
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Chart Error:', error);
      setHasError(true);
      message.error('An error occurred while rendering the chart');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Convert vendors to OrgChartNode format
  const orgData: OrgChartNode = vendors[0];

  // Function to handle node click and open modal
  const handleNodeClick = (node: OrgChartNode) => {
    setSelectedNode(node);
    form.setFieldsValue({
      name: node.name,
      email: node.email,
      phone: node.phone,
      level: node.level,
      location: node.location,
      permissions: node.permissions,
      status: node.status,
    });
  };

  // Function to handle adding a new node
  const handleAddNode = (parentNode: OrgChartNode) => {
    setSelectedNode(parentNode);
    setIsAddModalVisible(true);
    
    // Set default values based on parent level
    const childLevel = getChildLevel(parentNode.level);
    addForm.setFieldsValue({
      level: childLevel,
      parentId: parentNode.id,
    });
  };

  // Helper function to get child level
  const getChildLevel = (parentLevel: VendorLevel): VendorLevel => {
    switch (parentLevel) {
      case 'super': return 'regional';
      case 'regional': return 'city';
      case 'city': return 'local';
      default: return 'local';
    }
  };

  // Handle form submission for editing
  const handleEditSubmit = async (values: any) => {
    if (!selectedNode) return;

    try {
      updateVendor({
        ...selectedNode,
        ...values,
      });
      message.success('Vendor updated successfully');
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update vendor');
    }
  };

  // Handle form submission for adding new node
  const handleAddSubmit = async (values: any) => {
    try {
      const newVendor = {
        ...values,
        permissions: vendorLevelPermissions[values.level as VendorLevel].defaultPermissions,
      };
      
      addVendor(newVendor);
      message.success('New vendor added successfully');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error('Failed to add vendor');
    }
  };

  // Enhanced renderNode function with profile images
  const renderNode = (node: OrgChartNode) => {
    const levelColor = node.level === 'super' 
      ? 'border-blue-500' 
      : node.level === 'regional' 
        ? 'border-green-500' 
        : node.level === 'city'
          ? 'border-yellow-500'
          : 'border-orange-500';

    // Get placeholder image based on level
    const getPlaceholderImage = (level: VendorLevel) => {
      switch (level) {
        case 'super':
          return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
        case 'regional':
          return 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
        case 'city':
          return 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
        default:
          return 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
      }
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div 
            className={`bg-white rounded-lg shadow-md p-4 w-80 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${levelColor}`}
            onClick={() => handleNodeClick(node)}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={getPlaceholderImage(node.level)}
                    alt={node.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{node.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{node.level}</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {node.level !== 'local' && (
                        <PlusCircle
                          className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddNode(node);
                          }}
                        />
                      )}
                      <Edit2
                        className="h-5 w-5 text-gray-400 hover:text-green-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditModalVisible(true);
                        }}
                      />
                      <Settings
                        className="h-5 w-5 text-gray-400 hover:text-purple-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPermissionsModalVisible(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">{node.email}</div>
                <div className="text-gray-500">{node.location}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  node.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {node.status}
                </div>
                {node.metadata && (
                  <div className="text-xs text-gray-400 grid grid-cols-2 gap-x-4">
                    <div>👥 {node.metadata.totalDrivers}</div>
                    <div>🚗 {node.metadata.totalVehicles}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex gap-16">
              {node.children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
          <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex gap-2 bg-white p-2 rounded-lg shadow-md z-10">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Reset Zoom"
        >
          <RotateCcw className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Chart container */}
      <div 
        ref={chartRef}
        className="w-full h-full p-8 overflow-auto"
        style={{
          minWidth: '100%',
          minHeight: '100vh'
        }}
      >
        <div 
          className="flex flex-col items-center min-w-max transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center'
          }}
        >
          {renderNode(orgData)}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={`Edit ${selectedNode?.name || 'Vendor'}`}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: 'Please select level' }]}
          >
            <Select>
              {Object.keys(vendorLevelPermissions).map((level) => (
                <Select.Option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Update Vendor
            </button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Node Modal */}
      <Modal
        title={`Add New ${getChildLevel(selectedNode?.level || 'super')} Vendor`}
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parentId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="level" hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Add Vendor
            </button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        title={`Manage Permissions - ${selectedNode?.name}`}
        open={isPermissionsModalVisible}
        onCancel={() => setIsPermissionsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={{ permissions: selectedNode?.permissions }}
          onFinish={(values) => {
            if (selectedNode) {
              updateVendor({
                ...selectedNode,
                permissions: values.permissions,
              });
              setIsPermissionsModalVisible(false);
            }
          }}
        >
          <Form.Item
            name="permissions"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              options={Object.keys(vendorLevelPermissions[selectedNode?.level || 'local'].allowedOperations)
                .filter(key => vendorLevelPermissions[selectedNode?.level || 'local'].allowedOperations[key as keyof typeof vendorLevelPermissions[VendorLevel]['allowedOperations']])
                .map(key => ({
                  label: key.split('can')[1].split(/(?=[A-Z])/).join(' '),
                  value: `manage_${key.split('can')[1].toLowerCase()}`
                }))}
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
            >
              Update Permissions
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrgChart;