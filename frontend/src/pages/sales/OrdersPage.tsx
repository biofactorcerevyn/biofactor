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
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/* ================= TYPES ================= */

interface Order {
  id: string;
  dealer_id: string;
  order_date: string;
  expected_delivery: string | null;
  status: string;
  payment_status: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  action: string | null;
  created_at: string;
  zone?: string | null;
  area?: string | null;
  designation?: string | null;
}

interface Dealer {
  id: string;
  name: string;
  business_name: string | null;
}

/* ================= PAGE ================= */

export default function OrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    dealer_id: '',
    order_date: '',
    expected_delivery: '',
    status: 'pending',
    payment_status: 'unpaid',
    total_amount: 0,
    discount_amount: 0,
    tax_amount: 0,
    action: '',
    zone: '',
    area: '',
    designation: '',
  });

  const { data: orders = [], isLoading, refetch } =
    useSupabaseQuery<Order>('orders', {
      orderBy: { column: 'created_at', ascending: false },
    });

  const { data: dealers = [] } =
    useSupabaseQuery<Dealer>('dealers', {
      select: 'id,name,business_name',
    });

  const insertMutation = useSupabaseInsert<Order>('orders');
  const updateMutation = useSupabaseUpdate<Order>('orders');
  const deleteMutation = useSupabaseDelete('orders');

  /* ================= IMPORT HANDLER (FINAL FIXED) ================= */

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

        if (lines.length < 2) {
          throw new Error('CSV must contain header and data rows');
        }

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

      if (!rawRows.length) {
        throw new Error('No data found in file');
      }

      /* ---------- DEALER NAME → ID MAP ---------- */
      const dealerMap = new Map<string, string>();
      dealers.forEach(d => {
        if (d.name) dealerMap.set(d.name.toLowerCase(), d.id);
        if (d.business_name)
          dealerMap.set(d.business_name.toLowerCase(), d.id);
      });

      /* ---------- MAP & VALIDATE ---------- */
      const records = rawRows
        .map(row => {
          const dealerName =
            row.dealer ??
            row['Dealer'] ??
            row['Dealer Name'] ??
            row['Business Name'] ??
            '';

          const dealerId = dealerMap.get(
            String(dealerName).toLowerCase()
          );

          const total = Number(row.total_amount ?? row['Total Amount'] ?? 0);
          const discount = Number(
            row.discount_amount ?? row['Discount Amount'] ?? 0
          );
          const tax = Number(row.tax_amount ?? row['Tax Amount'] ?? 0);

          return {
            dealer_id: dealerId ?? null,
            order_date: row.order_date ?? row['Order Date'] ?? null,
            expected_delivery:
              row.expected_delivery ?? row['Expected Delivery'] ?? null,
            status: row.status ?? 'pending',
            payment_status: row.payment_status ?? 'unpaid',
            total_amount: total,
            discount_amount: discount,
            tax_amount: tax,
            net_amount: total - discount + tax,
            action: row.action ?? null,
            zone: row.zone ?? null,
            area: row.area ?? null,
            designation: row.designation ?? null,
          };
        })
        .filter(r => r.dealer_id && r.order_date);

      if (!records.length) {
        throw new Error(
          'No valid order rows found. Ensure Dealer Name & Order Date are correct.'
        );
      }

      /* ---------- INSERT ---------- */
      for (const record of records) {
        await insertMutation.mutateAsync(record as any);
      }

      toast.success(`Imported ${records.length} orders successfully`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Import failed');
    }
  };

  /* ================= HELPERS ================= */

  const getDealerName = (dealerId: string) => {
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer?.name || dealer?.business_name || 'Unknown';
  };

  /* ================= TABLE ================= */

  const columns: Column<Order>[] = [
    { key: 'id', label: 'Order #', sortable: true },
    {
      key: 'dealer_id',
      label: 'Dealer',
      render: v => getDealerName(v),
    },
    {
      key: 'order_date',
      label: 'Date',
      render: v => (v ? format(new Date(v), 'dd MMM yyyy') : '-'),
    },
    {
      key: 'expected_delivery',
      label: 'Expected Delivery',
      render: v => (v ? format(new Date(v), 'dd MMM yyyy') : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      render: v => {
        const map: Record<string, any> = {
          delivered: 'success',
          shipped: 'info',
          processing: 'warning',
          pending: 'pending',
          cancelled: 'error',
        };
        return <StatusBadge status={map[v] || 'default'} label={v} dot />;
      },
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: v => (
        <StatusBadge
          status={v === 'paid' ? 'success' : v === 'partial' ? 'warning' : 'error'}
          label={v}
          dot
        />
      ),
    },
    {
      key: 'net_amount',
      label: 'Amount',
      render: v => `₹${(v || 0).toLocaleString()}`,
    },
    { key: 'zone', label: 'Zone' },
    { key: 'area', label: 'Area' },
    { key: 'designation', label: 'Designation' },
  ];

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      dealer_id: '',
      order_date: '',
      expected_delivery: '',
      status: 'pending',
      payment_status: 'unpaid',
      total_amount: 0,
      discount_amount: 0,
      tax_amount: 0,
      action: '',
      zone: '',
      area: '',
      designation: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      dealer_id: order.dealer_id,
      order_date: order.order_date,
      expected_delivery: order.expected_delivery || '',
      status: order.status,
      payment_status: order.payment_status,
      total_amount: order.total_amount,
      discount_amount: order.discount_amount,
      tax_amount: order.tax_amount,
      action: order.action || '',
      zone: order.zone || '',
      area: order.area || '',
      designation: order.designation || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (order: Order) => {
    await deleteMutation.mutateAsync(order.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const net_amount =
      formData.total_amount - formData.discount_amount + formData.tax_amount;

    const payload = {
      ...formData,
      net_amount,
      order_date: formData.order_date || null,
      expected_delivery: formData.expected_delivery || null,
      zone: formData.zone || null,
      area: formData.area || null,
      designation: formData.designation || null,
    };

    if (editingOrder) {
      await updateMutation.mutateAsync({
        id: editingOrder.id,
        data: payload,
      });
    } else {
      await insertMutation.mutateAsync(payload as any);
    }

    setIsDialogOpen(false);
    refetch();
  };

  /* ================= RENDER ================= */

  return (
    <>
      <CrudPage
        title="Orders"
        description="Manage sales orders and track deliveries"
        data={orders}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onImport={handleImport}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
        addLabel="New Order"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingOrder ? 'Edit Order' : 'Create Order'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingOrder ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
