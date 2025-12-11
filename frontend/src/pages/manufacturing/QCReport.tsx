import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface QCData {
  batch: string;
  unitsProduced: number;
  defects: number;
  fpy: number;
  defectRate: number;
}

const qcData: QCData[] = [
  { batch: 'Batch A-120', unitsProduced: 1500, defects: 8, fpy: 99.5, defectRate: 0.53 },
  { batch: 'Batch B-121', unitsProduced: 1450, defects: 15, fpy: 98.97, defectRate: 1.03 },
  { batch: 'Batch C-122', unitsProduced: 1600, defects: 6, fpy: 99.625, defectRate: 0.375 },
  { batch: 'Batch D-123', unitsProduced: 1350, defects: 22, fpy: 98.37, defectRate: 1.63 },
  { batch: 'Batch E-124', unitsProduced: 1500, defects: 10, fpy: 99.33, defectRate: 0.67 },
];

const defectTypeData = [
  { name: 'Dimensional', count: 28, fill: '#065f46' },
  { name: 'Surface', count: 18, fill: '#10B981' },
  { name: 'Assembly', count: 10, fill: '#34D399' },
  { name: 'Electrical', count: 5, fill: '#86efac' },
];

export default function QCReport() {
  const [batches] = useState(qcData);

  const metrics = useMemo(() => {
    const totalProduced = batches.reduce((sum, b) => sum + b.unitsProduced, 0);
    const totalDefects = batches.reduce((sum, b) => sum + b.defects, 0);
    const avgFPY = (batches.reduce((sum, b) => sum + b.fpy, 0) / batches.length).toFixed(2);
    const overallDefectRate = ((totalDefects / totalProduced) * 100).toFixed(2);

    return { totalProduced, totalDefects, avgFPY, overallDefectRate };
  }, [batches]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quality Control Report</h1>
          <p className="text-gray-600 mt-1">Defect rates, first pass yield and quality metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={async () => {
            try {
              const { finalizeBatch } = await import('@/integrations/sap');
              const res = await finalizeBatch('BATCH-EXAMPLE-001');
              alert(res.message || 'SAP finalize complete (simulated)');
            } catch (e) { console.error(e); alert('SAP finalize failed (simulated)'); }
          }} className="px-4 py-2 bg-success/90 text-white rounded-lg hover:bg-success/80">Sync to SAP</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Units Produced" value={metrics.totalProduced} icon={CheckCircle} variant="manufacturing" />
        <KPICard title="Total Defects" value={metrics.totalDefects} icon={AlertCircle} variant="manufacturing" />
        <KPICard title="Avg First Pass Yield" value={`${metrics.avgFPY}%`} icon={CheckCircle} variant="manufacturing" />
        <KPICard title="Overall Defect Rate" value={`${metrics.overallDefectRate}%`} icon={AlertCircle} variant="manufacturing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Defect Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={defectTypeData} cx="50%" cy="50%" labelLine={false} label={({ name, count }) => `${name}: ${count}`} outerRadius={100} dataKey="count">
                {defectTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">First Pass Yield by Batch</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batches}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="batch" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fpy" fill="#10B981" name="FPY %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Quality Details</h2>
        <div className="mb-3 flex gap-2">
          <button onClick={() => {
            try {
              const existing = JSON.parse(localStorage.getItem('mfgTasks') || '[]');
              const task = { id: 'rca-' + Date.now(), title: 'RCA: Investigate QC failure', description: 'Auto-created from QC report', assignee: 'QA Manager', dueDate: new Date().toISOString().slice(0,10), priority: 'High', status: 'Open', category: 'QC Investigation' };
              localStorage.setItem('mfgTasks', JSON.stringify([task, ...existing]));
              alert('RCA task created (simulated)');
            } catch (e) { console.error(e); }
          }} className="px-3 py-2 bg-success text-white rounded">Create RCA Task</button>
          <button onClick={() => {
            const coa = `Certificate of Analysis\nGenerated: ${new Date().toLocaleString()}\nTotal Produced: ${metrics.totalProduced}\nTotal Defects: ${metrics.totalDefects}\nDefect Rate: ${metrics.overallDefectRate}%`;
            const blob = new Blob([coa], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `CoA_${Date.now()}.txt`; a.click(); URL.revokeObjectURL(url);
          }} className="px-3 py-2 bg-success text-white rounded">Generate CoA</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Batch</th>
                <th className="px-4 py-3 text-right font-semibold">Units Produced</th>
                <th className="px-4 py-3 text-right font-semibold">Defects</th>
                <th className="px-4 py-3 text-right font-semibold">Defect Rate %</th>
                <th className="px-4 py-3 text-right font-semibold">First Pass Yield %</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {batches.map((batch, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{batch.batch}</td>
                  <td className="px-4 py-3 text-right">{batch.unitsProduced}</td>
                  <td className="px-4 py-3 text-right font-semibold">{batch.defects}</td>
                  <td className="px-4 py-3 text-right">{batch.defectRate.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right font-semibold">{batch.fpy.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      batch.fpy >= 99 ? 'bg-success/10 text-success' :
                      batch.fpy >= 98 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {batch.fpy >= 99 ? 'Excellent' : batch.fpy >= 98 ? 'Good' : 'Alert'}
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
