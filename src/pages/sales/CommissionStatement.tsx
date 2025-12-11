import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface Commission {
  representative: string;
  baseRevenue: number;
  target: number;
  commissionRate: number;
  commissionAmount: number;
  bonus: number;
  total: number;
}

const commissionData: Commission[] = [
  { representative: 'Rajesh Kumar', baseRevenue: 280000, target: 250000, commissionRate: 5, commissionAmount: 14000, bonus: 3000, total: 17000 },
  { representative: 'Priya Sharma', baseRevenue: 320000, target: 300000, commissionRate: 5, commissionAmount: 16000, bonus: 5000, total: 21000 },
  { representative: 'Arun Singh', baseRevenue: 240000, target: 250000, commissionRate: 4, commissionAmount: 9600, bonus: 0, total: 9600 },
  { representative: 'Neha Verma', baseRevenue: 310000, target: 300000, commissionRate: 5, commissionAmount: 15500, bonus: 4000, total: 19500 },
];

export default function CommissionStatement() {
  const [commissions] = useState<Commission[]>(commissionData);

  const metrics = useMemo(() => {
    const totalRevenue = commissions.reduce((sum, c) => sum + c.baseRevenue, 0);
    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalBonus = commissions.reduce((sum, c) => sum + c.bonus, 0);

    return { totalRevenue, totalCommission, totalBonus, totalPayout: totalCommission + totalBonus };
  }, [commissions]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Statement</h1>
          <p className="text-gray-600 mt-1">Sales rep commissions and incentives</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={`₹${(metrics.totalRevenue / 100000).toFixed(1)}L`} icon={DollarSign} variant="sales" />
        <KPICard title="Total Commission" value={`₹${metrics.totalCommission.toLocaleString()}`} icon={TrendingUp} variant="sales" />
        <KPICard title="Total Bonus" value={`₹${metrics.totalBonus.toLocaleString()}`} icon={TrendingUp} variant="sales" />
        <KPICard title="Total Payout" value={`₹${metrics.totalPayout.toLocaleString()}`} icon={DollarSign} variant="sales" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={commissions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="representative" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="commissionAmount" fill="#3B82F6" name="Commission" />
            <Bar dataKey="bonus" fill="#10B981" name="Bonus" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Representative</th>
                <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold">Target</th>
                <th className="px-4 py-3 text-right font-semibold">Commission</th>
                <th className="px-4 py-3 text-right font-semibold">Bonus</th>
                <th className="px-4 py-3 text-right font-semibold">Total Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {commissions.map((c, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.representative}</td>
                  <td className="px-4 py-3 text-right">₹{(c.baseRevenue / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">₹{(c.target / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">₹{c.commissionAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{c.bonus.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{c.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
