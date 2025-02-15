import { create } from 'zustand';
import type { Driver, DriverDocument, DriverDocumentStatus, DriverOnboardingStatus } from '../types/vendor';

interface DriverStore {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  
  // Core CRUD operations
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'onboardingStatus'>) => Promise<Driver>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;
  getDriver: (id: string) => Driver | undefined;
  
  // Document management
  uploadDocument: (driverId: string, document: Omit<DriverDocument, 'id'>) => Promise<void>;
  verifyDocument: (driverId: string, documentId: string, status: DriverDocumentStatus, comments?: string) => Promise<void>;
  
  // Fleet management
  assignVehicle: (driverId: string, vehicleId: string) => Promise<void>;
  unassignVehicle: (driverId: string) => Promise<void>;
  
  // Onboarding workflow
  updateOnboardingStatus: (driverId: string, status: DriverOnboardingStatus) => Promise<void>;
  
  // Utility functions
  getDriversByVendor: (vendorId: string) => Driver[];
  getActiveDrivers: () => Driver[];
  getPendingVerifications: () => Driver[];
}

const initialDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    licenseNumber: 'DL123456',
    vendorId: '2',
    status: 'active',
    onboardingStatus: 'completed',
    documents: {
      license: {
        id: 'doc1',
        type: 'license',
        number: 'DL123456',
        expiryDate: '2025-12-31',
        issuedDate: '2020-01-01',
        status: 'verified',
        fileUrl: 'https://example.com/license.pdf',
      },
      permit: {
        id: 'doc2',
        type: 'permit',
        number: 'P123',
        expiryDate: '2024-12-31',
        issuedDate: '2023-01-01',
        status: 'verified',
        fileUrl: 'https://example.com/permit.pdf',
      },
    },
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    metadata: {
      totalTrips: 150,
      rating: 4.8,
      lastActive: '2024-03-15T12:00:00Z',
      completedVerification: true,
    },
  },
];

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: initialDrivers,
  loading: false,
  error: null,

  addDriver: async (driverData) => {
    set({ loading: true });
    try {
      const newDriver: Driver = {
        ...driverData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'inactive',
        onboardingStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: {},
        metadata: {
          totalTrips: 0,
          rating: 0,
          completedVerification: false,
        },
      };
      
      set(state => ({
        drivers: [...state.drivers, newDriver],
        loading: false,
      }));
      
      return newDriver;
    } catch (error) {
      set({ error: 'Failed to add driver', loading: false });
      throw error;
    }
  },

  updateDriver: async (id, updates) => {
    set({ loading: true });
    try {
      let updatedDriver: Driver | undefined;
      
      set(state => ({
        drivers: state.drivers.map(driver => {
          if (driver.id === id) {
            updatedDriver = {
              ...driver,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            return updatedDriver;
          }
          return driver;
        }),
        loading: false,
      }));
      
      if (!updatedDriver) throw new Error('Driver not found');
      return updatedDriver;
    } catch (error) {
      set({ error: 'Failed to update driver', loading: false });
      throw error;
    }
  },

  uploadDocument: async (driverId, document) => {
    set({ loading: true });
    try {
      const documentId = Math.random().toString(36).substr(2, 9);
      
      set(state => ({
        drivers: state.drivers.map(driver => {
          if (driver.id === driverId) {
            return {
              ...driver,
              documents: {
                ...driver.documents,
                [document.type]: {
                  ...document,
                  id: documentId,
                  status: 'pending',
                },
              },
              updatedAt: new Date().toISOString(),
            };
          }
          return driver;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to upload document', loading: false });
      throw error;
    }
  },

  deleteDriver: async (id) => {
    set(state => ({
      drivers: state.drivers.filter(d => d.id !== id)
    }));
  },

  getDriver: (id) => {
    return get().drivers.find(d => d.id === id);
  },

  verifyDocument: async (driverId, documentId, status: DriverDocumentStatus, comments) => {
    set(state => ({
      drivers: state.drivers.map(d => d.id === driverId ? {
        ...d,
        documents: {
          ...d.documents,
          [documentId]: { ...d.documents[documentId], status, comments }
        }
      } : d)
    }));
  },

  assignVehicle: async (driverId, vehicleId) => {
    set(state => ({
      drivers: state.drivers.map(d => d.id === driverId ? { ...d, vehicleId } : d)
    }));
  },

  unassignVehicle: async (driverId) => {
    set(state => ({
      drivers: state.drivers.map(d => d.id === driverId ? { ...d, vehicleId: undefined } : d)
    }));
  },

  updateOnboardingStatus: async (driverId, status) => {
    set(state => ({
      drivers: state.drivers.map(d => d.id === driverId ? { ...d, onboardingStatus: status } : d)
    }));
  },

  getDriversByVendor: (vendorId) => {
    return get().drivers.filter(driver => driver.vendorId === vendorId);
  },

  getActiveDrivers: () => {
    return get().drivers.filter(driver => driver.status === 'active');
  },

  getPendingVerifications: () => {
    return get().drivers.filter(driver => 
      Object.values(driver.documents).some(doc => doc.status === 'pending')
    );
  },
})); 