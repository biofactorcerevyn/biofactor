import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Beaker, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface ExperimentData {
  name: string;
  status: 'Success' | 'In Progress' | 'Failed';
  successRate: number;
  startDate: string;
  completionDate: string;
}

const experiments: ExperimentData[] = [
  { name: 'Protein Folding Study A', status: 'Success', successRate: 92, startDate: '2024-09-15', completionDate: '2024-11-10' },
  { name: 'Cell Culture Optimization', status: 'Success', successRate: 88, startDate: '2024-08-20', completionDate: '2024-11-05' },
  { name: 'Gene Therapy Trial B', status: 'In Progress', successRate: 0, startDate: '2024-10-01', completionDate: '' },
  { name: 'Bacterial Resistance Test', status: 'Success', successRate: 95, startDate: '2024-09-01', completionDate: '2024-11-12' },
  { name: 'Enzyme Activity Assay', status: 'Failed', successRate: 35, startDate: '2024-08-10', completionDate: '2024-11-08' },
];

const outcomeData = [
  { name: 'Success', value: 3, fill: '#10B981' },
  { name: 'In Progress', value: 1, fill: '#3B82F6' },
  { name: 'Failed', value: 1, fill: '#EF4444' },
];

export default function ExperimentResults() {
  const [expList] = useState(experiments);

  const metrics = useMemo(() => {
    const total = expList.length;
    const successful = expList.filter(e => e.status === 'Success').length;
    const successRate = ((successful / total) * 100).toFixed(1);
    const avgSuccess = (expList
      .filter(e => e.status === 'Success')
      .reduce((sum, e) => sum + e.successRate, 0) / successful).toFixed(1) || 0;

    return { total, successful, successRate, avgSuccess };
  }, [expList]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-success/10 text-success';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiment Results Report</h1>
          <p className="text-gray-600 mt-1">Experimental outcomes and success metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Experiments" value={metrics.total} icon={Beaker} variant="rnd" />
        <KPICard title="Successful" value={metrics.successful} icon={CheckCircle} variant="rnd" />
        <KPICard title="Success Rate" value={`${metrics.successRate}%`} icon={CheckCircle} variant="rnd" />
        <KPICard title="Avg Success %Age" value={`${metrics.avgSuccess}%`} icon={Beaker} variant="rnd" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Outcome Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={outcomeData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expList.filter(e => e.status === 'Success')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="successRate" fill="#10B981" name="Success %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiment Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Experiment Name</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Success Rate</th>
                <th className="px-4 py-3 text-left font-semibold">Start Date</th>
                <th className="px-4 py-3 text-left font-semibold">Completion Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expList.map((exp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{exp.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{exp.successRate}%</td>
                  <td className="px-4 py-3 text-gray-600">{exp.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{exp.completionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
