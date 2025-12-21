import React, { useState } from 'react';
import { Download, FileText, File, Clock } from 'lucide-react';

interface ManufacturingDocument {
  id: string;
  name: string;
  category: string;
  type: string;
  author: string;
  lastUpdated: string;
  size: string;
  status: 'Active' | 'Draft' | 'Archived';
  version?: string;
}

const documents: ManufacturingDocument[] = [
  { id: '1', name: 'Production_SOP_v4.2.pdf', category: 'Standard Operating Procedures', type: 'PDF', author: 'Production Manager', lastUpdated: '2024-11-10', size: '2.4 MB', status: 'Active', version: '4.2' },
  { id: '2', name: 'QC_Checklist_Daily_Batch.xlsx', category: 'QC Checklists', type: 'Excel', author: 'QC Lead', lastUpdated: '2024-11-15', size: '850 KB', status: 'Active' },
  { id: '3', name: 'Equipment_Maintenance_Log.xlsx', category: 'Maintenance Logs', type: 'Excel', author: 'Maintenance Team', lastUpdated: '2024-11-18', size: '1.3 MB', status: 'Active' },
  { id: '4', name: 'BOM_BioProduct_A_Rev3.pdf', category: 'Bill of Materials', type: 'PDF', author: 'Engineering', lastUpdated: '2024-11-08', size: '1.8 MB', status: 'Active' },
  { id: '5', name: 'Work_Order_Template.docx', category: 'Work Orders', type: 'Word', author: 'Production Planning', lastUpdated: '2024-11-12', size: '650 KB', status: 'Active' },
  { id: '6', name: 'Safety_Protocol_Manufacturing.pdf', category: 'Safety Protocols', type: 'PDF', author: 'Safety Officer', lastUpdated: '2024-11-05', size: '3.2 MB', status: 'Active' },
  { id: '7', name: 'Process_Flow_Diagram_Updated.pdf', category: 'Process Diagrams', type: 'PDF', author: 'Process Engineer', lastUpdated: '2024-11-01', size: '2.9 MB', status: 'Active' },
  { id: '8', name: 'Equipment_Specs_and_Calibration_Draft.xlsx', category: 'Equipment Documentation', type: 'Excel', author: 'Engineering', lastUpdated: '2024-11-18', size: '1.6 MB', status: 'Draft' },
];

export default function ManufacturingDocuments() {
  const [docs] = useState<ManufacturingDocument[]>(documents);

  const uploadNewVersion = (docId: string, file?: File) => {
    // In a real app this would upload to storage and create a new version record.
    // Here we simulate by opening a save dialog via blob or by logging and showing a simple alert.
    alert(`Upload new version for doc ${docId} (${file?.name || 'no-file'}) - (simulated)`);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      case 'Archived': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  };

  const categoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Standard Operating Procedures': 'bg-blue-100 text-blue-700',
      'QC Checklists': 'bg-green-100 text-green-700',
      'Maintenance Logs': 'bg-orange-100 text-orange-700',
      'Bill of Materials': 'bg-purple-100 text-purple-700',
      'Work Orders': 'bg-indigo-100 text-indigo-700',
      'Safety Protocols': 'bg-red-100 text-red-700',
      'Process Diagrams': 'bg-cyan-100 text-cyan-700',
      'Equipment Documentation': 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Documents</h1>
          <p className="text-gray-600 mt-1">SOPs, QC checklists, maintenance logs and BOMs</p>
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
            <File className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">17.8 MB</p>
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
                <th className="px-4 py-3 text-left font-semibold">Author</th>
                <th className="px-4 py-3 text-left font-semibold">Last Updated</th>
                <th className="px-4 py-3 text-left font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{doc.name}</td>
                    <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </td>
                    <td className="px-4 py-3 text-gray-600">{doc.version || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.author}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.lastUpdated}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <label className="cursor-pointer px-2 py-1 bg-gray-100 rounded text-sm">
                          Upload New Version
                          <input onChange={e => uploadNewVersion(doc.id, e.target.files ? e.target.files[0] : undefined)} type="file" className="hidden" />
                        </label>
                        <button onClick={() => alert(`View history for ${doc.name} (simulated)`)} className="px-2 py-1 bg-white border rounded text-sm">History</button>
                      </div>
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
