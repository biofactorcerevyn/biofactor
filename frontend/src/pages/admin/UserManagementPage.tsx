import React, { useState } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete
} from '@/hooks/useSupabaseQuery';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface User {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  department: string | null;
  role: string;
  is_active: boolean;
  status: string;
  last_login: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const departments = [
  'Sales',
  'Manufacturing',
  'QC',
  'Warehouse',
  'Finance',
  'HR',
  'Field Ops',
  'R&D',
  'Admin'
];

const roles = [
  'super_admin',
  'sales_officer',
  'field_officer',
  'mdo',
  'regional_manager',
  'zonal_manager',
  'warehouse_manager',
  'manufacturing_manager',
  'qc_analyst',
  'finance_officer',
  'hr_manager',
  'rnd_manager',
  'executive',
  'viewer'
];

export default function UserManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    department: '',
    role: 'viewer',
    is_active: true
  });

  /* ---------------- FETCH USERS ---------------- */
  const {
    data: users = [],
    isLoading,
    refetch
  } = useSupabaseQuery<User>('users', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const insertMutation = useSupabaseInsert<User>('users');
  const updateMutation = useSupabaseUpdate<User>('users');
  const deleteMutation = useSupabaseDelete('users');

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns: Column<User>[] = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <StatusBadge
          status={value ? 'success' : 'error'}
          label={value ? 'Active' : 'Inactive'}
          dot
        />
      )
    },
    {
      key: 'last_login',
      label: 'Last Login',
      render: (value) =>
        value ? format(new Date(value), 'dd MMM yyyy HH:mm') : 'Never'
    }
  ];

  /* ---------------- ACTIONS ---------------- */
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      department: '',
      role: 'viewer',
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      phone: user.phone || '',
      department: user.department || '',
      role: user.role,
      is_active: user.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    await deleteMutation.mutateAsync(user.id);
    refetch();
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      full_name: formData.full_name,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      is_active: formData.is_active,
      status: formData.is_active ? 'active' : 'inactive'
    };

    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        data: payload
      });
    } else {
      await insertMutation.mutateAsync(payload);
    }

    setIsDialogOpen(false);
    refetch();
  };

  return (
    <>
      <CrudPage
        title="User Management"
        description="Manage system users and access permissions"
        data={users}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
        addLabel="New User"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={!!editingUser}
            />

            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <Select
              value={formData.department}
              onValueChange={(v) =>
                setFormData({ ...formData, department: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.role}
              onValueChange={(v) =>
                setFormData({ ...formData, role: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.is_active}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, is_active: Boolean(v) })
                }
              />
              <Label>Active User</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  insertMutation.isPending || updateMutation.isPending
                }
              >
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
