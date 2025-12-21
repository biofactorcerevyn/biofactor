import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '@/hooks/useSupabaseQuery';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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

export default function OrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    dealer_id: '',
    order_date:'',
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

  const { data: orders = [], isLoading, refetch } = useSupabaseQuery<Order>('orders', {
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const { data: dealers = [] } = useSupabaseQuery<Dealer>('dealers', {
    select: 'id,name,business_name'
  });
  
  const insertMutation = useSupabaseInsert<Order>('orders');
  const updateMutation = useSupabaseUpdate<Order>('orders');
  const deleteMutation = useSupabaseDelete('orders');

  const handleImport = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      try {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must contain header and at least one row');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const cols = line.split(',');
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => obj[h] = cols[i] ?? '');
          return obj;
        });

        await Promise.all(rows.map(r => insertMutation.mutateAsync(r)));
        toast.success('Imported orders successfully');
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to import CSV');
      }
      return;
    }

    if (ext === 'xlsx' || ext === 'xls') {
      try {
        const ab = await file.arrayBuffer();
        const wb = XLSX.read(ab, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (rows.length < 2) throw new Error('Excel must contain header and at least one row');
        const headers = rows[0].map((h: any) => String(h).trim());
        const dataRows = rows.slice(1).map(r => {
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => obj[h] = r[i] ?? '');
          return obj;
        });
        await Promise.all(dataRows.map(r => insertMutation.mutateAsync(r)));
        toast.success('Imported orders from Excel successfully');
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to import Excel');
      }
      return;
    }

    toast.success(`${file.name} accepted (not parsed).`);
  };

  const getDealerName = (dealerId: string) => {
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer?.name || 'Unknown' || dealer?.business_name;
  };

  const columns: Column<Order>[] = [
    { key: 'id', label: 'Order #', sortable: true },
    {
      key: 'dealer_id',
      label: 'Dealer',
      sortable: true,
      render: (value) => getDealerName(value),
    },
    {
      key: 'order_date',
      label: 'Date',
      sortable: true,
      render: (value) => value ? format(new Date(value), 'dd MMM yyyy') : '-',
    },
    {
      key: 'expected_delivery',
      label: 'expected_delivery',
      sortable: true,
      render: (value) => value ? format(new Date(value), 'dd MMM yyyy') : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusMap: Record<string, 'success' | 'info' | 'warning' | 'pending' | 'error'> = {
          delivered: 'success',
          shipped: 'info',
          processing: 'warning',
          pending: 'pending',
          cancelled: 'error',
        };
        return <StatusBadge status={statusMap[value] || 'default'} label={value} dot />;
      },
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: (value) => (
        <StatusBadge
          status={value === 'paid' ? 'success' : value === 'partial' ? 'warning' : 'error'}
          label={value}
          dot
        />
      ),
    },
    {
      key: 'net_amount',
      label: 'Amount',
      sortable: true,
      render: (value) => `₹${(value || 0).toLocaleString()}`,
    },
      { key: 'zone', label: 'Zone' },
      { key: 'area', label: 'Area' },
      { key: 'designation', label: 'Designation' },
  ];

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      dealer_id: '',
      order_date:'',
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
      order_date:order.order_date || '',
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
    
    const netAmount = formData.total_amount - formData.discount_amount + formData.tax_amount;
    const submitData = {
      ...formData,
      net_amount: netAmount,
      order_date: formData.order_date || null,
      expected_delivery: formData.expected_delivery || null,
      zone: formData.zone || null,
      area: formData.area || null,
      designation: formData.designation || null,
    };

    if (editingOrder) {
      await updateMutation.mutateAsync({ id: editingOrder.id, data: submitData });
    } else {
      await insertMutation.mutateAsync(submitData);
    }

    setIsDialogOpen(false);
  };

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
        onRefresh={() => refetch()}
        addLabel="New Order"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dealer_id">Dealer *</Label>
                <Select value={formData.dealer_id} onValueChange={v => setFormData({ ...formData, dealer_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dealer" />
                  </SelectTrigger>
                  <SelectContent>
                    {dealers.map(dealer => (
                      <SelectItem key={dealer.id} value={dealer.id}>
                        {dealer.name || dealer.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_date">Order date</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={e => setFormData({ ...formData, order_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_delivery">Expected Delivery</Label>
                <Input
                  id="expected_delivery"
                  type="date"
                  value={formData.expected_delivery}
                  onChange={e => setFormData({ ...formData, expected_delivery: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select value={formData.payment_status} onValueChange={v => setFormData({ ...formData, payment_status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount (₹)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={e => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_amount">Discount (₹)</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  value={formData.discount_amount}
                  onChange={e => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_amount">Tax (₹)</Label>
                <Input
                  id="tax_amount"
                  type="number"
                  value={formData.tax_amount}
                  onChange={e => setFormData({ ...formData, tax_amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Net Amount</Label>
                <div className="px-3 py-2 bg-muted rounded-md font-semibold">
                  ₹{(formData.total_amount - formData.discount_amount + formData.tax_amount).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Textarea
                id="action"
                value={formData.action}
                onChange={e => setFormData({ ...formData, action: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={insertMutation.isPending || updateMutation.isPending}>
                {editingOrder ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
