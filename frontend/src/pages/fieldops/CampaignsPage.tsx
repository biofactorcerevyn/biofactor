import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
} from '@/hooks/useSupabaseQuery';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/* =======================
   Types
======================= */

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'planned' | 'active' | 'paused' | 'completed';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  spent: number | null;
  target: number | null;
  achieved: number | null;
  area: string | null;
  campaign_run_by: string | null;
  created_at: string;
}

/* =======================
   Constants
======================= */

const campaignTypes = [
  'Product Launch',
  'Dealer Incentive',
  'Farmer Demo',
  'Brand Awareness',
  'Seasonal Promotion',
  'Digital Marketing',
];

/* =======================
   Component
======================= */

export default function CampaignsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'planned',
    start_date: '',
    end_date: '',
    budget: '',
    spent: '',
    target: '',
    achieved: '',
    area: '',
    campaign_run_by: '',
  });

  const { data: campaigns = [], isLoading, refetch } =
    useSupabaseQuery<Campaign>('campaigns', {
      orderBy: { column: 'created_at', ascending: false },
    });

  const insertMutation = useSupabaseInsert<Campaign>('campaigns');
  const updateMutation = useSupabaseUpdate<Campaign>('campaigns');
  const deleteMutation = useSupabaseDelete('campaigns');

  /* =======================
     IMPORT HANDLER (FINAL)
  ======================= */

  const handleImport = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      toast.error('Only CSV or Excel files are supported');
      return;
    }

    try {
      let rawRows: Record<string, any>[] = [];

      /* ---------- READ FILE ---------- */
      if (ext === 'csv') {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) throw new Error('CSV must contain header and data');

        const headers = lines[0].split(',').map(h => h.trim());

        rawRows = lines.slice(1).map(line => {
          const cols = line.split(',');
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => (obj[h] = cols[i]?.trim() ?? null));
          return obj;
        });
      } else {
        const ab = await file.arrayBuffer();
        const wb = XLSX.read(ab, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });
      }

      if (!rawRows.length) throw new Error('No data found in file');

      /* ---------- MAP TO DB STRUCTURE ---------- */
      const mapRowToCampaign = (row: Record<string, any>) => ({
        name: row.name ?? row.Name ?? row['Campaign Name'] ?? '',
        type: row.type ?? row.Type ?? '',
        status: row.status ?? 'planned',
        start_date: row.start_date ?? row['Start Date'] ?? null,
        end_date: row.end_date ?? row['End Date'] ?? null,
        budget: row.budget ? Number(row.budget) : null,
        spent: row.spent ? Number(row.spent) : null,
        target: row.target ? Number(row.target) : null,
        achieved: row.achieved ? Number(row.achieved) : null,
        area: row.area ?? row.Area ?? null,
        campaign_run_by:
          row.campaign_run_by ?? row['Campaign Run By'] ?? null,
      });

      const records = rawRows
        .map(mapRowToCampaign)
        .filter(r => r.name && r.type);

      if (!records.length) {
        throw new Error('No valid campaign records found');
      }

      /* ---------- INSERT ---------- */
      for (const record of records) {
        await insertMutation.mutateAsync(record as any);
      }

      toast.success(`Imported ${records.length} campaigns successfully`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Import failed');
    }
  };

  /* =======================
     Table Columns
  ======================= */

  const columns: Column<Campaign>[] = [
    { key: 'name', label: 'Campaign Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: value => {
        const map: Record<string, any> = {
          planned: 'warning',
          active: 'success',
          paused: 'pending',
          completed: 'info',
        };
        return (
          <StatusBadge status={map[value] || 'default'} label={value} dot />
        );
      },
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => {
        const s = row.start_date
          ? format(new Date(row.start_date), 'dd MMM')
          : '-';
        const e = row.end_date
          ? format(new Date(row.end_date), 'dd MMM yyyy')
          : '-';
        return `${s} - ${e}`;
      },
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: v => (v ? `₹${(v / 100000).toFixed(1)}L` : '-'),
    },
    { key: 'area', label: 'Area' },
    {
      key: 'campaign_run_by',
      label: 'Campaign Run By',
      render: v => v || '-',
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (_, row) => {
        const percent = row.budget
          ? ((row.spent || 0) / row.budget) * 100
          : 0;
        return (
          <div className="w-24">
            <Progress value={percent} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {percent.toFixed(0)}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'achievement',
      label: 'Achievement',
      render: (_, row) => {
        const percent = row.target
          ? ((row.achieved || 0) / row.target) * 100
          : 0;
        return `${row.achieved || 0}/${row.target || 0} (${percent.toFixed(
          0
        )}%)`;
      },
    },
  ];

  /* =======================
     CRUD
  ======================= */

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      name: '',
      type: '',
      status: 'planned',
      start_date: '',
      end_date: '',
      budget: '',
      spent: '',
      target: '',
      achieved: '',
      area: '',
      campaign_run_by: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (c: Campaign) => {
    setEditing(c);
    setFormData({
      name: c.name,
      type: c.type,
      status: c.status,
      start_date: c.start_date || '',
      end_date: c.end_date || '',
      budget: c.budget?.toString() || '',
      spent: c.spent?.toString() || '',
      target: c.target?.toString() || '',
      achieved: c.achieved?.toString() || '',
      area: c.area || '',
      campaign_run_by: c.campaign_run_by || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (c: Campaign) => {
    await deleteMutation.mutateAsync(c.id);
    toast.success('Campaign deleted');
    refetch();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      type: formData.type,
      status: formData.status,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      budget: formData.budget ? Number(formData.budget) : null,
      spent: formData.spent ? Number(formData.spent) : null,
      target: formData.target ? Number(formData.target) : null,
      achieved: formData.achieved ? Number(formData.achieved) : null,
      area: formData.area || null,
      campaign_run_by: formData.campaign_run_by || null,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: payload });
      toast.success('Campaign updated');
    } else {
      await insertMutation.mutateAsync(payload);
      toast.success('Campaign created');
    }

    setIsDialogOpen(false);
    refetch();
  };

  /* =======================
     Render
  ======================= */

  return (
    <>
      <CrudPage
        title="Marketing Campaigns"
        description="Plan, execute and track marketing campaigns"
        data={campaigns}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onImport={handleImport}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
        addLabel="New Campaign"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Campaign' : 'Create Campaign'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* form UI unchanged */}
            <div className="col-span-2 flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
