import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface CampaignData {
  channel: string;
  spend: number;
  revenue: number;
  leads: number;
  roi: number;
}

const campaignData: CampaignData[] = [
  { channel: 'Digital Marketing', spend: 45000, revenue: 180000, leads: 250, roi: 300 },
  { channel: 'Print Media', spend: 25000, revenue: 75000, leads: 120, roi: 200 },
  { channel: 'Events', spend: 35000, revenue: 140000, leads: 180, roi: 300 },
  { channel: 'Social Media', spend: 20000, revenue: 100000, leads: 160, roi: 400 },
];

const roiData = [
  { name: 'Digital', roi: 300, fill: '#3B82F6' },
  { name: 'Print', roi: 200, fill: '#10B981' },
  { name: 'Events', roi: 300, fill: '#F59E0B' },
  { name: 'Social', roi: 400, fill: '#EF4444' },
];

export default function CampaignROI() {
  const [campaigns] = useState(campaignData);

  const metrics = useMemo(() => {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
    const avgROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;

    return { totalSpend, totalRevenue, totalLeads, avgROI: avgROI.toFixed(0) };
  }, [campaigns]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign ROI Report</h1>
          <p className="text-gray-600 mt-1">Campaign performance and return on investment by channel</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Campaign Spend" value={`₹${(metrics.totalSpend / 100000).toFixed(1)}L`} icon={DollarSign} variant="marketing" />
        <KPICard title="Total Revenue" value={`₹${(metrics.totalRevenue / 100000).toFixed(1)}L`} icon={TrendingUp} variant="marketing" />
        <KPICard title="Total Leads Generated" value={metrics.totalLeads} icon={TrendingUp} variant="marketing" />
        <KPICard title="Average ROI" value={`${metrics.avgROI}%`} icon={DollarSign} variant="marketing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ROI by Channel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roiData} cx="50%" cy="50%" labelLine={false} label={({ name, roi }) => `${name}: ${roi}%`} outerRadius={100} dataKey="roi">
                {roiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spend vs Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaigns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" fill="#EF4444" name="Spend" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Channel</th>
                <th className="px-4 py-3 text-right font-semibold">Spend</th>
                <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold">Leads</th>
                <th className="px-4 py-3 text-right font-semibold">ROI %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map((camp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{camp.channel}</td>
                  <td className="px-4 py-3 text-right">₹{(camp.spend / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{(camp.revenue / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right">{camp.leads}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-success/10 text-success px-2 py-1 rounded font-semibold">{camp.roi}%</span>
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
