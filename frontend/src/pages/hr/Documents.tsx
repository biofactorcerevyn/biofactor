import React, { useState } from 'react';
import { Download, FileText, Users, Clock } from 'lucide-react';

interface HRDocument {
  id: string;
  name: string;
  category: string;
  type: string;
  updatedBy: string;
  updatedDate: string;
  size: string;
  status: 'Active' | 'Draft' | 'Archived';
}

const documents: HRDocument[] = [
  { id: '1', name: 'Job Description_Sales Manager.docx', category: 'Job Descriptions', type: 'Word', updatedBy: 'HR Admin', updatedDate: '2024-11-15', size: '145 KB', status: 'Active' },
  { id: '2', name: 'Employee_Handbook_2024.pdf', category: 'Policies', type: 'PDF', updatedBy: 'HR Manager', updatedDate: '2024-11-10', size: '2.3 MB', status: 'Active' },
  { id: '3', name: 'Leadership_Development_Program.pptx', category: 'Training Materials', type: 'PowerPoint', updatedBy: 'Training Lead', updatedDate: '2024-11-08', size: '1.8 MB', status: 'Active' },
  { id: '4', name: 'Performance_Review_Template.xlsx', category: 'Templates', type: 'Excel', updatedBy: 'HR Manager', updatedDate: '2024-11-12', size: '320 KB', status: 'Active' },
  { id: '5', name: 'Recruitment_Process_Guidelines.docx', category: 'Guidelines', type: 'Word', updatedBy: 'Recruiting Lead', updatedDate: '2024-11-05', size: '890 KB', status: 'Active' },
  { id: '6', name: 'Safety_Certification_Requirements.pdf', category: 'Compliance', type: 'PDF', updatedBy: 'Safety Officer', updatedDate: '2024-11-01', size: '1.2 MB', status: 'Active' },
  { id: '7', name: 'Benefits_Guide_2024.pdf', category: 'Policies', type: 'PDF', updatedBy: 'Benefits Admin', updatedDate: '2024-10-28', size: '3.1 MB', status: 'Active' },
  { id: '8', name: 'Onboarding_Checklist_Draft.xlsx', category: 'Templates', type: 'Excel', updatedBy: 'HR Admin', updatedDate: '2024-11-18', size: '115 KB', status: 'Draft' },
];

export default function HRDocuments() {
  const [docs] = useState<HRDocument[]>(documents);

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
      'Job Descriptions': 'bg-blue-100 text-blue-700',
      'Policies': 'bg-purple-100 text-purple-700',
      'Training Materials': 'bg-green-100 text-green-700',
      'Templates': 'bg-orange-100 text-orange-700',
      'Guidelines': 'bg-indigo-100 text-indigo-700',
      'Compliance': 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Documents</h1>
          <p className="text-gray-600 mt-1">Job descriptions, policies, training materials and templates</p>
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
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">14.1 MB</p>
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
                <th className="px-4 py-3 text-left font-semibold">Document</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Updated By</th>
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
                  <td className="px-4 py-3 text-gray-600">{doc.updatedBy}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.updatedDate}</td>
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
