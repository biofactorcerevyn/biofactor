import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Users, TrendingDown } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface TurnoverData {
  month: string;
  headcount: number;
  joiners: number;
  leavers: number;
  turnoverRate: number;
}

const turnoverData: TurnoverData[] = [
  { month: 'Jul', headcount: 285, joiners: 5, leavers: 2, turnoverRate: 0.7 },
  { month: 'Aug', headcount: 290, joiners: 8, leavers: 3, turnoverRate: 1.0 },
  { month: 'Sep', headcount: 295, joiners: 7, leavers: 2, turnoverRate: 0.7 },
  { month: 'Oct', headcount: 301, joiners: 10, leavers: 4, turnoverRate: 1.3 },
  { month: 'Nov', headcount: 305, joiners: 8, leavers: 4, turnoverRate: 1.3 },
];

interface DepartmentTurnover {
  department: string;
  employees: number;
  leavers: number;
  rate: number;
}

const depTurnover: DepartmentTurnover[] = [
  { department: 'Sales', employees: 65, leavers: 3, rate: 4.6 },
  { department: 'Operations', employees: 85, leavers: 2, rate: 2.4 },
  { department: 'R&D', employees: 55, leavers: 1, rate: 1.8 },
  { department: 'Manufacturing', employees: 70, leavers: 4, rate: 5.7 },
  { department: 'Finance', employees: 30, leavers: 0, rate: 0.0 },
];

export default function HeadcountTurnoverReport() {
  const [data] = useState(turnoverData);
  const [depData] = useState(depTurnover);

  const metrics = useMemo(() => {
    const currentHeadcount = data[data.length - 1].headcount;
    const avgTurnover = (data.reduce((sum, d) => sum + d.turnoverRate, 0) / data.length).toFixed(2);
    const totalLeavers = data.reduce((sum, d) => sum + d.leavers, 0);

    return { currentHeadcount, avgTurnover, totalLeavers, attritionRisk: '8.2%' };
  }, [data]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Headcount & Turnover Report</h1>
          <p className="text-gray-600 mt-1">Employee headcount trends and attrition analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Current Headcount" value={metrics.currentHeadcount} icon={Users} variant="hr" />
        <KPICard title="Avg Turnover Rate" value={`${metrics.avgTurnover}%`} icon={TrendingDown} variant="hr" />
        <KPICard title="Leavers (YTD)" value={metrics.totalLeavers} icon={Users} variant="hr" />
        <KPICard title="Attrition Risk" value={metrics.attritionRisk} icon={TrendingDown} variant="hr" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Headcount Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="headcount" stroke="#10B981" name="Total Headcount" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Turnover by Department</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={depData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="employees" fill="#3B82F6" name="Employees" />
            <Bar yAxisId="right" dataKey="rate" fill="#EF4444" name="Turnover %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Department</th>
                <th className="px-4 py-3 text-right font-semibold">Headcount</th>
                <th className="px-4 py-3 text-right font-semibold">Leavers</th>
                <th className="px-4 py-3 text-right font-semibold">Turnover %</th>
                <th className="px-4 py-3 text-left font-semibold">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {depData.map((dep, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{dep.department}</td>
                  <td className="px-4 py-3 text-right">{dep.employees}</td>
                  <td className="px-4 py-3 text-right">{dep.leavers}</td>
                  <td className="px-4 py-3 text-right font-semibold">{dep.rate.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      dep.rate > 5 ? 'bg-red-100 text-red-700' :
                      dep.rate > 2.5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-success/10 text-success'
                    }`}>
                      {dep.rate > 5 ? 'High' : dep.rate > 2.5 ? 'Medium' : 'Low'}
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
