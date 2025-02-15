import { useState } from 'react';
import type { Driver, DriverDocument, DriverOnboardingStatus } from '../types/vendor';

interface Props {
  driver: Driver;
  onClose: () => void;
  onUploadDocument: (driverId: string, document: Omit<DriverDocument, 'id'>) => Promise<void>;
  onUpdateStatus: (driverId: string, status: DriverOnboardingStatus) => Promise<void>;
}

export function ManageDriverModal({ driver, onClose, onUploadDocument, onUpdateStatus }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'license' | 'permit' | 'pollution_certificate'>('license');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // In practice, you'd upload to your backend first
      const fileUrl = URL.createObjectURL(selectedFile);
      
      await onUploadDocument(driver.id, {
        type: documentType,
        number: '', // Would come from form
        expiryDate: '', // Would come from form
        issuedDate: '', // Would come from form
        status: 'pending',
        fileUrl,
      });
      
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Manage Driver: {driver.name}</h2>
        
        {/* Document Upload Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
          <div className="space-y-4">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as any)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="license">Driving License</option>
              <option value="permit">Permit</option>
              <option value="pollution_certificate">Pollution Certificate</option>
            </select>
            
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-300"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
        
        {/* Document List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
          <div className="space-y-2">
            {Object.entries(driver.documents).map(([_, doc]) => (
              <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{doc.type}</span>
                  <span className={`ml-2 text-sm ${
                    doc.status === 'verified' ? 'text-green-600' : 
                    doc.status === 'rejected' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Onboarding Status */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Onboarding Status</h3>
          <select
            value={driver.onboardingStatus}
            onChange={(e) => onUpdateStatus(driver.id, e.target.value as DriverOnboardingStatus)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 