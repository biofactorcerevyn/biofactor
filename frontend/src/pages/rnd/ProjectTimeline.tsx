import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Calendar, Target } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface ProjectMilestone {
  month: string;
  completed: number;
  total: number;
  onTime: number;
}

const milestoneData: ProjectMilestone[] = [
  { month: 'Jul', completed: 3, total: 5, onTime: 3 },
  { month: 'Aug', completed: 6, total: 8, onTime: 5 },
  { month: 'Sep', completed: 5, total: 7, onTime: 4 },
  { month: 'Oct', completed: 7, total: 9, onTime: 6 },
  { month: 'Nov', completed: 6, total: 8, onTime: 5 },
];

interface Project {
  name: string;
  progress: number;
  budget: number;
  spent: number;
  timeline: string;
}

const projects: Project[] = [
  { name: 'AI Enhancement Phase 1', progress: 75, budget: 500000, spent: 375000, timeline: 'On Track' },
  { name: 'Biomarker Discovery', progress: 60, budget: 350000, spent: 210000, timeline: 'On Track' },
  { name: 'Data Analytics Platform', progress: 45, budget: 280000, spent: 126000, timeline: 'At Risk' },
  { name: 'Genomics Analysis Tool', progress: 85, budget: 420000, spent: 357000, timeline: 'On Track' },
];

export default function ProjectTimeline() {
  const [milestones] = useState(milestoneData);
  const [projectList] = useState(projects);

  const metrics = useMemo(() => {
    const totalMilestones = milestones.reduce((sum, m) => sum + m.completed, 0);
    const onTimeCount = milestones.reduce((sum, m) => sum + m.onTime, 0);
    const onTimePercent = ((onTimeCount / totalMilestones) * 100).toFixed(1);
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projectList.reduce((sum, p) => sum + p.spent, 0);
    const budgetUtilization = ((totalSpent / totalBudget) * 100).toFixed(1);

    return { totalMilestones, onTimePercent, budgetUtilization, activeProjects: projectList.length };
  }, [milestones, projectList]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Timeline Report</h1>
          <p className="text-gray-600 mt-1">Milestone tracking and project progress monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Milestones Completed" value={metrics.totalMilestones} icon={Target} variant="rnd" />
        <KPICard title="On-Time Delivery" value={`${metrics.onTimePercent}%`} icon={Calendar} variant="rnd" />
        <KPICard title="Active Projects" value={metrics.activeProjects} icon={Target} variant="rnd" />
        <KPICard title="Budget Utilization" value={`${metrics.budgetUtilization}%`} icon={Calendar} variant="rnd" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Milestone Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={milestones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" strokeWidth={2} />
            <Line type="monotone" dataKey="onTime" stroke="#3B82F6" name="On Time" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Status Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Project Name</th>
                <th className="px-4 py-3 text-right font-semibold">Progress</th>
                <th className="px-4 py-3 text-right font-semibold">Budget</th>
                <th className="px-4 py-3 text-right font-semibold">Spent</th>
                <th className="px-4 py-3 text-left font-semibold">Timeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projectList.map((proj, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{proj.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{proj.progress}%</p>
                  </td>
                  <td className="px-4 py-3 text-right">₹{(proj.budget / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3 text-right">₹{(proj.spent / 100000).toFixed(1)}L</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      proj.timeline === 'On Track' ? 'bg-success/10 text-success' : 'bg-red-100 text-red-700'
                    }`}>
                      {proj.timeline}
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
