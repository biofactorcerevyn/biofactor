import React, { useState, useEffect } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { Download } from 'lucide-react';
import { syncWorkOrder, postGoodsReceipt, finalizeBatch } from '@/integrations/sap';

interface BatchRecord {
  id: string;
  product: string;
  workOrder: string;
  startTime: string;
  endTime?: string;
  rawMaterials: string; // simple CSV or list
  parameters: string; // JSON or free text of temperatures/pressures
  status: 'In Process' | 'Packed' | 'In Warehouse' | 'Finalized';
  createdAt: string;
}

export default function DigitalBatchRecord() {
  const [records, setRecords] = useState<BatchRecord[]>([]);
  const [form, setForm] = useState({ product: '', workOrder: '', rawMaterials: '', parameters: '' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('batchRecords');
      if (stored) setRecords(JSON.parse(stored));
    } catch (e) { }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('batchRecords', JSON.stringify(records)); } catch (e) { }
  }, [records]);

  const createBatch = () => {
    const b: BatchRecord = {
      id: `B-${Date.now()}`,
      product: form.product || 'Unknown',
      workOrder: form.workOrder || `WO-${Date.now()}`,
      startTime: new Date().toISOString(),
      rawMaterials: form.rawMaterials,
      parameters: form.parameters,
      status: 'In Process',
      createdAt: new Date().toISOString(),
    };
    setRecords(prev => [b, ...prev]);
    setForm({ product: '', workOrder: '', rawMaterials: '', parameters: '' });
    alert(`Batch ${b.id} created (simulated)`);
  };

  const handleSyncWO = async (wo: string) => {
    const res = await syncWorkOrder(wo);
    alert(res.message || 'Synced');
  };

  const handlePostGR = async (batchId: string) => {
    const res = await postGoodsReceipt(batchId);
    alert(res.message || 'Goods receipt posted (simulated)');
    setRecords(prev => prev.map(r => r.id === batchId ? { ...r, status: 'In Warehouse' } : r));
  };

  const handleFinalize = async (batchId: string) => {
    const res = await finalizeBatch(batchId);
    alert(res.message || 'Batch finalized (simulated)');
    setRecords(prev => prev.map(r => r.id === batchId ? { ...r, status: 'Finalized' } : r));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Digital Batch Records</h1>
          <p className="text-gray-600 mt-1">Create and view Digital Batch Records. Sync steps show SAP placeholder actions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">New Batch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder="Product" value={form.product} onChange={e => setForm(prev => ({ ...prev, product: e.target.value }))} className="border rounded px-2 py-1" />
            <input placeholder="Work Order" value={form.workOrder} onChange={e => setForm(prev => ({ ...prev, workOrder: e.target.value }))} className="border rounded px-2 py-1" />
            <textarea placeholder="Raw materials (CSV)" value={form.rawMaterials} onChange={e => setForm(prev => ({ ...prev, rawMaterials: e.target.value }))} className="border rounded px-2 py-1 md:col-span-2" />
            <textarea placeholder="Parameters (temps, pressures)" value={form.parameters} onChange={e => setForm(prev => ({ ...prev, parameters: e.target.value }))} className="border rounded px-2 py-1 md:col-span-2" />
          </div>
          <div className="mt-3">
            <button onClick={createBatch} className="px-3 py-2 bg-success text-white rounded">Create Batch</button>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Quick KPIs</h2>
          <KPICard title="Open Batches" value={records.length} variant="manufacturing" />
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Batch List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Batch</th>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2 text-left">WO</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{r.id}</td>
                  <td className="px-3 py-2">{r.product}</td>
                  <td className="px-3 py-2">{r.workOrder}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleSyncWO(r.workOrder)} className="px-2 py-1 bg-success text-white rounded text-sm">Sync WO</button>
                      <button onClick={() => handlePostGR(r.id)} className="px-2 py-1 bg-success text-white rounded text-sm">Post GR</button>
                      <button onClick={() => handleFinalize(r.id)} className="px-2 py-1 bg-success text-white rounded text-sm">Finalize</button>
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
