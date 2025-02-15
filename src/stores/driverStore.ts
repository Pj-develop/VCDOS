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
  getCompliantDrivers: () => Driver[];
  getExpiringDocuments: (daysThreshold: number) => Driver[];
}

const initialDrivers: Driver[] = [
  {
    id: 'D1',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    address: '123 Main St, Mumbai',
    licenseNumber: 'DL123456',
    vendorId: '2',
    vehicleId: 'V1',
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
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'John Doe',
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
  {
    id: 'D2',
    name: 'Raj Kumar',
    phone: '+919876543210',
    email: 'raj@example.com',
    address: '456 Park Road, Delhi',
    licenseNumber: 'DL789012',
    vendorId: '2',
    vehicleId: 'V3',
    status: 'active',
    onboardingStatus: 'completed',
    documents: {
      license: {
        id: 'doc3',
        type: 'license',
        number: 'DL789012',
        expiryDate: '2024-06-30',
        issuedDate: '2019-06-30',
        status: 'verified',
        fileUrl: 'https://example.com/license2.pdf',
      },
    },
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    metadata: {
      totalTrips: 75,
      rating: 4.5,
      lastActive: '2024-03-14T12:00:00Z',
      completedVerification: true,
    },
  },
];

// Add helper functions for document validation
const isDocumentValid = (document: DriverDocument): boolean => {
  if (!document) return false;
  if (document.status !== 'verified') return false;
  
  const expiryDate = new Date(document.expiryDate);
  const today = new Date();
  return expiryDate > today;
};

const isDriverCompliant = (driver: Driver): boolean => {
  const requiredDocuments = ['license', 'permit'];
  return requiredDocuments.every(docType => {
    const doc = driver.documents[docType];
    return doc && isDocumentValid(doc);
  });
};

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: initialDrivers,
  loading: false,
  error: null,

  addDriver: async (driverData) => {
    set({ loading: true });
    try {
      // Validate required fields
      if (!driverData.phone || !driverData.licenseNumber) {
        throw new Error('Phone and license number are required');
      }

      // Check for duplicate license number
      const existingDriver = get().drivers.find(
        d => d.licenseNumber === driverData.licenseNumber
      );
      if (existingDriver) {
        throw new Error('Driver with this license number already exists');
      }

      const newDriver: Driver = {
        ...driverData,
        id: `D${Math.random().toString(36).substr(2, 9)}`,
        status: 'inactive',
        onboardingStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: {},
        metadata: {
          totalTrips: 0,
          rating: 0,
          lastActive: undefined,
          completedVerification: false,
        },
      };
      
      set(state => ({
        drivers: [...state.drivers, newDriver],
        loading: false,
      }));
      
      return newDriver;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add driver', loading: false });
      throw error;
    }
  },

  updateDriver: async (id, updates) => {
    set({ loading: true });
    try {
      const driver = get().getDriver(id);
      if (!driver) throw new Error('Driver not found');

      // Validate license number if being updated
      if (updates.licenseNumber && updates.licenseNumber !== driver.licenseNumber) {
        const existingDriver = get().drivers.find(
          d => d.licenseNumber === updates.licenseNumber
        );
        if (existingDriver) {
          throw new Error('Driver with this license number already exists');
        }
      }

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
      set({ error: error instanceof Error ? error.message : 'Failed to update driver', loading: false });
      throw error;
    }
  },

  uploadDocument: async (driverId, document) => {
    set({ loading: true });
    try {
      const driver = get().getDriver(driverId);
      if (!driver) throw new Error('Driver not found');

      const documentId = `DOC${Math.random().toString(36).substr(2, 9)}`;
      
      set(state => ({
        drivers: state.drivers.map(driver => {
          if (driver.id === driverId) {
            const updatedDocuments = {
              ...driver.documents,
              [document.type]: {
                ...document,
                id: documentId,
                status: 'pending' as DriverDocumentStatus,
              },
            };

            // Update onboarding status if all required documents are uploaded
            const hasAllRequiredDocs = ['license', 'permit'].every(
              docType => updatedDocuments[docType]
            );
            
            return {
              ...driver,
              documents: updatedDocuments,
              onboardingStatus: hasAllRequiredDocs ? 'in_progress' : 'pending',
              updatedAt: new Date().toISOString(),
            };
          }
          return driver;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload document', loading: false });
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
    try {
      const driver = get().getDriver(driverId);
      if (!driver) throw new Error('Driver not found');
      
      if (!isDriverCompliant(driver)) {
        throw new Error('Driver documents are not compliant');
      }

      if (driver.vehicleId) {
        throw new Error('Driver already assigned to a vehicle');
      }

      await get().updateDriver(driverId, { 
        vehicleId,
        status: 'active',
        metadata: {
          ...driver.metadata,
          lastActive: new Date().toISOString(),
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to assign vehicle' });
      throw error;
    }
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

  getCompliantDrivers: () => {
    return get().drivers.filter(isDriverCompliant);
  },

  getExpiringDocuments: (daysThreshold: number = 30) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);

    return get().drivers.filter(driver => 
      Object.values(driver.documents).some(doc => {
        const expiryDate = new Date(doc.expiryDate);
        return expiryDate <= threshold && doc.status === 'verified';
      })
    );
  },
})); 