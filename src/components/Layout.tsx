import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Car, Users, Building2, LayoutDashboard, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vendors', href: '/vendors', icon: Building2, subNav: ['Hierarchy'] },
  { name: 'Drivers', href: '/drivers', icon: Users, badge: true },
  { name: 'Vehicles', href: '/vehicles', icon: Car, status: 'Verified' },
];

export default function Layout() {
  const location = useLocation();
  const { currentVendor, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      setUserDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentVendor) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{currentVendor.name}</span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">
                {currentVendor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 z-50 bg-gray-800 transform transition-all duration-300 lg:translate-x-0',
        isSidebarCollapsed ? 'w-20' : 'w-64',
        !isMobileMenuOpen && '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">Vendor Management</h1>
                <p className="text-gray-400 text-sm mt-1">{currentVendor.level}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-300 hover:text-white"
            >
              <ChevronDown className={cn(
                'h-6 w-6 transform transition-transform',
                isSidebarCollapsed ? '-rotate-90' : 'rotate-90'
              )} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto pt-4 pb-6">
            {navigation.map((item) => (
              <div key={item.name} className="px-4">
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700',
                    location.pathname === item.href && 'bg-gray-900 text-white'
                  )}
                  onClick={() => !isSidebarCollapsed && setOpenDropdown(openDropdown === item.name ? null : item.name)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.subNav && (
                        <ChevronDown className={cn(
                          'h-4 w-4 transform transition-transform',
                          openDropdown === item.name && 'rotate-180'
                        )} />
                      )}
                    </>
                  )}
                </Link>
                
                {!isSidebarCollapsed && item.subNav && openDropdown === item.name && (
                  <div className="ml-10 mt-2 space-y-2">
                    {item.subNav.map((subItem) => (
                      <Link
                        key={subItem}
                        to={`/${subItem.toLowerCase().replace(' ', '-')}`}
                        className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-700 p-4">
            {!isSidebarCollapsed ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center text-gray-300 hover:bg-gray-700 px-3 py-2.5 rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex justify-center text-gray-300 hover:bg-gray-700 px-3 py-2.5 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      )}>
        {/* Desktop Header */}
        <header className="bg-white shadow-sm hidden lg:block">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vendors, drivers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="relative" id="user-dropdown">
                <button
                  onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3"
                >
                  <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm">
                      {currentVendor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{currentVendor.name}</p>
                    <p className="text-xs text-gray-500">{currentVendor.level}</p>
                  </div>
                  <ChevronDown className={cn(
                    'h-4 w-4 transform transition-transform',
                    isUserDropdownOpen && 'rotate-180'
                  )} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{currentVendor.name}</p>
                      <p className="text-xs text-gray-500">{currentVendor.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}