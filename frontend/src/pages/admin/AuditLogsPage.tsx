import React, { useMemo, useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_data: any;
  new_data: any;
  ip_address: string | null;
  created_at: string;
}

export default function AuditLogsPage() {
  const { data: logs = [], isLoading, refetch } = useSupabaseQuery<AuditLog>('audit_logs', {
    orderBy: { column: 'created_at', ascending: false },
    limit: 500
  });

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [tableFilter, setTableFilter] = useState<string>('');

  const columns: Column<AuditLog>[] = [
    {
      key: 'created_at',
      label: 'Timestamp',
      sortable: true,
      render: (value) => format(new Date(value), 'dd MMM yyyy HH:mm:ss'),
    },
    {
      key: 'action',
      label: 'Action',
      render: (value) => {
        const colors: Record<string, string> = {
          INSERT: 'bg-success/10 text-success',
          UPDATE: 'bg-info/10 text-info',
          DELETE: 'bg-destructive/10 text-destructive',
        };
        return <Badge className={colors[value] || ''}>{value}</Badge>;
      },
    },
    { key: 'table_name', label: 'Table', sortable: true },
    { key: 'record_id', label: 'Record ID' },
    { key: 'ip_address', label: 'IP Address' },
  ];

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (startDate && new Date(l.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(l.created_at) > new Date(endDate + 'T23:59:59')) return false;
      if (userFilter && l.user_id !== userFilter && !(l.user_id || '').toLowerCase().includes(userFilter.toLowerCase())) return false;
      if (actionFilter && l.action !== actionFilter && !l.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
      if (tableFilter && !l.table_name.toLowerCase().includes(tableFilter.toLowerCase())) return false;
      return true;
    });
  }, [logs, startDate, endDate, userFilter, actionFilter, tableFilter]);

  const exportCsv = () => {
    const rows = filtered.map(r => ({ timestamp: r.created_at, user_id: r.user_id || '', action: r.action, table: r.table_name, record_id: r.record_id || '', ip: r.ip_address || '' }));
    const header = Object.keys(rows[0] || {}).join(',') + '\n';
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const csv = header + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">View system activity and changes. Use filters to narrow results.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2 rounded bg-success text-white">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground">Start date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">End date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">User ID / Email</label>
            <input value={userFilter} onChange={e => setUserFilter(e.target.value)} placeholder="user id or email" className="w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">Action</label>
            <input value={actionFilter} onChange={e => setActionFilter(e.target.value)} placeholder="INSERT, UPDATE, DELETE" className="w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground">Module / Table</label>
            <input value={tableFilter} onChange={e => setTableFilter(e.target.value)} placeholder="table name" className="w-full rounded border px-2 py-1" />
          </div>
        </div>
      </div>

      <CrudPage
        title=""
        description=""
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        exportable={false}
      />
    </div>
  );
}
