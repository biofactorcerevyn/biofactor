import React, { useState } from 'react';
import { Download, FileText, BookOpen, Clock } from 'lucide-react';

interface RNDDocument {
  id: string;
  name: string;
  category: string;
  type: string;
  author: string;
  dateCreated: string;
  size: string;
  status: 'Active' | 'Draft' | 'Archived';
}

const documents: RNDDocument[] = [
  { id: '1', name: 'Protein_Folding_Study_Final_Report.pdf', category: 'Research Papers', type: 'PDF', author: 'Dr. Rajesh Sharma', dateCreated: '2024-11-10', size: '4.2 MB', status: 'Active' },
  { id: '2', name: 'Cell_Culture_Protocol_v2.docx', category: 'Protocols', type: 'Word', author: 'Dr. Priya Gupta', dateCreated: '2024-11-05', size: '1.8 MB', status: 'Active' },
  { id: '3', name: 'Gene_Therapy_Lab_Notebook.xlsx', category: 'Lab Notebooks', type: 'Excel', author: 'Dr. Arun Patel', dateCreated: '2024-11-12', size: '2.3 MB', status: 'Active' },
  { id: '4', name: 'Experimental_Data_Q3_2024.zip', category: 'Data Sets', type: 'Zip', author: 'Data Team', dateCreated: '2024-11-15', size: '125.6 MB', status: 'Active' },
  { id: '5', name: 'Literature_Review_Compilation.pdf', category: 'Literature Reviews', type: 'PDF', author: 'Dr. Neha Singh', dateCreated: '2024-11-08', size: '8.7 MB', status: 'Active' },
  { id: '6', name: 'Bacterial_Resistance_Analysis_Draft.docx', category: 'Analysis Reports', type: 'Word', author: 'Dr. Vikram Kumar', dateCreated: '2024-11-18', size: '3.2 MB', status: 'Draft' },
  { id: '7', name: 'Equipment_Specifications_Manual.pdf', category: 'Manuals', type: 'PDF', author: 'Technical Team', dateCreated: '2024-10-30', size: '5.1 MB', status: 'Active' },
  { id: '8', name: 'Budget_Allocation_FY2025_Draft.xlsx', category: 'Planning', type: 'Excel', author: 'Dr. Rajesh Sharma', dateCreated: '2024-11-12', size: '1.5 MB', status: 'Draft' },
];

export default function RNDDocuments() {
  const [docs] = useState<RNDDocument[]>(documents);

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
      'Research Papers': 'bg-blue-100 text-blue-700',
      'Protocols': 'bg-purple-100 text-purple-700',
      'Lab Notebooks': 'bg-green-100 text-green-700',
      'Data Sets': 'bg-orange-100 text-orange-700',
      'Literature Reviews': 'bg-indigo-100 text-indigo-700',
      'Analysis Reports': 'bg-red-100 text-red-700',
      'Manuals': 'bg-pink-100 text-pink-700',
      'Planning': 'bg-cyan-100 text-cyan-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">R&D Documents</h1>
          <p className="text-gray-600 mt-1">Research papers, protocols, lab notebooks and findings</p>
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
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">161.7 MB</p>
            </div>
            <Download className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Document Library</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Document Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Author</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
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
                  <td className="px-4 py-3 text-gray-600">{doc.type}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.author}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.dateCreated}</td>
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
