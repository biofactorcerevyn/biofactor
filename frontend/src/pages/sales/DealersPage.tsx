import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
} from '@/hooks/useSupabaseQuery';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/* ================= TYPES ================= */

interface Dealer {
  id: string;
  name: string;
  business_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
  kyc_status: string;
  region: string;
  credit_limit: number;
  outstanding_balance: number;
  rating?: number | null;
  created_at: string;
}

const initialFormData = {
  name: '',
  business_name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  status: 'active',
  kyc_status: 'pending',
  region: '',
  credit_limit: 0,
  outstanding_balance: 0,
  rating: 0,
};

/* ================= PAGE ================= */

export default function DealersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const { data: dealers = [], isLoading, refetch } =
    useSupabaseQuery<Dealer>('dealers', {
      orderBy: { column: 'created_at', ascending: false },
    });

  const insertMutation = useSupabaseInsert<Dealer>('dealers');
  const updateMutation = useSupabaseUpdate<Dealer>('dealers');
  const deleteMutation = useSupabaseDelete('dealers');

  /* ================= IMPORT HANDLER (FINAL) ================= */

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

        if (lines.length < 2) throw new Error('CSV must have header and data');

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
      const mapRow = (row: Record<string, any>) => ({
        name: row.name ?? row.Name ?? '',
        business_name: row.business_name ?? row['Business Name'] ?? null,
        phone: String(row.phone ?? row.Phone ?? ''),
        email: row.email ?? row.Email ?? null,
        address: row.address ?? row.Address ?? null,
        city: row.city ?? row.City ?? null,
        state: row.state ?? row.State ?? null,
        region: row.region ?? row.Region ?? null,
        status: row.status ?? 'active',
        kyc_status: row.kyc_status ?? 'pending',
        credit_limit: Number(row.credit_limit ?? row['Credit Limit'] ?? 0),
        outstanding_balance: Number(
          row.outstanding_balance ?? row['Outstanding Balance'] ?? 0
        ),
        rating: row.rating !== undefined ? Number(row.rating) : null,
      });

      const records = rawRows
        .map(mapRow)
        .filter(r => r.name && r.phone);

      if (!records.length) {
        throw new Error('No valid dealer records found');
      }

      /* ---------- INSERT ---------- */
      for (const record of records) {
        await insertMutation.mutateAsync(record as any);
      }

      toast.success(`Imported ${records.length} dealers successfully`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Import failed');
    }
  };

  /* ================= TABLE ================= */

  const columns: Column<Dealer>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'business_name', label: 'Business', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: value => (
        <StatusBadge
          status={value === 'active' ? 'success' : value === 'inactive' ? 'error' : 'warning'}
          label={value}
          dot
        />
      ),
    },
    {
      key: 'kyc_status',
      label: 'KYC',
      render: value => (
        <StatusBadge
          status={value === 'verified' ? 'success' : value === 'pending' ? 'warning' : 'error'}
          label={value}
          dot
        />
      ),
    },
    {
      key: 'credit_limit',
      label: 'Credit Limit',
      sortable: true,
      render: v => `₹${(v || 0).toLocaleString()}`,
    },
    {
      key: 'outstanding_balance',
      label: 'Outstanding',
      sortable: true,
      render: v => <span className={v > 0 ? 'text-destructive' : ''}>₹{v}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: v => (v !== null && v !== undefined ? Number(v).toFixed(1) : '-'),
    },
  ];

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditingDealer(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleEdit = (dealer: Dealer) => {
    setEditingDealer(dealer);
    setFormData({ ...dealer });
    setIsDialogOpen(true);
  };

  const handleDelete = (dealer: Dealer) => {
    deleteMutation.mutate(dealer.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDealer) {
      await updateMutation.mutateAsync({ id: editingDealer.id, data: formData });
    } else {
      await insertMutation.mutateAsync(formData as any);
    }
    setIsDialogOpen(false);
    refetch();
  };

  /* ================= RENDER ================= */

  return (
    <>
      <CrudPage
        title="Dealers"
        description="Manage dealer network and accounts"
        data={dealers}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onImport={handleImport}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
        addLabel="Add Dealer"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDealer ? 'Edit Dealer' : 'Add Dealer'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(
                ([key, value]) =>
                  typeof value !== 'number' && (
                    <div key={key}>
                      <Label>{key.replace('_', ' ')}</Label>
                      <Input
                        value={String(value ?? '')}
                        onChange={e =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                      />
                    </div>
                  )
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDealer ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
