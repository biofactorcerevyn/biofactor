import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Target, Users, AlertCircle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface PerformanceData {
  id: string;
  representative: string;
  revenue: number;
  target: number;
  deals: number;
  avgDealSize: number;
  conversionRate: number;
  winRate: number;
}

const generatePerformanceData = (): PerformanceData[] => [
  { id: '1', representative: 'Rajesh Kumar', revenue: 280000, target: 250000, deals: 14, avgDealSize: 20000, conversionRate: 45, winRate: 55 },
  { id: '2', representative: 'Priya Sharma', revenue: 320000, target: 300000, deals: 16, avgDealSize: 20000, conversionRate: 50, winRate: 62 },
  { id: '3', representative: 'Arun Singh', revenue: 240000, target: 250000, deals: 12, avgDealSize: 20000, conversionRate: 40, winRate: 48 },
  { id: '4', representative: 'Neha Verma', revenue: 310000, target: 300000, deals: 15, avgDealSize: 20667, conversionRate: 52, winRate: 60 },
];

export default function PerformanceReport() {
  const [perfData] = useState<PerformanceData[]>(generatePerformanceData());

  const metrics = useMemo(() => {
    const totalRevenue = perfData.reduce((sum, d) => sum + d.revenue, 0);
    const totalTarget = perfData.reduce((sum, d) => sum + d.target, 0);
    const avgConversion = perfData.reduce((sum, d) => sum + d.conversionRate, 0) / perfData.length;

    return { totalRevenue, totalTarget, avgConversion, achievement: (totalRevenue / totalTarget) * 100 };
  }, [perfData]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Performance Report</h1>
          <p className="text-gray-600 mt-1">Individual rep performance and metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Team Revenue" value={`₹${(metrics.totalRevenue / 100000).toFixed(1)}L`} icon={TrendingUp} variant="sales" />
        <KPICard title="Achievement" value={`${Math.round(metrics.achievement)}%`} icon={Target} variant="sales" />
        <KPICard title="Avg Conversion" value={`${Math.round(metrics.avgConversion)}%`} icon={Users} variant="sales" />
        <KPICard title="Top Performer" value="Priya Sharma" icon={TrendingUp} variant="sales" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Representative</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perfData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="representative" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="target" fill="#9CA3AF" />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Rep Name</th>
                <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold">Target</th>
                <th className="px-4 py-3 text-right font-semibold">Achievement</th>
                <th className="px-4 py-3 text-right font-semibold">Deals</th>
                <th className="px-4 py-3 text-right font-semibold">Conversion %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {perfData.map(rep => (
                <tr key={rep.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{rep.representative}</td>
                  <td className="px-4 py-3 text-right">₹{(rep.revenue / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">₹{(rep.target / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${(rep.revenue / rep.target) * 100 >= 100 ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-700'}`}>
                      {((rep.revenue / rep.target) * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{rep.deals}</td>
                  <td className="px-4 py-3 text-right">{rep.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
