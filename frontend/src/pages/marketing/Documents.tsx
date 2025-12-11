import React, { useState } from 'react';
import { Download, FileText, Image, Clock } from 'lucide-react';

interface MarketingDocument {
  id: string;
  name: string;
  category: string;
  type: string;
  createdBy: string;
  createdDate: string;
  size: string;
  status: 'Active' | 'Draft' | 'Archived';
}

const documents: MarketingDocument[] = [
  { id: '1', name: 'Campaign_Plan_Q4_2024.docx', category: 'Campaign Plans', type: 'Word', createdBy: 'Priya Sharma', createdDate: '2024-11-10', size: '2.1 MB', status: 'Active' },
  { id: '2', name: 'Brand_Guidelines_2024.pdf', category: 'Brand Guidelines', type: 'PDF', createdBy: 'Rajesh Kumar', createdDate: '2024-10-25', size: '3.8 MB', status: 'Active' },
  { id: '3', name: 'Field_Activity_Photos_Collection.zip', category: 'Field Photos', type: 'Zip', createdBy: 'Arun Singh', createdDate: '2024-11-12', size: '45.3 MB', status: 'Active' },
  { id: '4', name: 'Market_Research_Analysis_Q3.pdf', category: 'Market Research', type: 'PDF', createdBy: 'Neha Verma', createdDate: '2024-11-05', size: '5.2 MB', status: 'Active' },
  { id: '5', name: 'Social_Media_Strategy_2024.pptx', category: 'Strategy Documents', type: 'PowerPoint', createdBy: 'Priya Sharma', createdDate: '2024-11-08', size: '1.9 MB', status: 'Active' },
  { id: '6', name: 'Event_Marketing_Materials.zip', category: 'Marketing Materials', type: 'Zip', createdBy: 'Rajesh Kumar', createdDate: '2024-11-15', size: '52.1 MB', status: 'Active' },
  { id: '7', name: 'Digital_Content_Calendar_Draft.xlsx', category: 'Planning', type: 'Excel', createdBy: 'Arun Singh', createdDate: '2024-11-18', size: '1.2 MB', status: 'Draft' },
  { id: '8', name: 'Advertising_Creative_Assets.zip', category: 'Creative Assets', type: 'Zip', createdBy: 'Neha Verma', createdDate: '2024-11-03', size: '68.5 MB', status: 'Active' },
];

export default function MarketingDocuments() {
  const [docs] = useState<MarketingDocument[]>(documents);

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
      'Campaign Plans': 'bg-blue-100 text-blue-700',
      'Brand Guidelines': 'bg-purple-100 text-purple-700',
      'Field Photos': 'bg-green-100 text-green-700',
      'Market Research': 'bg-orange-100 text-orange-700',
      'Strategy Documents': 'bg-indigo-100 text-indigo-700',
      'Marketing Materials': 'bg-red-100 text-red-700',
      'Planning': 'bg-pink-100 text-pink-700',
      'Creative Assets': 'bg-cyan-100 text-cyan-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Documents</h1>
          <p className="text-gray-600 mt-1">Campaign plans, brand guidelines, marketing materials and field photos</p>
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
            <Image className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">179.9 MB</p>
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
                <th className="px-4 py-3 text-left font-semibold">Created By</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
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
                  <td className="px-4 py-3 text-gray-600">{doc.createdBy}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.createdDate}</td>
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
