import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SuperDashboard from '../pages/dashboards/SuperDashboard';
import RegionalDashboard from '../pages/dashboards/RegionalDashboard';
import CityDashboard from '../pages/dashboards/CityDashboard';
import LocalDashboard from '../pages/dashboards/LocalDashboard';

export default function RoleBasedDashboard() {
  const { currentVendor } = useAuth();

  if (!currentVendor) {
    return <div>Please log in to access the dashboard.</div>;
  }

  switch (currentVendor.level) {
    case 'super':
      return <SuperDashboard />;
    case 'regional':
      return <RegionalDashboard />;
    case 'city':
      return <CityDashboard />;
    case 'local':
      return <LocalDashboard />;
    default:
      return <div>Invalid vendor level</div>;
  }
}