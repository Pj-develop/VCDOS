export type VendorLevel = 'super' | 'regional' | 'city' | 'local';

export type Permission = 
  | 'manage_drivers'
  | 'manage_vehicles'
  | 'manage_vendors'
  | 'view_reports'
  | 'process_payments'
  | 'manage_fleet'
  | 'approve_documents'
  | 'all';

export interface VendorPermission {
  id: string;
  name: string;
  description: string;
  key: Permission;
}

export interface Vendor {
  id: string;
  name: string;
  level: VendorLevel;
  parentId?: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: Permission[];
  children?: Vendor[];
  metadata?: {
    totalDrivers?: number;
    totalVehicles?: number;
    activeVehicles?: number;
    pendingApprovals?: number;
  };
}

export type DriverDocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type DriverOnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface DriverDocument {
  id: string;
  type: 'license' | 'permit' | 'pollution_certificate' | 'other';
  number: string;
  expiryDate: string;
  issuedDate: string;
  status: DriverDocumentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  fileUrl: string;
  comments?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  licenseNumber: string;
  vendorId: string;
  vehicleId?: string;
  status: 'active' | 'inactive' | 'suspended';
  onboardingStatus: DriverOnboardingStatus;
  documents: {
    [key: string]: DriverDocument;
  };
  metadata?: {
    totalTrips?: number;
    rating?: number;
    lastActive?: string;
    completedVerification?: boolean;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus = 'valid' | 'expired' | 'pending' | 'rejected';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  seatingCapacity: number;
  fuelType: string;
  vendorId: string;
  driverId?: string;
  status: 'active' | 'inactive' | 'suspended';
  documents: {
    registration: DocumentStatus;
    insurance: DocumentStatus;
    permit: DocumentStatus;
  };
}

// New interfaces for organization chart
export interface OrgChartNode extends Vendor {
  title?: string;
  children?: OrgChartNode[];
}

export interface VendorHierarchyUpdate {
  nodeId: string;
  newParentId: string;
  newLevel?: VendorLevel;
  newPermissions?: Permission[];
}

export interface VendorUpdateRequest {
  name?: string;
  level?: VendorLevel;
  email?: string;
  phone?: string;
  location?: string;
  status?: 'active' | 'inactive';
  permissions?: Permission[];
}

export interface PermissionGroup {
  level: VendorLevel;
  defaultPermissions: Permission[];
  description: string;
  allowedOperations: {
    canManageVendors: boolean;
    canManageDrivers: boolean;
    canManageVehicles: boolean;
    canViewReports: boolean;
    canProcessPayments: boolean;
    canApproveDocuments: boolean;
  };
}

// Default permission configurations for each vendor level
export const vendorLevelPermissions: Record<VendorLevel, PermissionGroup> = {
  super: {
    level: 'super',
    defaultPermissions: ['all'],
    description: 'Full system access with ability to manage all vendors',
    allowedOperations: {
      canManageVendors: true,
      canManageDrivers: true,
      canManageVehicles: true,
      canViewReports: true,
      canProcessPayments: true,
      canApproveDocuments: true
    }
  },
  regional: {
    level: 'regional',
    defaultPermissions: ['manage_vendors', 'manage_drivers', 'manage_vehicles', 'view_reports'],
    description: 'Manage city vendors and their operations within a region',
    allowedOperations: {
      canManageVendors: true,
      canManageDrivers: true,
      canManageVehicles: true,
      canViewReports: true,
      canProcessPayments: false,
      canApproveDocuments: true
    }
  },
  city: {
    level: 'city',
    defaultPermissions: ['manage_drivers', 'manage_vehicles', 'view_reports'],
    description: 'Manage local vendors and their operations within a city',
    allowedOperations: {
      canManageVendors: false,
      canManageDrivers: true,
      canManageVehicles: true,
      canViewReports: true,
      canProcessPayments: false,
      canApproveDocuments: false
    }
  },
  local: {
    level: 'local',
    defaultPermissions: ['manage_drivers', 'view_reports'],
    description: 'Manage drivers and basic operations',
    allowedOperations: {
      canManageVendors: false,
      canManageDrivers: true,
      canManageVehicles: false,
      canViewReports: true,
      canProcessPayments: false,
      canApproveDocuments: false
    }
  }
};

// Helper function to check if a vendor can perform an operation
export const canPerformOperation = (vendor: Vendor, operation: keyof PermissionGroup['allowedOperations']): boolean => {
  if (vendor.permissions.includes('all')) return true;
  return vendorLevelPermissions[vendor.level].allowedOperations[operation];
};