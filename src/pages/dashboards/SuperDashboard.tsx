import { useAuth } from '../../contexts/AuthContext';
import { Users, Building2, Settings, Shield, ChevronRight } from 'lucide-react';
import { vendorLevelPermissions } from '../../types/vendor';
import type { Vendor, VendorLevel } from '../../types/vendor';
import { message } from 'antd';
import OrgChart from '../../components/OrgChart';
import { useVendorStore } from '../../stores/vendorStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function SuperDashboard() {
  const { currentVendor } = useAuth();
  const { vendors } = useVendorStore();
  const navigate = useNavigate();
  
  // Only super vendors have access to this page.
  if (!currentVendor || currentVendor.level !== 'super') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">Access Denied: Super Vendor permissions required</h1>
      </div>
    );
  }

  // Get the super vendor data from the store
  const superVendor = vendors[0];

  if (!superVendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-red-600 text-xl">No super vendor data found</h1>
      </div>
    );
  }

  // Calculate total stats from vendor hierarchy
  const calculateTotalStats = (vendor: Vendor) => {
    let totals = {
      totalDrivers: vendor.metadata?.totalDrivers || 0,
      totalVehicles: vendor.metadata?.totalVehicles || 0,
      activeVehicles: vendor.metadata?.activeVehicles || 0,
      pendingApprovals: vendor.metadata?.pendingApprovals || 0,
    };

    if (vendor.children) {
      vendor.children.forEach(child => {
        const childStats = calculateTotalStats(child);
        totals.totalDrivers += childStats.totalDrivers;
        totals.totalVehicles += childStats.totalVehicles;
        totals.activeVehicles += childStats.activeVehicles;
        totals.pendingApprovals += childStats.pendingApprovals;
      });
    }

    return totals;
  };

  const totalStats = calculateTotalStats(superVendor);

  // Stats overview section using calculated totals
  const stats = [
    { 
      name: 'Total Drivers', 
      value: totalStats.totalDrivers, 
      icon: Users 
    },
    { 
      name: 'Pending Approvals', 
      value: totalStats.pendingApprovals, 
      icon: Shield 
    },
    { 
      name: 'Active Vehicles', 
      value: totalStats.activeVehicles, 
      icon: Settings 
    }
  ];

  // Prepare data for regional performance chart
  const regionalData = superVendor.children?.map(region => ({
    name: region.name,
    drivers: region.metadata?.totalDrivers || 0,
    vehicles: region.metadata?.totalVehicles || 0,
    activeVehicles: region.metadata?.activeVehicles || 0,
  })) || [];

  // Build vendor levels with actual counts and type-safe paths
  const vendorLevels = Object.entries(vendorLevelPermissions).map(([key, value]) => {
    const level = key as VendorLevel;
    const count = level === 'super' ? 1 : 
                 level === 'regional' ? superVendor.children?.length || 0 :
                 level === 'city' ? superVendor.children?.reduce((acc, region) => 
                   acc + (region.children?.length ?? 0), 0) ?? 0 :
                 superVendor.children?.reduce((acc, region) => 
                   acc + (region.children?.reduce((acc2, city) => 
                     acc2 + (city.children?.length ?? 0), 0) ?? 0), 0) ?? 0;

    return {
      name: `${level.charAt(0).toUpperCase() + level.slice(1)} Vendors`,
      count: count.toString(),
      icon: Building2,
      permissions: value.defaultPermissions,
      description: value.description,
      path: `/${level}-vendors`
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your vendor hierarchy and access control policies.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-600 p-3">
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

      {/* Organization Chart - Increased height and better visibility */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Structure</h2>
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '800px' }}>
          <OrgChart />
        </div>
      </div>

      {/* Regional Performance Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Regional Performance</h2>
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="drivers" fill="#8884d8" name="Total Drivers" />
              <Bar dataKey="vehicles" fill="#82ca9d" name="Total Vehicles" />
              <Bar dataKey="activeVehicles" fill="#ffc658" name="Active Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Levels */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Vendor Hierarchy</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage permissions and access for different vendor levels.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {vendorLevels.map((level, index) => {
            const Icon = level.icon;
            return (
              <div
                key={level.name}
                className={`px-4 py-5 sm:px-6 ${index !== vendorLevels.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {level.name}
                        <span className="ml-2 text-sm text-gray-500">({level.count})</span>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{level.description}</p>
                      <ul className="mt-2 text-sm text-gray-500">
                        {level.permissions.map((permission) => (
                          <li key={permission}>• {permission.replace('_', ' ').toUpperCase()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      onClick={() => navigate('/vendors')}
                    >
                      Manage
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}