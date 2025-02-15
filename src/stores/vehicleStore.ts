import { create } from 'zustand';
import type { Vehicle, DocumentStatus } from '../types/vendor';

interface VehicleStore {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicle: (id: string) => Vehicle | undefined;
  
  // Vehicle assignments
  assignDriver: (vehicleId: string, driverId: string) => Promise<void>;
  unassignDriver: (vehicleId: string) => Promise<void>;
  
  // Document management
  updateDocuments: (vehicleId: string, documents: Vehicle['documents']) => Promise<void>;
  
  // Utility functions
  getVehiclesByVendor: (vendorId: string) => Vehicle[];
  getActiveVehicles: () => Vehicle[];
  getNonCompliantVehicles: () => Vehicle[];
  checkVehicleCompliance: (vehicleId: string) => boolean;
  verifyDocument: (vehicleId: string, documentType: keyof Vehicle['documents'], status: DocumentStatus) => Promise<void>;
}

const initialVehicles: Vehicle[] = [
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
  {
    id: 'V2',
    registrationNumber: 'MH02CD5678',
    model: 'Honda City',
    type: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'CNG',
    vendorId: '2',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'expired',
      permit: 'valid',
    },
  },
  {
    id: 'V3',
    registrationNumber: 'DL01EF9012',
    model: 'Toyota Innova',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    vendorId: '3',
    driverId: '2',
    status: 'inactive',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'pending',
    },
  },
  {
    id: 'V4',
    registrationNumber: 'KA01GH3456',
    model: 'Maruti Suzuki Swift',
    type: 'Hatchback',
    seatingCapacity: 4,
    fuelType: 'Petrol',
    vendorId: '4',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'valid',
    },
  },
  {
    id: 'V5',
    registrationNumber: 'TN01IJ7890',
    model: 'Hyundai Creta',
    type: 'SUV',
    seatingCapacity: 5,
    fuelType: 'Diesel',
    vendorId: '5',
    driverId: '3',
    status: 'active',
    documents: {
      registration: 'expired',
      insurance: 'valid',
      permit: 'valid',
    },
  },
  {
    id: 'V6',
    registrationNumber: 'GJ01KL2345',
    model: 'Tata Nexon EV',
    type: 'SUV',
    seatingCapacity: 5,
    fuelType: 'Electric',
    vendorId: '2',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'valid',
    },
  },
  {
    id: 'V7',
    registrationNumber: 'UP01MN6789',
    model: 'Mahindra XUV700',
    type: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    vendorId: '3',
    driverId: '4',
    status: 'suspended',
    documents: {
      registration: 'valid',
      insurance: 'expired',
      permit: 'expired',
    },
  },
  {
    id: 'V8',
    registrationNumber: 'RJ01PQ0123',
    model: 'Kia Carnival',
    type: 'MPV',
    seatingCapacity: 8,
    fuelType: 'Diesel',
    vendorId: '4',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'valid',
    },
  },
  {
    id: 'V9',
    registrationNumber: 'WB01RS4567',
    model: 'MG ZS EV',
    type: 'SUV',
    seatingCapacity: 5,
    fuelType: 'Electric',
    vendorId: '5',
    driverId: '5',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'pending',
    },
  },
  {
    id: 'V10',
    registrationNumber: 'KL01TU8901',
    model: 'Toyota Vellfire',
    type: 'Luxury MPV',
    seatingCapacity: 7,
    fuelType: 'Hybrid',
    vendorId: '2',
    status: 'active',
    documents: {
      registration: 'valid',
      insurance: 'valid',
      permit: 'valid',
    },
  }
];

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: initialVehicles,
  loading: false,
  error: null,

  addVehicle: async (vehicleData) => {
    set({ loading: true });
    try {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: `V${Math.random().toString(36).substr(2, 9)}`,
      };
      
      set(state => ({
        vehicles: [...state.vehicles, newVehicle],
        loading: false,
      }));
      
      return newVehicle;
    } catch (error) {
      set({ error: 'Failed to add vehicle', loading: false });
      throw error;
    }
  },

  updateVehicle: async (id, updates) => {
    set({ loading: true });
    try {
      let updatedVehicle: Vehicle | undefined;
      
      set(state => ({
        vehicles: state.vehicles.map(vehicle => {
          if (vehicle.id === id) {
            updatedVehicle = { ...vehicle, ...updates };
            return updatedVehicle;
          }
          return vehicle;
        }),
        loading: false,
      }));
      
      if (!updatedVehicle) throw new Error('Vehicle not found');
      return updatedVehicle;
    } catch (error) {
      set({ error: 'Failed to update vehicle', loading: false });
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    set({ loading: true });
    try {
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete vehicle', loading: false });
      throw error;
    }
  },

  getVehicle: (id) => {
    return get().vehicles.find(vehicle => vehicle.id === id);
  },

  assignDriver: async (vehicleId, driverId) => {
    try {
      await get().updateVehicle(vehicleId, { driverId });
    } catch (error) {
      set({ error: 'Failed to assign driver' });
      throw error;
    }
  },

  unassignDriver: async (vehicleId) => {
    try {
      await get().updateVehicle(vehicleId, { driverId: undefined });
    } catch (error) {
      set({ error: 'Failed to unassign driver' });
      throw error;
    }
  },

  updateDocuments: async (vehicleId, documents) => {
    try {
      await get().updateVehicle(vehicleId, { documents });
    } catch (error) {
      set({ error: 'Failed to update documents' });
      throw error;
    }
  },

  getVehiclesByVendor: (vendorId) => {
    return get().vehicles.filter(vehicle => vehicle.vendorId === vendorId);
  },

  getActiveVehicles: () => {
    return get().vehicles.filter(vehicle => vehicle.status === 'active');
  },

  getNonCompliantVehicles: () => {
    return get().vehicles.filter(vehicle => !get().checkVehicleCompliance(vehicle.id));
  },

  checkVehicleCompliance: (vehicleId) => {
    const vehicle = get().getVehicle(vehicleId);
    if (!vehicle) return false;
    
    return Object.values(vehicle.documents).every(status => status === 'valid');
  },

  verifyDocument: async (vehicleId, documentType, status) => {
    try {
      const vehicle = get().getVehicle(vehicleId);
      if (!vehicle) throw new Error('Vehicle not found');

      const updatedDocuments: Vehicle['documents'] = {
        registration: vehicle.documents.registration,
        insurance: vehicle.documents.insurance,
        permit: vehicle.documents.permit,
        [documentType]: status
      };

      await get().updateVehicle(vehicleId, {
        documents: updatedDocuments
      });
    } catch (error) {
      set({ error: 'Failed to verify document' });
      throw error;
    }
  },
})); 