
# Vendor Cab and Driver Onboarding System

A comprehensive multi-level vendor management system for fleet operations, vehicle onboarding, and driver management with hierarchical access control.

## 🌐 Live Demo

Visit the live application at: [https://pj-develop.github.io/VCDOS/](https://pj-develop.github.io/VCDOS/)

### Demo Credentials

Access different admin levels using these credentials:

- **Super Admin**: super@vendor.com
- **Regional Admin**: north@vendor.com
- **City Admin**: citya@vendor.com
- **Local Admin**: local@vendor.com

Password: Any 6+ characters


## 🚀 Features

### 1. Multi-Level Vendor Hierarchy
- Flexible N-level vendor hierarchy (Super → Regional → City → Local)
- Role-based access management
- Parent-child relationship management
- Customizable permissions per vendor level

### 2. Super Vendor Dashboard
- Complete vendor network overview
- Real-time fleet status monitoring
- Document verification management
- Performance analytics and reporting

### 3. Vehicle Management
- Vehicle onboarding and registration
- Document tracking and verification
- Compliance monitoring
- Vehicle status management (active/inactive)

### 4. Driver Management
- Driver onboarding and verification
- Document upload and tracking
- Vehicle assignment
- Performance monitoring

### 5. Access Control
- Granular permission management
- Role-based access control
- Delegation capabilities
- Activity audit trails

## 🛠 Technology Stack

- **Frontend**: React.js with TypeScript
- **State Management**: Zustand
- **UI Components**: Tailwind CSS, Lucide Icons
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Type Checking**: TypeScript

## 📦 Installation

1. Clone the repository:

git clone https://github.com/Pj-develop/VCDOS.git

2. Install dependencies:
```bash
cd VCDOS
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── pages/              # Page components
├── stores/            # Zustand stores
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## 🔑 Key Components

### 1. Vendor Hierarchy Tree
- Interactive organizational chart
- Drag-and-drop functionality
- Visual hierarchy representation
- Quick actions menu

### 2. Dashboard Views
- Super Vendor Dashboard
- Regional Dashboard
- City Dashboard
- Local Dashboard

### 3. Management Interfaces
- Vehicle Management
- Driver Management
- Document Verification
- User Management

## 💡 Implementation Details

### State Management
- Zustand for global state management
- Context API for auth state
- Local state for UI components

### Performance Optimization
- Lazy loading of components
- Memoization of expensive calculations
- Efficient re-rendering strategies

### Error Handling
- Comprehensive error boundaries
- Graceful error messages
- Form validation
- API error handling

## 🔒 Security Features

- Role-based access control
- Secure authentication flow
- Protected routes
- Data validation

## 📈 Scalability Considerations

- Modular architecture
- Efficient data structures
- Optimized rendering
- Lazy loading strategies

## 🧪 Building

```bash
# Run build command
npm run build


```

## 📝 Documentation

Detailed documentation is available in the below :

## 📚 Component Documentation

### Core Components

#### 1. VendorHierarchyTree
```typescript
import { VendorHierarchyTree } from '../components/VendorHierarchyTree';
```
- **Purpose**: Displays the organizational hierarchy of vendors in a tree structure
- **Props**:
  - `vendors: Vendor[]` - Array of vendor data
  - `onVendorSelect?: (vendor: Vendor) => void` - Callback for vendor selection
  - `selectedVendorId?: string` - Currently selected vendor ID
- **Features**:
  - Interactive expand/collapse nodes
  - Visual hierarchy representation
  - Selection highlighting
  - Drag-and-drop support

#### 2. ManageVehicleModal
```typescript
import { ManageVehicleModal } from '../components/ManageVehicleModal';
```
- **Purpose**: Modal for vehicle management operations
- **Props**:
  - `vehicle: Vehicle` - Vehicle data
  - `onClose: () => void` - Modal close handler
  - `onUpdate: (id: string, updates: Partial<Vehicle>) => Promise<Vehicle>` - Update handler
  - `onDelete: (id: string) => Promise<void>` - Delete handler
  - `availableDrivers: Driver[]` - List of available drivers
- **Features**:
  - Vehicle details editing
  - Document management
  - Driver assignment
  - Status updates

#### 3. RoleBasedDashboard
```typescript
import RoleBasedDashboard from '../components/RoleBasedDashboard';
```
- **Purpose**: Renders appropriate dashboard based on vendor level
- **Features**:
  - Dynamic dashboard switching
  - Role-based content
  - Permission-based feature access
  - Real-time updates

### Authentication Components

#### 4. AuthProvider
```typescript
import { AuthProvider } from '../contexts/AuthContext';
```
- **Purpose**: Manages authentication state and user permissions
- **Features**:
  - User authentication
  - Permission management
  - Role-based access control
  - Session management

### Management Interfaces

#### 5. AddDriverModal
```typescript
import { AddDriverModal } from '../components/AddDriverModal';
```
- **Purpose**: Modal for adding new drivers
- **Props**:
  - `onClose: () => void` - Modal close handler
  - `onAdd: (driver: Omit<Driver, 'id'>) => Promise<void>` - Add driver handler
  - `vendorId: string` - Current vendor ID
- **Features**:
  - Driver information form
  - Document upload
  - Bank details collection
  - Validation

#### 6. ManageDriverModal
```typescript
import { ManageDriverModal } from '../components/ManageDriverModal';
```
- **Purpose**: Modal for managing existing drivers
- **Props**:
  - `driver: Driver` - Driver data
  - `onClose: () => void` - Modal close handler
  - `onUploadDocument` - Document upload handler
  - `onUpdateStatus` - Status update handler
- **Features**:
  - Document management
  - Status updates
  - Performance tracking

### Dashboard Components

#### 7. OrgChart
```typescript
import OrgChart from '../components/OrgChart';
```
- **Purpose**: Visual representation of organizational structure
- **Features**:
  - Interactive org chart
  - Zoom controls
  - Node editing
  - Permission management

### Utility Components

#### 8. ProtectedRoute
```typescript
import ProtectedRoute from '../components/ProtectedRoute';
```
- **Purpose**: Route protection based on authentication and permissions
- **Features**:
  - Authentication check
  - Permission verification
  - Redirect handling
  - Loading states

### State Management

#### 9. VehicleStore
```typescript
import { useVehicleStore } from '../stores/vehicleStore';
```
- **Purpose**: Global vehicle state management
- **Features**:
  - CRUD operations
  - Vehicle assignments
  - Document management
  - Compliance checking

#### 10. DriverStore
```typescript
import { useDriverStore } from '../stores/driverStore';
```
- **Purpose**: Global driver state management
- **Features**:
  - CRUD operations
  - Document tracking
  - Onboarding workflow
  - Performance metrics

### Usage Examples

```typescript
// Example: Using VendorHierarchyTree
function VendorManagement() {
  const handleVendorSelect = (vendor: Vendor) => {
    // Handle vendor selection
  };

  return (
    <VendorHierarchyTree
      vendors={vendors}
      onVendorSelect={handleVendorSelect}
      selectedVendorId={selectedId}
    />
  );
}

// Example: Protected Route Usage
<ProtectedRoute>
  <RoleBasedDashboard />
</ProtectedRoute>
```

### Best Practices

1. **Component Usage**:
   - Always provide required props
   - Handle loading and error states
   - Implement proper cleanup in useEffect

2. **State Management**:
   - Use appropriate store methods
   - Handle async operations properly
   - Implement error handling

3. **Performance**:
   - Memoize expensive calculations
   - Use proper key props in lists
   - Implement lazy loading where appropriate


## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` directory to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- Frontend Developer: [Priyanshu Jha]


## 📞 Support

For support, email priyanshu.k4444@gmail.com.



