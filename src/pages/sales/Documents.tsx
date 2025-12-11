import React, { useState } from 'react';
import { Download, Folder, FileText, Clock } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadedBy: string;
  dateUploaded: string;
  size: string;
  status: 'Active' | 'Archived' | 'Draft';
}

const documents: Document[] = [
  { id: '1', name: 'Product Catalog 2024.pdf', type: 'PDF', category: 'Catalog', uploadedBy: 'Rajesh Kumar', dateUploaded: '2024-11-15', size: '2.4 MB', status: 'Active' },
  { id: '2', name: 'Pricing_Proposal_Q4.docx', type: 'Word', category: 'Proposal', uploadedBy: 'Priya Sharma', dateUploaded: '2024-11-12', size: '1.2 MB', status: 'Active' },
  { id: '3', name: 'Contract_Template_v3.pdf', type: 'PDF', category: 'Contract', uploadedBy: 'Admin', dateUploaded: '2024-11-10', size: '856 KB', status: 'Active' },
  { id: '4', name: 'Sales_Presentation_Nov.pptx', type: 'PowerPoint', category: 'Presentation', uploadedBy: 'Neha Verma', dateUploaded: '2024-11-18', size: '3.1 MB', status: 'Active' },
  { id: '5', name: 'Marketing_Materials_Assets.zip', type: 'Zip', category: 'Marketing', uploadedBy: 'Arun Singh', dateUploaded: '2024-11-08', size: '45.2 MB', status: 'Active' },
  { id: '6', name: 'Customer_Success_Stories.docx', type: 'Word', category: 'Case Study', uploadedBy: 'Priya Sharma', dateUploaded: '2024-11-05', size: '2.8 MB', status: 'Active' },
  { id: '7', name: 'Terms_Conditions_Draft.pdf', type: 'PDF', category: 'Legal', uploadedBy: 'Admin', dateUploaded: '2024-11-01', size: '1.1 MB', status: 'Draft' },
  { id: '8', name: 'Branding_Guidelines_2024.pdf', type: 'PDF', category: 'Guidelines', uploadedBy: 'Admin', dateUploaded: '2024-10-28', size: '4.5 MB', status: 'Active' },
];

export default function SalesDocuments() {
  const [docs] = useState<Document[]>(documents);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      case 'Archived': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Documents</h1>
          <p className="text-gray-600 mt-1">Proposals, contracts, catalogs and marketing materials</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{docs.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Docs</p>
              <p className="text-2xl font-bold text-gray-900">{docs.filter(d => d.status === 'Active').length}</p>
            </div>
            <FileText className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(docs.map(d => d.category)).size}</p>
            </div>
            <Folder className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">67.8 MB</p>
            </div>
            <Download className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Library</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Document Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Uploaded By</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{doc.name}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.category}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.uploadedBy}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.dateUploaded}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
