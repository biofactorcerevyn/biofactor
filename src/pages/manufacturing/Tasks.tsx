import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ManufacturingTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue';
  category: string;
}

const defaultTasks: ManufacturingTask[] = [
  { id: '1', title: 'Equipment preventive maintenance - Line A', description: 'Perform scheduled maintenance on production Line A', assignee: 'Maintenance Team', dueDate: '2024-11-22', priority: 'High', status: 'In Progress', category: 'Maintenance' },
  { id: '2', title: 'Investigate QC failure - Batch D-123', description: 'Root cause analysis for defect spike in batch D-123', assignee: 'QC Lead', dueDate: '2024-11-20', priority: 'High', status: 'In Progress', category: 'QC Investigation' },
  { id: '3', title: 'Inventory reordering - BioProduct B', description: 'Submit purchase order for BioProduct B stock replenishment', assignee: 'Inventory Manager', dueDate: '2024-11-21', priority: 'High', status: 'Open', category: 'Inventory' },
  { id: '4', title: 'Update production SOP v4.3', description: 'Revise SOP based on equipment changes and feedback', assignee: 'Process Engineer', dueDate: '2024-11-25', priority: 'Medium', status: 'Open', category: 'Documentation' },
  { id: '5', title: 'Calibration of testing equipment', description: 'Annual calibration of dimensional measurement tools', assignee: 'QC Lab', dueDate: '2024-11-18', priority: 'High', status: 'Completed', category: 'QC' },
  { id: '6', title: 'Production schedule review', description: 'Review and approve next month production plan', assignee: 'Production Manager', dueDate: '2024-11-17', priority: 'Medium', status: 'Completed', category: 'Planning' },
  { id: '7', title: 'Equipment breakdown - Line B urgent repair', description: 'Emergency repair required for Line B conveyor issue', assignee: 'Maintenance Team', dueDate: '2024-11-19', priority: 'High', status: 'Overdue', category: 'Maintenance' },
  { id: '8', title: 'Safety audit and compliance check', description: 'Monthly safety inspection and compliance documentation', assignee: 'Safety Officer', dueDate: '2024-11-26', priority: 'Medium', status: 'Open', category: 'Safety' },
];

export default function ManufacturingTasks() {
  const [mfgTasks, setMfgTasks] = useState<ManufacturingTask[]>(() => {
    try {
      const stored = localStorage.getItem('mfgTasks');
      return stored ? JSON.parse(stored) : defaultTasks;
    } catch (e) {
      return defaultTasks;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mfgTasks', JSON.stringify(mfgTasks));
    } catch (e) {
      // ignore
    }
  }, [mfgTasks]);

  const addTask = (task: ManufacturingTask) => {
    setMfgTasks(prev => [task, ...prev]);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success/10 text-success';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Open': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return '';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return '';
    }
  };

  const openTasks = mfgTasks.filter(t => ['Open', 'In Progress', 'Overdue'].includes(t.status)).length;
  const completedTasks = mfgTasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = mfgTasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Tasks</h1>
          <p className="text-gray-600 mt-1">Equipment maintenance, QC investigations, inventory and SOP updates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{mfgTasks.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open/Active</p>
              <p className="text-2xl font-bold text-gray-900">{openTasks}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task List</h2>
        <div className="mb-4 flex gap-2">
          <button onClick={() => addTask({ id: Date.now().toString(), title: 'Perform routine maintenance on Machine #A12', description: 'Auto-generated maintenance task', assignee: 'Maintenance Team', dueDate: new Date().toISOString().slice(0,10), priority: 'High', status: 'Open', category: 'Maintenance' })} className="px-3 py-2 bg-blue-600 text-white rounded">Create Maintenance Task</button>
          <button onClick={() => addTask({ id: Date.now().toString(), title: 'Investigate QC failure from Batch #XYZ', description: 'Auto-generated QC investigation task', assignee: 'QA Manager', dueDate: new Date().toISOString().slice(0,10), priority: 'High', status: 'Open', category: 'QC Investigation' })} className="px-3 py-2 bg-orange-600 text-white rounded">Create QC RCA Task</button>
          <button onClick={() => addTask({ id: Date.now().toString(), title: 'Order raw materials - Item #123', description: 'Auto-generated procurement task', assignee: 'Procurement Officer', dueDate: new Date().toISOString().slice(0,10), priority: 'High', status: 'Open', category: 'Inventory' })} className="px-3 py-2 bg-green-600 text-white rounded">Create Reorder Task</button>
          <button onClick={() => addTask({ id: Date.now().toString(), title: 'Update SOP for packaging line', description: 'Auto-generated SOP update task', assignee: 'Technical Writer', dueDate: new Date().toISOString().slice(0,10), priority: 'Medium', status: 'Open', category: 'Documentation' })} className="px-3 py-2 bg-gray-600 text-white rounded">Create SOP Update Task</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Task</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Assignee</th>
                <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold">Priority</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mfgTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{task.category}</td>
                  <td className="px-4 py-3 text-gray-600">{task.assignee}</td>
                  <td className="px-4 py-3 text-gray-600">{task.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(task.status)}`}>
                      {task.status}
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
