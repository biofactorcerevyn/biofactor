import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, MapPin, Users } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface FieldAgentData {
  agent: string;
  region: string;
  visits: number;
  demos: number;
  leadsGenerated: number;
  avgRating: number;
}

const agentData: FieldAgentData[] = [
  { agent: 'Rajesh Verma', region: 'North', visits: 28, demos: 12, leadsGenerated: 24, avgRating: 4.6 },
  { agent: 'Priya Desai', region: 'West', visits: 32, demos: 15, leadsGenerated: 28, avgRating: 4.8 },
  { agent: 'Arun Reddy', region: 'South', visits: 25, demos: 10, leadsGenerated: 20, avgRating: 4.4 },
  { agent: 'Neha Joshi', region: 'East', visits: 30, demos: 14, leadsGenerated: 26, avgRating: 4.7 },
];

const monthlyData = [
  { month: 'Jul', visits: 95, demos: 42, leads: 85 },
  { month: 'Aug', visits: 108, demos: 48, leads: 95 },
  { month: 'Sep', visits: 102, demos: 45, leads: 90 },
  { month: 'Oct', visits: 115, demos: 51, leads: 105 },
  { month: 'Nov', visits: 110, demos: 50, leads: 98 },
];

export default function FieldAgentActivity() {
  const [agents] = useState(agentData);
  const [monthly] = useState(monthlyData);

  const metrics = useMemo(() => {
    const totalVisits = agents.reduce((sum, a) => sum + a.visits, 0);
    const totalDemos = agents.reduce((sum, a) => sum + a.demos, 0);
    const totalLeads = agents.reduce((sum, a) => sum + a.leadsGenerated, 0);
    const avgRating = (agents.reduce((sum, a) => sum + a.avgRating, 0) / agents.length).toFixed(2);

    return { totalVisits, totalDemos, totalLeads, avgRating };
  }, [agents]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Field Agent Activity Report</h1>
          <p className="text-gray-600 mt-1">Field team productivity and customer engagement metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Visits" value={metrics.totalVisits} icon={MapPin} variant="marketing" />
        <KPICard title="Demos Completed" value={metrics.totalDemos} icon={Users} variant="marketing" />
        <KPICard title="Leads Generated" value={metrics.totalLeads} icon={Users} variant="marketing" />
        <KPICard title="Avg Customer Rating" value={metrics.avgRating} icon={Users} variant="marketing" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Field Activity Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#3B82F6" name="Visits" strokeWidth={2} />
            <Line type="monotone" dataKey="demos" stroke="#10B981" name="Demos" strokeWidth={2} />
            <Line type="monotone" dataKey="leads" stroke="#F59E0B" name="Leads" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Field Agent Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agents}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="visits" fill="#3B82F6" name="Visits" />
            <Bar yAxisId="right" dataKey="leadsGenerated" fill="#10B981" name="Leads" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Agent Name</th>
                <th className="px-4 py-3 text-left font-semibold">Region</th>
                <th className="px-4 py-3 text-right font-semibold">Visits</th>
                <th className="px-4 py-3 text-right font-semibold">Demos</th>
                <th className="px-4 py-3 text-right font-semibold">Leads</th>
                <th className="px-4 py-3 text-right font-semibold">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {agents.map((agent, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{agent.agent}</td>
                  <td className="px-4 py-3 text-gray-600">{agent.region}</td>
                  <td className="px-4 py-3 text-right font-semibold">{agent.visits}</td>
                  <td className="px-4 py-3 text-right">{agent.demos}</td>
                  <td className="px-4 py-3 text-right font-semibold">{agent.leadsGenerated}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-success/10 text-success px-2 py-1 rounded font-semibold">{agent.avgRating}</span>
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
