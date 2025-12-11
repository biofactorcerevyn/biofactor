import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Users, Briefcase } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface Candidate {
  stage: string;
  count: number;
  avgDaysInStage: number;
}

const candidateData: Candidate[] = [
  { stage: 'Applied', count: 145, avgDaysInStage: 3 },
  { stage: 'Screening', count: 68, avgDaysInStage: 5 },
  { stage: 'Interview 1', count: 32, avgDaysInStage: 7 },
  { stage: 'Interview 2', count: 16, avgDaysInStage: 6 },
  { stage: 'Offer', count: 8, avgDaysInStage: 4 },
  { stage: 'Hired', count: 24, avgDaysInStage: 0 },
];

export default function RecruitmentPipeline() {
  const [pipeline] = useState(candidateData);

  const metrics = useMemo(() => {
    const totalCandidates = pipeline.reduce((sum, p) => sum + p.count, 0);
    const activeOpenings = 12;
    const offersPending = pipeline.find(p => p.stage === 'Offer')?.count || 0;
    const hired = pipeline.find(p => p.stage === 'Hired')?.count || 0;

    return { totalCandidates, activeOpenings, offersPending, hired };
  }, [pipeline]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Pipeline</h1>
          <p className="text-gray-600 mt-1">Candidate pipeline and hiring progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Candidates" value={metrics.totalCandidates} icon={Users} variant="hr" />
        <KPICard title="Active Openings" value={metrics.activeOpenings} icon={Briefcase} variant="hr" />
        <KPICard title="Pending Offers" value={metrics.offersPending} icon={Users} variant="hr" />
        <KPICard title="Hired (Month)" value={metrics.hired} icon={Users} variant="hr" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline by Stage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" name="Candidates" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Stage</th>
                <th className="px-4 py-3 text-right font-semibold">Candidates</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Days in Stage</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pipeline.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.stage}</td>
                  <td className="px-4 py-3 text-right font-semibold">{item.count}</td>
                  <td className="px-4 py-3 text-right">{item.avgDaysInStage} days</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.stage === 'Hired' ? 'bg-success/10 text-success' :
                      item.stage === 'Offer' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.stage === 'Hired' ? 'Complete' : item.stage === 'Offer' ? 'Pending' : 'Active'}
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
