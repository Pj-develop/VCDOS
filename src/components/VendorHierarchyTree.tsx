import React from 'react';
import { ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import type { Vendor } from '../types/vendor';
import { cn } from '../utils/cn';

interface VendorHierarchyTreeProps {
  vendors: Vendor[];
  onVendorSelect?: (vendor: Vendor) => void;
  selectedVendorId?: string;
}

interface VendorNodeProps {
  vendor: Vendor;
  level: number;
  onVendorSelect?: (vendor: Vendor) => void;
  selectedVendorId?: string;
}

function VendorNode({ vendor, level, onVendorSelect, selectedVendorId }: VendorNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasChildren = vendor.children && vendor.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer',
          selectedVendorId === vendor.id && 'bg-indigo-50'
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={() => onVendorSelect?.(vendor)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-100 rounded-md mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <Building2 className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
            <p className="text-xs text-gray-500">{vendor.level}</p>
          </div>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {vendor.children.map((child) => (
            <VendorNode
              key={child.id}
              vendor={child}
              level={level + 1}
              onVendorSelect={onVendorSelect}
              selectedVendorId={selectedVendorId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function VendorHierarchyTree({
  vendors,
  onVendorSelect,
  selectedVendorId,
}: VendorHierarchyTreeProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Vendor Hierarchy</h2>
      </div>
      <div className="p-4">
        {vendors.map((vendor) => (
          <VendorNode
            key={vendor.id}
            vendor={vendor}
            level={0}
            onVendorSelect={onVendorSelect}
            selectedVendorId={selectedVendorId}
          />
        ))}
      </div>
    </div>
  );
}