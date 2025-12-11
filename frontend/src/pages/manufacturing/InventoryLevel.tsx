import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Package, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface InventoryData {
  product: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  value: number;
  turnoverRate: number;
}

const inventoryData: InventoryData[] = [
  { product: 'BioProduct A', currentStock: 2450, reorderPoint: 1000, maxStock: 5000, value: 2450000, turnoverRate: 8.5 },
  { product: 'BioProduct B', currentStock: 850, reorderPoint: 500, maxStock: 3000, value: 980000, turnoverRate: 12.3 },
  { product: 'BioProduct C', currentStock: 1200, reorderPoint: 800, maxStock: 4000, value: 1800000, turnoverRate: 6.8 },
  { product: 'Reagent Mix X', currentStock: 450, reorderPoint: 600, maxStock: 2000, value: 360000, turnoverRate: 18.5 },
];

const monthlyData = [
  { month: 'Jul', value: 4850000, turnover: 7.2 },
  { month: 'Aug', value: 5120000, turnover: 7.8 },
  { month: 'Sep', value: 4950000, turnover: 7.5 },
  { month: 'Oct', value: 5300000, turnover: 8.1 },
  { month: 'Nov', value: 5590000, turnover: 8.2 },
];

export default function InventoryLevel() {
  const [inventory] = useState(inventoryData);
  const [monthly] = useState(monthlyData);

  const createReorderTask = (item: InventoryData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('mfgTasks') || '[]');
      const task = {
        id: 'reorder-' + Date.now(),
        title: `Order raw materials to restock ${item.product}`,
        description: `Auto-generated reorder for ${item.product}`,
        assignee: 'Procurement Officer',
        dueDate: new Date().toISOString().slice(0,10),
        priority: 'High',
        status: 'Open',
        category: 'Inventory',
      };
      localStorage.setItem('mfgTasks', JSON.stringify([task, ...existing]));
      // simple feedback
      try { alert(`${item.product} reorder task added (simulated)`); } catch (e) {}
    } catch (e) {
      console.error('createReorderTask', e);
    }
  };

  const metrics = useMemo(() => {
    const totalValue = inventory.reduce((sum, i) => sum + i.value, 0);
    const avgTurnover = (inventory.reduce((sum, i) => sum + i.turnoverRate, 0) / inventory.length).toFixed(1);
    const lowStock = inventory.filter(i => i.currentStock <= i.reorderPoint).length;
    const totalUnits = inventory.reduce((sum, i) => sum + i.currentStock, 0);

    return { totalValue, avgTurnover, lowStock, totalUnits };
  }, [inventory]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Level Report</h1>
          <p className="text-gray-600 mt-1">Stock levels, valuation and inventory turnover</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Inventory Value" value={`₹${(metrics.totalValue / 1000000).toFixed(1)}M`} icon={Package} variant="manufacturing" />
        <KPICard title="Total Units" value={metrics.totalUnits} icon={Package} variant="manufacturing" />
        <KPICard title="Low Stock Alerts" value={metrics.lowStock} icon={AlertTriangle} variant="manufacturing" />
        <KPICard title="Avg Turnover Rate" value={`${metrics.avgTurnover}x`} icon={Package} variant="manufacturing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Inventory Value Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="value" stroke="#10B981" name="Inventory Value (₹)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="turnover" stroke="#059669" name="Turnover Rate" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Reorder Point</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentStock" fill="#10B981" name="Current Stock" />
              <Bar dataKey="reorderPoint" fill="#047857" name="Reorder Point" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Inventory Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-right font-semibold">Current Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Reorder Point</th>
                <th className="px-4 py-3 text-right font-semibold">Inventory Value</th>
                <th className="px-4 py-3 text-right font-semibold">Turnover Rate</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.product}</td>
                  <td className="px-4 py-3 text-right font-semibold">{item.currentStock}</td>
                  <td className="px-4 py-3 text-right">{item.reorderPoint}</td>
                  <td className="px-4 py-3 text-right">₹{(item.value / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">{item.turnoverRate}x</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.currentStock > item.reorderPoint ? 'bg-success/10 text-success' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.currentStock > item.reorderPoint ? 'OK' : 'REORDER'}
                          </span>
                          {item.currentStock <= item.reorderPoint && (
                            <button onClick={() => createReorderTask(item)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Create Reorder</button>
                          )}
                        </div>
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
