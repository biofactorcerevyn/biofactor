import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, BookOpen, FileText } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';

interface LiteratureSource {
  source: string;
  category: string;
  citations: number;
  relevance: 'High' | 'Medium' | 'Low';
  dateAdded: string;
  authors: number;
}

const literatureSources: LiteratureSource[] = [
  { source: 'Nature Biotechnology Journal', category: 'Peer Review', citations: 45, relevance: 'High', dateAdded: '2024-10-15', authors: 12 },
  { source: 'PLOS ONE', category: 'Open Access', citations: 38, relevance: 'High', dateAdded: '2024-10-20', authors: 8 },
  { source: 'Science Direct Research', category: 'Database', citations: 52, relevance: 'High', dateAdded: '2024-09-30', authors: 15 },
  { source: 'BioRxiv Preprints', category: 'Preprint', citations: 22, relevance: 'Medium', dateAdded: '2024-11-05', authors: 6 },
  { source: 'FDA Clinical Guidelines', category: 'Regulatory', citations: 18, relevance: 'High', dateAdded: '2024-08-25', authors: 3 },
];

const citationData = [
  { source: 'Nature Biotech', citations: 45, authors: 12 },
  { source: 'PLOS ONE', citations: 38, authors: 8 },
  { source: 'Science Direct', citations: 52, authors: 15 },
  { source: 'BioRxiv', citations: 22, authors: 6 },
  { source: 'FDA Guidelines', citations: 18, authors: 3 },
];

export default function LiteratureReview() {
  const [sources] = useState(literatureSources);

  const metrics = useMemo(() => {
    const totalSources = sources.length;
    const totalCitations = sources.reduce((sum, s) => sum + s.citations, 0);
    const highRelevance = sources.filter(s => s.relevance === 'High').length;
    const totalAuthors = sources.reduce((sum, s) => sum + s.authors, 0);

    return { totalSources, totalCitations, highRelevance, totalAuthors };
  }, [sources]);

  const relevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'High': return 'bg-success/10 text-success';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  };

  const categoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Peer Review': 'bg-blue-100 text-blue-700',
      'Open Access': 'bg-green-100 text-green-700',
      'Database': 'bg-purple-100 text-purple-700',
      'Preprint': 'bg-orange-100 text-orange-700',
      'Regulatory': 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Literature Review Report</h1>
          <p className="text-gray-600 mt-1">Research sources, citations and knowledge base</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Sources" value={metrics.totalSources} icon={BookOpen} variant="rnd" />
        <KPICard title="Total Citations" value={metrics.totalCitations} icon={FileText} variant="rnd" />
        <KPICard title="High Relevance" value={metrics.highRelevance} icon={BookOpen} variant="rnd" />
        <KPICard title="Contributing Authors" value={metrics.totalAuthors} icon={FileText} variant="rnd" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Citation Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={citationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="citations" fill="#3B82F6" name="Citations" />
            <Bar yAxisId="right" dataKey="authors" fill="#10B981" name="Authors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Literature Sources</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Source</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Citations</th>
                <th className="px-4 py-3 text-right font-semibold">Authors</th>
                <th className="px-4 py-3 text-left font-semibold">Relevance</th>
                <th className="px-4 py-3 text-left font-semibold">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sources.map((source, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{source.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColor(source.category)}`}>
                      {source.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{source.citations}</td>
                  <td className="px-4 py-3 text-right">{source.authors}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${relevanceColor(source.relevance)}`}>
                      {source.relevance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{source.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
