import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Award, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface TrainingData {
  program: string;
  enrolled: number;
  completed: number;
  inProgress: number;
  completionRate: number;
}

const trainingData: TrainingData[] = [
  { program: 'Leadership Development', enrolled: 45, completed: 38, inProgress: 7, completionRate: 84.4 },
  { program: 'Technical Certifications', enrolled: 120, completed: 92, inProgress: 28, completionRate: 76.7 },
  { program: 'Safety & Compliance', enrolled: 305, completed: 298, inProgress: 7, completionRate: 97.7 },
  { program: 'Soft Skills Workshop', enrolled: 85, completed: 68, inProgress: 17, completionRate: 80.0 },
  { program: 'Product Training', enrolled: 95, completed: 76, inProgress: 19, completionRate: 80.0 },
];

export default function TrainingCompletion() {
  const [training] = useState(trainingData);

  const metrics = useMemo(() => {
    const totalEnrolled = training.reduce((sum, t) => sum + t.enrolled, 0);
    const totalCompleted = training.reduce((sum, t) => sum + t.completed, 0);
    const avgCompletion = (training.reduce((sum, t) => sum + t.completionRate, 0) / training.length).toFixed(1);
    const overallRate = ((totalCompleted / totalEnrolled) * 100).toFixed(1);

    return { totalEnrolled, totalCompleted, avgCompletion, overallRate };
  }, [training]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Completion Report</h1>
          <p className="text-gray-600 mt-1">Employee training progress and certification tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Enrolled" value={metrics.totalEnrolled} icon={Award} variant="hr" />
        <KPICard title="Completed" value={metrics.totalCompleted} icon={CheckCircle} variant="hr" />
        <KPICard title="Completion Rate" value={`${metrics.overallRate}%`} icon={Award} variant="hr" />
        <KPICard title="Avg Program Rate" value={`${metrics.avgCompletion}%`} icon={CheckCircle} variant="hr" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate by Program</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={training}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="program" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completionRate" fill="#10B981" name="Completion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Programs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Program</th>
                <th className="px-4 py-3 text-right font-semibold">Enrolled</th>
                <th className="px-4 py-3 text-right font-semibold">Completed</th>
                <th className="px-4 py-3 text-right font-semibold">In Progress</th>
                <th className="px-4 py-3 text-right font-semibold">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {training.map((prog, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{prog.program}</td>
                  <td className="px-4 py-3 text-right">{prog.enrolled}</td>
                  <td className="px-4 py-3 text-right font-semibold">{prog.completed}</td>
                  <td className="px-4 py-3 text-right">{prog.inProgress}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={prog.completionRate >= 85 ? 'bg-success/10 text-success font-semibold px-2 py-1 rounded' : 'font-semibold'}>
                      {prog.completionRate.toFixed(1)}%
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
