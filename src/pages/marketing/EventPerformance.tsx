import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, Users } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface EventData {
  event: string;
  type: string;
  attendance: number;
  leadsGenerated: number;
  spend: number;
  roi: number;
}

const events: EventData[] = [
  { event: 'AgriTech Expo 2024', type: 'Trade Show', attendance: 1250, leadsGenerated: 180, spend: 75000, roi: 320 },
  { event: 'Farmer Connect Webinar', type: 'Webinar', attendance: 450, leadsGenerated: 95, spend: 15000, roi: 850 },
  { event: 'Regional Field Day', type: 'Field Event', attendance: 320, leadsGenerated: 68, spend: 25000, roi: 340 },
  { event: 'Digital Summit 2024', type: 'Conference', attendance: 680, leadsGenerated: 120, spend: 45000, roi: 400 },
];

const typeData = [
  { name: 'Trade Show', attendance: 1250, fill: '#3B82F6' },
  { name: 'Webinar', attendance: 450, fill: '#10B981' },
  { name: 'Field Event', attendance: 320, fill: '#F59E0B' },
  { name: 'Conference', attendance: 680, fill: '#EF4444' },
];

export default function EventPerformance() {
  const [eventList] = useState(events);

  const metrics = useMemo(() => {
    const totalAttendance = eventList.reduce((sum, e) => sum + e.attendance, 0);
    const totalLeads = eventList.reduce((sum, e) => sum + e.leadsGenerated, 0);
    const totalSpend = eventList.reduce((sum, e) => sum + e.spend, 0);
    const avgROI = (eventList.reduce((sum, e) => sum + e.roi, 0) / eventList.length).toFixed(0);

    return { totalAttendance, totalLeads, totalSpend, avgROI };
  }, [eventList]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Performance Report</h1>
          <p className="text-gray-600 mt-1">Trade shows, webinars and field events ROI analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Attendance" value={metrics.totalAttendance} icon={Users} variant="marketing" />
        <KPICard title="Leads Generated" value={metrics.totalLeads} icon={Users} variant="marketing" />
        <KPICard title="Total Event Spend" value={`₹${(metrics.totalSpend / 100000).toFixed(1)}L`} icon={Calendar} variant="marketing" />
        <KPICard title="Average ROI" value={`${metrics.avgROI}%`} icon={Calendar} variant="marketing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance by Event Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" labelLine={false} label={({ name, attendance }) => `${name}: ${attendance}`} outerRadius={100} dataKey="attendance">
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads vs Spend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventList}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="leadsGenerated" fill="#10B981" name="Leads" />
              <Bar yAxisId="right" dataKey="spend" fill="#EF4444" name="Spend (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-right font-semibold">Attendance</th>
                <th className="px-4 py-3 text-right font-semibold">Leads</th>
                <th className="px-4 py-3 text-right font-semibold">Spend</th>
                <th className="px-4 py-3 text-right font-semibold">ROI %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {eventList.map((event, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{event.event}</td>
                  <td className="px-4 py-3 text-gray-600">{event.type}</td>
                  <td className="px-4 py-3 text-right font-semibold">{event.attendance}</td>
                  <td className="px-4 py-3 text-right font-semibold">{event.leadsGenerated}</td>
                  <td className="px-4 py-3 text-right">₹{(event.spend / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-success/10 text-success px-2 py-1 rounded font-semibold">{event.roi}%</span>
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
