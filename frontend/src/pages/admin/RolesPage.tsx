import React, { useState, useMemo } from 'react';
import { CrudPage, Column } from '@/components/crud/CrudPage';
import { useSupabaseQuery, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from '@/hooks/useSupabaseQuery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[] | null;
  user_count: number | null;
  created_at: string;
}

const availablePermissions = [
  'view_dashboard',
  'create_records',
  'edit_records',
  'delete_records',
  'export_data',
  'manage_users',
  'manage_roles',
  'view_analytics',
  'manage_settings',
  'audit_logs',
];

// Modules to show in the matrix with per-module permissions
const modules = [
  'sales',
  'marketing',
  'hr',
  'rnd',
  'manufacturing',
  'warehouse',
  'finance',
  'fieldops',
  'admin',
];

const perModulePerms = ['view', 'create', 'edit', 'delete', 'approve'];
export default function RolesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const { data: roles = [], isLoading, refetch } = useSupabaseQuery<Role>('roles', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const insertMutation = useSupabaseInsert<Role>('roles');
  const updateMutation = useSupabaseUpdate<Role>('roles');
  const deleteMutation = useSupabaseDelete('roles');

  const columns: Column<Role>[] = [
    { key: 'name', label: 'Role Name', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'user_count', label: 'Users', sortable: true },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (value) => {
        if (!value || !Array.isArray(value)) return '-';
        return `${value.length} permission(s)`;
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => format(new Date(value), 'dd MMM yyyy'),
    },
  ];

  const handleAdd = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    await deleteMutation.mutateAsync(role.id);
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleModulePermToggle = (module: string, perm: string) => {
    const key = `${module}_${perm}`;
    handlePermissionToggle(key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      permissions: formData.permissions.length > 0 ? formData.permissions : null,
    };

    if (editingRole) {
      await updateMutation.mutateAsync({ id: editingRole.id, data: submitData });
    } else {
      await insertMutation.mutateAsync(submitData);
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <CrudPage
        title="Role Management"
        description="Configure roles and permissions"
        data={roles}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={() => refetch()}
        addLabel="New Role"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the role"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
                <Label className="text-base font-semibold">Permissions</Label>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Global Permissions</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={formData.permissions.includes(permission)}
                          onCheckedChange={() => handlePermissionToggle(permission)}
                        />
                        <Label htmlFor={permission} className="font-normal text-sm cursor-pointer">
                          {permission.replace(/_/g, ' ').toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">Module-level Permissions</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm mb-4">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Module</th>
                          {perModulePerms.map(p => (
                            <th key={p} className="px-3 py-2 text-center font-semibold">{p.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {modules.map(mod => (
                          <tr key={mod} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">{mod.toUpperCase()}</td>
                            {perModulePerms.map(p => {
                              const id = `${mod}_${p}`;
                              return (
                                <td key={id} className="px-3 py-2 text-center">
                                  <Checkbox
                                    id={id}
                                    checked={formData.permissions.includes(id)}
                                    onCheckedChange={() => handleModulePermToggle(mod, p)}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Data-Level Security / Row-Level Rules (Optional)</Label>
              <Textarea
                placeholder="e.g. region = user.region OR department = 'Sales'"
                value={(formData as any).row_level || ''}
                onChange={e => setFormData(prev => ({ ...(prev as any), row_level: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Use simple expressions to filter data accessible to this role. These are stored as rules and evaluated by backend (mocked here).</p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={insertMutation.isPending || updateMutation.isPending}>
                {editingRole ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
