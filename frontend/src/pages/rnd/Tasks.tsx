import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface RNDTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue';
  category: string;
}

const tasks: RNDTask[] = [
  { id: '1', title: 'Design gene therapy experiment', description: 'Create protocol for Phase 2 trial', assignee: 'Dr. Rajesh Sharma', dueDate: '2024-11-25', priority: 'High', status: 'In Progress', category: 'Experiment Design' },
  { id: '2', title: 'Analyze protein folding data', description: 'Process and visualize results from batch C-15', assignee: 'Dr. Priya Gupta', dueDate: '2024-11-22', priority: 'High', status: 'In Progress', category: 'Data Analysis' },
  { id: '3', title: 'Literature review compilation', description: 'Consolidate recent publications on gene therapy', assignee: 'Dr. Neha Singh', dueDate: '2024-11-28', priority: 'Medium', status: 'Open', category: 'Literature Review' },
  { id: '4', title: 'Equipment calibration', description: 'Calibrate mass spectrometer and chromatography systems', assignee: 'Dr. Arun Patel', dueDate: '2024-11-20', priority: 'High', status: 'In Progress', category: 'Maintenance' },
  { id: '5', title: 'Cell culture optimization results', description: 'Document and present findings to team', assignee: 'Dr. Vikram Kumar', dueDate: '2024-11-18', priority: 'Medium', status: 'Completed', category: 'Documentation' },
  { id: '6', title: 'Bacterial resistance analysis', description: 'Complete statistical analysis and report', assignee: 'Dr. Priya Gupta', dueDate: '2024-11-16', priority: 'High', status: 'Overdue', category: 'Analysis' },
  { id: '7', title: 'Attend biotech conference', description: 'Present findings and network with peers', assignee: 'Dr. Rajesh Sharma', dueDate: '2024-11-30', priority: 'Low', status: 'Open', category: 'Conference' },
  { id: '8', title: 'Budget allocation for FY2025', description: 'Prepare equipment and materials budget request', assignee: 'Dr. Arun Patel', dueDate: '2024-11-25', priority: 'Medium', status: 'Open', category: 'Planning' },
];

export default function RNDTasks() {
  const [rndTasks] = useState<RNDTask[]>(tasks);

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

  const openTasks = rndTasks.filter(t => ['Open', 'In Progress', 'Overdue'].includes(t.status)).length;
  const completedTasks = rndTasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = rndTasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">R&D Tasks</h1>
          <p className="text-gray-600 mt-1">Experiment scheduling, analysis and documentation</p>
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
              <p className="text-2xl font-bold text-gray-900">{rndTasks.length}</p>
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
              {rndTasks.map((task) => (
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
