import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Zap } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface ProductionData {
  month: string;
  production: number;
  target: number;
  downtime: number;
  oee: number;
}

const productionData: ProductionData[] = [
  { month: 'Jul', production: 8500, target: 9000, downtime: 145, oee: 92.5 },
  { month: 'Aug', production: 8950, target: 9000, downtime: 120, oee: 94.2 },
  { month: 'Sep', production: 8200, target: 9000, downtime: 180, oee: 89.8 },
  { month: 'Oct', production: 9150, target: 9000, downtime: 95, oee: 96.1 },
  { month: 'Nov', production: 8850, target: 9000, downtime: 110, oee: 95.3 },
];

interface MachineData {
  machine: string;
  production: number;
  utilization: number;
  oee: number;
  downtime: number;
}

const machineData: MachineData[] = [
  { machine: 'Line A', production: 1850, utilization: 92, oee: 95.2, downtime: 35 },
  { machine: 'Line B', production: 1720, utilization: 88, oee: 92.8, downtime: 48 },
  { machine: 'Line C', production: 1945, utilization: 95, oee: 97.1, downtime: 28 },
  { machine: 'Line D', production: 1650, utilization: 85, oee: 90.5, downtime: 52 },
];

export default function ProductionVolume() {
  const [monthly] = useState(productionData);
  const [machines] = useState(machineData);

  const metrics = useMemo(() => {
    const totalProduction = monthly.reduce((sum, m) => sum + m.production, 0);
    const totalTarget = monthly.reduce((sum, m) => sum + m.target, 0);
    const avgOEE = (monthly.reduce((sum, m) => sum + m.oee, 0) / monthly.length).toFixed(1);
    const totalDowntime = monthly.reduce((sum, m) => sum + m.downtime, 0);

    return { totalProduction, totalTarget, avgOEE, totalDowntime };
  }, [monthly]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Volume Report</h1>
          <p className="text-gray-600 mt-1">Production output, utilization and OEE metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={async () => {
            // simulate sync to SAP for a generic work order
            try {
              const { syncWorkOrder } = await import('@/integrations/sap');
              const res = await syncWorkOrder('WO-EXAMPLE-001');
              alert(res.message || 'SAP Sync complete (simulated)');
            } catch (e) { console.error(e); alert('SAP sync failed (simulated)'); }
          }} className="px-4 py-2 bg-success/90 text-white rounded-lg hover:bg-success/80">Sync to SAP</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Production (YTD)" value={metrics.totalProduction} icon={TrendingUp} variant="manufacturing" />
        <KPICard title="Target vs Actual" value={`${((metrics.totalProduction / metrics.totalTarget) * 100).toFixed(1)}%`} icon={TrendingUp} variant="manufacturing" />
        <KPICard title="Average OEE" value={`${metrics.avgOEE}%`} icon={Zap} variant="manufacturing" />
        <KPICard title="Total Downtime (hrs)" value={metrics.totalDowntime} icon={Zap} variant="manufacturing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Production Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="production" stroke="#10B981" name="Actual" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="target" stroke="#047857" name="Target" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">OEE Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="oee" stroke="#059669" name="OEE %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Machine Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={machines}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="machine" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="production" fill="#10B981" name="Production" />
            <Bar yAxisId="right" dataKey="oee" fill="#059669" name="OEE %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Machine Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Machine</th>
                <th className="px-4 py-3 text-right font-semibold">Output (Units)</th>
                <th className="px-4 py-3 text-right font-semibold">Utilization %</th>
                <th className="px-4 py-3 text-right font-semibold">OEE %</th>
                <th className="px-4 py-3 text-right font-semibold">Downtime (hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {machines.map((machine, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{machine.machine}</td>
                  <td className="px-4 py-3 text-right font-semibold">{machine.production}</td>
                  <td className="px-4 py-3 text-right">{machine.utilization}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-success/10 text-success px-2 py-1 rounded font-semibold">{machine.oee}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">{machine.downtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
