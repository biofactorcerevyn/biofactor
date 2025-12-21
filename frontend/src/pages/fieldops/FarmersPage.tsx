import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '@/hooks/useSupabaseQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface Farmer {
  id: string;
  name: string;
  phone: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  farm_size_acres: number | null;
  crops: any;
  dealer_id: string | null;
  age?: number | null;
  irrigation_type?: string | null;
  land?: string | null;
  soil_type?: string | null;
  lat?: number | null;
  lon?: number | null;
  created_at: string;
}

interface Dealer {
  id: string;
  name: string;
  business_name: string | null;
}

export default function FarmersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    farm_size_acres: 0,
    crops: '',
    age: 0,
    dealer_id: '',
    irrigation_type: '',
    land: '',
    soil_type: '',
    lat: 0,
    lon: 0,
  });

  const { data: farmers = [], isLoading, refetch } = useSupabaseQuery<Farmer>('farmers', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const { data: dealers = [] } = useSupabaseQuery<Dealer>('dealers', {
    select: 'id,name,business_name'
  });

  const insertMutation = useSupabaseInsert<Farmer>('farmers');
  const updateMutation = useSupabaseUpdate<Farmer>('farmers');
  const deleteMutation = useSupabaseDelete('farmers');

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
        toast.success('Imported farmers successfully');
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
        toast.success('Imported farmers from Excel successfully');
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || 'Failed to import Excel');
      }
      return;
    }

    toast.success(`${file.name} accepted (not parsed).`);
  };

  const getDealerName = (dealerId: string | null) => {
    if (!dealerId) return '-';
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer?.business_name || dealer?.name || '-';
  };

  const columns: Column<Farmer>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
    { key: 'phone', label: 'Phone' },
    { key: 'village', label: 'Village', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    {
      key: 'farm_size_acres',
      label: 'Farm Size',
      sortable: true,
      render: (value) => value ? `${value} acres` : '-',
    },
    {
      key: 'dealer_id',
      label: 'Dealer',
      render: (value) => getDealerName(value),
    },
    { key: 'irrigation_type', label: 'Irrigation' },
    { key: 'land', label: 'Land' },
    { key: 'crops', label: 'Crops' },
    { key: 'soil_type', label: 'Soil Type' },
    { key: 'location', label: 'Location', render: (_, row) => (row.lat && row.lon ? `${row.lat}, ${row.lon}` : '-') },
  ];

  const handleAdd = () => {
    setEditingFarmer(null);
    setFormData({
      name: '',
      phone: '',
      village: '',
      district: '',
      state: '',
      farm_size_acres: 0,
      crops: '',
      dealer_id: '',
      irrigation_type: '',
      age: 0,
      land: '',
      soil_type: '',
      lat: 0,
      lon: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      phone: farmer.phone || '',
      village: farmer.village || '',
      district: farmer.district || '',
      state: farmer.state || '',
      farm_size_acres: farmer.farm_size_acres || 0,
      crops: farmer.crops || '',
      age: farmer.age || 0,
      dealer_id: farmer.dealer_id || '',
      irrigation_type: farmer.irrigation_type || '',
      land: farmer.land || '',
      soil_type: farmer.soil_type || '',
      lat: farmer.lat || 0,
      lon: farmer.lon || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (farmer: Farmer) => {
    await deleteMutation.mutateAsync(farmer.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      dealer_id: formData.dealer_id || null,
      farm_size_acres: formData.farm_size_acres || null,
      age: formData.age || null,
      land: formData.land || null,
      soil_type: formData.soil_type || null,
      lat: formData.lat || null,
      lon: formData.lon || null,
    };

    if (editingFarmer) {
      await updateMutation.mutateAsync({ id: editingFarmer.id, data: submitData });
    } else {
      await insertMutation.mutateAsync(submitData);
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Farmers"
        description="Manage farmer database and track relationships"
        data={farmers}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onImport={handleImport}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={() => refetch()}
        addLabel="Add Farmer"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm_size_acres">Farm Size (acres)</Label>
                <Input
                  id="farm_size_acres"
                  type="number"
                  step="0.1"
                  value={formData.farm_size_acres}
                  onChange={e => setFormData({ ...formData, farm_size_acres: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="irrigation_type">Irrigation Type</Label>
                <Select value={formData.irrigation_type || 'none'} onValueChange={v => setFormData({ ...formData, irrigation_type: v === 'none' ? '' : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="drip">Drip</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="dealer_id">Associated Dealer</Label>
                <Select value={formData.dealer_id || "none"} onValueChange={v => setFormData({ ...formData, dealer_id: v === "none" ? "" : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dealer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {dealers.map(dealer => (
                      <SelectItem key={dealer.id} value={dealer.id}>
                        {dealer.business_name || dealer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={insertMutation.isPending || updateMutation.isPending}>
                {editingFarmer ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
