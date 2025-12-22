import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
} from '@/hooks/useSupabaseQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // ✅ ADD THIS

/* =======================
   Farmer Interface
======================= */

interface Farmer {
  id: string;
  name: string;
  age: number | null;
  phone: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  farm_size_acres: number | null;
  irrigation_type: string | null;
  land_type: string | null;
  soil_type: string | null;
  crops: string[];
  lat: number | null;
  lon: number | null;
  created_at: string;
}

/* =======================
   Component
======================= */

export default function FarmersPage() {
  const { user } = useAuth(); // ✅ GET LOGGED-IN USER

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    farm_size_acres: '',
    irrigation_type: '',
    land_type: '',
    soil_type: '',
    crops: '',
    lat: '',
    lon: '',
  });

  /* =======================
     Queries
  ======================= */

  const { data: farmers = [], isLoading, refetch } =
    useSupabaseQuery<Farmer>('farmers', {
      orderBy: { column: 'created_at', ascending: false },
    });

  const insertMutation = useSupabaseInsert<Farmer>('farmers');
  const updateMutation = useSupabaseUpdate<Farmer>('farmers');
  const deleteMutation = useSupabaseDelete('farmers');

  /* =======================
     Table Columns
  ======================= */

  const columns: Column<Farmer>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
    { key: 'phone', label: 'Phone' },
    { key: 'village', label: 'Village' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    {
      key: 'farm_size_acres',
      label: 'Farm Size',
      render: v => (v ? `${v} acres` : '-'),
    },
    { key: 'irrigation_type', label: 'Irrigation' },
    { key: 'land_type', label: 'Land' },
    {
      key: 'crops',
      label: 'Crops',
      render: v => (v?.length ? v.join(', ') : '-'),
    },
    { key: 'soil_type', label: 'Soil Type' },
    {
      key: 'location',
      label: 'Location',
      render: (_, row) =>
        row.lat && row.lon ? `${row.lat}, ${row.lon}` : '-',
    },
  ];

  /* =======================
     Handlers
  ======================= */

  const handleAdd = () => {
    setEditingFarmer(null);
    setFormData({
      name: '',
      age: '',
      phone: '',
      village: '',
      district: '',
      state: '',
      farm_size_acres: '',
      irrigation_type: '',
      land_type: '',
      soil_type: '',
      crops: '',
      lat: '',
      lon: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      age: farmer.age?.toString() || '',
      phone: farmer.phone || '',
      village: farmer.village || '',
      district: farmer.district || '',
      state: farmer.state || '',
      farm_size_acres: farmer.farm_size_acres?.toString() || '',
      irrigation_type: farmer.irrigation_type || '',
      land_type: farmer.land_type || '',
      soil_type: farmer.soil_type || '',
      crops: farmer.crops?.join(', ') || '',
      lat: farmer.lat?.toString() || '',
      lon: farmer.lon?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (farmer: Farmer) => {
    await deleteMutation.mutateAsync(farmer.id);
    toast.success('Farmer deleted');
    refetch();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      age: formData.age ? Number(formData.age) : null,
      phone: formData.phone || null,
      village: formData.village || null,
      district: formData.district || null,
      state: formData.state || null,
      farm_size_acres: formData.farm_size_acres
        ? Number(formData.farm_size_acres)
        : null,
      irrigation_type: formData.irrigation_type || null,
      land_type: formData.land_type || null,
      soil_type: formData.soil_type || null,
      crops: formData.crops
        ? formData.crops.split(',').map(c => c.trim())
        : [],
      lat: formData.lat ? Number(formData.lat) : null,
      lon: formData.lon ? Number(formData.lon) : null,
    };

    if (editingFarmer) {
      await updateMutation.mutateAsync({
        id: editingFarmer.id,
        data: payload,
      });
      toast.success('Farmer updated');
    } else {
      // ✅ IMPORTANT FIX
      await insertMutation.mutateAsync({
        ...payload,
        created_by: user.id,
      });
      toast.success('Farmer added');
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
        title="Farmers"
        description="Manage farmer profiles and farm details"
        data={farmers}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
        addLabel="Add Farmer"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFarmer ? 'Edit Farmer' : 'Add Farmer'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              ['Name', 'name'],
              ['Age', 'age'],
              ['Phone', 'phone'],
              ['Village', 'village'],
              ['District', 'district'],
              ['State', 'state'],
              ['Farm Size (acres)', 'farm_size_acres'],
              ['Irrigation', 'irrigation_type'],
              ['Land', 'land_type'],
              ['Soil Type', 'soil_type'],
              ['Latitude', 'lat'],
              ['Longitude', 'lon'],
            ].map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  value={(formData as any)[key]}
                  onChange={e =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="col-span-2">
              <Label>Crops (comma separated)</Label>
              <Input
                value={formData.crops}
                onChange={e =>
                  setFormData({ ...formData, crops: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingFarmer ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
