import { create } from 'zustand';
import type { Vendor } from '../types/vendor';

interface VendorStore {
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'status' | 'metadata'>) => void;
  updateVendor: (updatedVendor: Vendor) => void;
  deleteVendor: (id: string) => void;
}

// Initial mock data
const initialVendors: Vendor[] = [
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
    metadata: {
      totalDrivers: 1500,
      totalVehicles: 1200,
      activeVehicles: 1000,
      pendingApprovals: 25
    },
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
        permissions: ['manage_vendors', 'manage_drivers', 'manage_vehicles', 'view_reports'],
        metadata: {
          totalDrivers: 500,
          totalVehicles: 400,
          activeVehicles: 350,
          pendingApprovals: 10
        },
        children: [
          {
            id: '3',
            name: 'Mumbai City Vendor',
            level: 'city',
            parentId: '2',
            email: 'mumbai@vendor.com',
            phone: '+1234567892',
            location: 'Mumbai',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'],
            metadata: {
              totalDrivers: 200,
              totalVehicles: 150,
              activeVehicles: 130,
              pendingApprovals: 5
            },
            children: [
              {
                id: '4',
                name: 'Mumbai Local Vendor 1',
                level: 'local',
                parentId: '3',
                email: 'mumbai.local1@vendor.com',
                phone: '+1234567893',
                location: 'Mumbai North',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
                metadata: {
                  totalDrivers: 100,
                  totalVehicles: 80,
                  activeVehicles: 75,
                  pendingApprovals: 3
                }
              },
              {
                id: '5',
                name: 'Mumbai Local Vendor 2',
                level: 'local',
                parentId: '3',
                email: 'mumbai.local2@vendor.com',
                phone: '+1234567894',
                location: 'Mumbai South',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          },
          {
            id: '6',
            name: 'Pune City Vendor',
            level: 'city',
            parentId: '2',
            email: 'pune@vendor.com',
            phone: '+1234567895',
            location: 'Pune',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'view_reports'],
            children: [
              {
                id: '7',
                name: 'Pune Local Vendor 1',
                level: 'local',
                parentId: '6',
                email: 'pune.local1@vendor.com',
                phone: '+1234567896',
                location: 'Pune East',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              },
              {
                id: '8',
                name: 'Pune Local Vendor 2',
                level: 'local',
                parentId: '6',
                email: 'pune.local2@vendor.com',
                phone: '+1234567897',
                location: 'Pune West',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          }
        ]
      },
      {
        id: '9',
        name: 'Regional Vendor North',
        level: 'regional',
        parentId: '1',
        email: 'north@vendor.com',
        phone: '+1234567898',
        location: 'North Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_vendors', 'manage_drivers', 'manage_vehicles', 'view_reports'],
        metadata: {
          totalDrivers: 450,
          totalVehicles: 380,
          activeVehicles: 340,
          pendingApprovals: 8
        },
        children: [
          {
            id: '10',
            name: 'Delhi City Vendor',
            level: 'city',
            parentId: '9',
            email: 'delhi@vendor.com',
            phone: '+1234567899',
            location: 'Delhi',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'],
            metadata: {
              totalDrivers: 180,
              totalVehicles: 150,
              activeVehicles: 140,
              pendingApprovals: 4
            },
            children: [
              {
                id: '11',
                name: 'Delhi Local Vendor 1',
                level: 'local',
                parentId: '10',
                email: 'delhi.local1@vendor.com',
                phone: '+1234567900',
                location: 'Delhi NCR',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              },
              {
                id: '12',
                name: 'Delhi Local Vendor 2',
                level: 'local',
                parentId: '10',
                email: 'delhi.local2@vendor.com',
                phone: '+1234567901',
                location: 'Delhi Central',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          },
          {
            id: '13',
            name: 'Chandigarh City Vendor',
            level: 'city',
            parentId: '9',
            email: 'chandigarh@vendor.com',
            phone: '+1234567902',
            location: 'Chandigarh',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'view_reports'],
            children: [
              {
                id: '14',
                name: 'Chandigarh Local Vendor 1',
                level: 'local',
                parentId: '13',
                email: 'chandigarh.local1@vendor.com',
                phone: '+1234567903',
                location: 'Chandigarh North',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              },
              {
                id: '15',
                name: 'Chandigarh Local Vendor 2',
                level: 'local',
                parentId: '13',
                email: 'chandigarh.local2@vendor.com',
                phone: '+1234567904',
                location: 'Chandigarh South',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          }
        ]
      },
      {
        id: '16',
        name: 'Regional Vendor South',
        level: 'regional',
        parentId: '1',
        email: 'south@vendor.com',
        phone: '+1234567905',
        location: 'South Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_drivers', 'manage_vehicles', 'view_reports'],
        children: [
          {
            id: '17',
            name: 'Bangalore City Vendor',
            level: 'city',
            parentId: '16',
            email: 'bangalore@vendor.com',
            phone: '+1234567906',
            location: 'Bangalore',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'view_reports'],
            children: [
              {
                id: '18',
                name: 'Bangalore Local Vendor 1',
                level: 'local',
                parentId: '17',
                email: 'bangalore.local1@vendor.com',
                phone: '+1234567907',
                location: 'Bangalore East',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              },
              {
                id: '19',
                name: 'Bangalore Local Vendor 2',
                level: 'local',
                parentId: '17',
                email: 'bangalore.local2@vendor.com',
                phone: '+1234567908',
                location: 'Bangalore West',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          },
          {
            id: '20',
            name: 'Chennai City Vendor',
            level: 'city',
            parentId: '16',
            email: 'chennai@vendor.com',
            phone: '+1234567909',
            location: 'Chennai',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers', 'view_reports'],
            children: [
              {
                id: '21',
                name: 'Chennai Local Vendor 1',
                level: 'local',
                parentId: '20',
                email: 'chennai.local1@vendor.com',
                phone: '+1234567910',
                location: 'Chennai North',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              },
              {
                id: '22',
                name: 'Chennai Local Vendor 2',
                level: 'local',
                parentId: '20',
                email: 'chennai.local2@vendor.com',
                phone: '+1234567911',
                location: 'Chennai South',
                status: 'active',
                createdAt: '2024-03-15',
                permissions: ['manage_drivers', 'view_reports'],
              }
            ]
          }
        ]
      }
    ]
  }
];

export const useVendorStore = create<VendorStore>((set) => ({
  vendors: initialVendors,
  
  addVendor: (newVendor) => set((state) => {
    const vendor: Vendor = {
      ...newVendor,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'active',
      children: [],
      metadata: {
        totalDrivers: 0,
        totalVehicles: 0,
        activeVehicles: 0,
        pendingApprovals: 0
      }
    };

    // Helper function to add vendor to the correct parent
    const addVendorToParent = (vendors: Vendor[]): Vendor[] => {
      return vendors.map(v => {
        if (v.id === vendor.parentId) {
          return {
            ...v,
            children: [...(v.children || []), vendor],
          };
        }
        if (v.children) {
          return {
            ...v,
            children: addVendorToParent(v.children),
          };
        }
        return v;
      });
    };

    return {
      vendors: addVendorToParent(state.vendors),
    };
  }),

  updateVendor: (updatedVendor) => {
    set((state) => ({
      vendors: updateVendorInTree(state.vendors, updatedVendor),
    }));
  },

  deleteVendor: (id) => set((state) => {
    const deleteVendorFromTree = (vendors: Vendor[]): Vendor[] => {
      return vendors
        .filter(v => v.id !== id)
        .map(v => ({
          ...v,
          children: v.children ? deleteVendorFromTree(v.children) : [],
        }));
    };

    return {
      vendors: deleteVendorFromTree(state.vendors),
    };
  }),
}));

function updateVendorInTree(vendors: Vendor[], updatedVendor: Vendor): Vendor[] {
  return vendors.map(vendor => {
    if (vendor.id === updatedVendor.id) {
      return { ...vendor, ...updatedVendor };
    }
    if (vendor.children) {
      return {
        ...vendor,
        children: updateVendorInTree(vendor.children, updatedVendor),
      };
    }
    return vendor;
  });
} 