import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface Pipeline {
  stage: string;
  count: number;
  value: number;
  winProbability: number;
}

const pipelineData: Pipeline[] = [
  { stage: 'Lead', count: 120, value: 0, winProbability: 5 },
  { stage: 'Qualified', count: 45, value: 500000, winProbability: 25 },
  { stage: 'Proposal', count: 18, value: 650000, winProbability: 50 },
  { stage: 'Negotiation', count: 8, value: 400000, winProbability: 75 },
  { stage: 'Closed-Won', count: 32, value: 1280000, winProbability: 100 },
];

export default function PipelineReport() {
  const [pipeline] = useState<Pipeline[]>(pipelineData);

  const metrics = useMemo(() => {
    const totalPipelineValue = pipeline.reduce((sum, d) => sum + d.value, 0);
    const expectedValue = pipeline.reduce((sum, d) => sum + (d.value * d.winProbability / 100), 0);

    return { totalPipelineValue, expectedValue };
  }, [pipeline]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline Report</h1>
          <p className="text-gray-600 mt-1">Pipeline stages and deal progression</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Pipeline" value={`₹${(metrics.totalPipelineValue / 100000).toFixed(1)}L`} icon={BarChart3} variant="sales" />
        <KPICard title="Expected Value" value={`₹${(metrics.expectedValue / 100000).toFixed(1)}L`} icon={TrendingUp} variant="sales" />
        <KPICard title="Qualified Deals" value={pipeline[1].count} icon={AlertCircle} variant="sales" />
        <KPICard title="Closed Won" value={pipeline[4].count} icon={TrendingUp} variant="sales" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Deal Count" />
            <Bar yAxisId="right" dataKey="value" fill="#10B981" name="Pipeline Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Stage</th>
                <th className="px-4 py-3 text-right font-semibold">Deals</th>
                <th className="px-4 py-3 text-right font-semibold">Value</th>
                <th className="px-4 py-3 text-right font-semibold">Win Probability</th>
                <th className="px-4 py-3 text-right font-semibold">Expected Value</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pipeline.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.stage}</td>
                  <td className="px-4 py-3 text-right">{item.count}</td>
                  <td className="px-4 py-3 text-right">₹{(item.value / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">{item.winProbability}%</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{(item.value * item.winProbability / 100 / 100000).toFixed(1)}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
