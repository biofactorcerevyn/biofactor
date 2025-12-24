import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { supabase } from '@/lib/supabaseClient';

/* ------------------ Types ------------------ */

export type UserRole =
  | 'super_admin'
  | 'sales_officer'
  | 'field_officer'
  | 'mdo'
  | 'regional_manager'
  | 'zonal_manager'
  | 'warehouse_manager'
  | 'manufacturing_manager'
  | 'qc_analyst'
  | 'finance_officer'
  | 'hr_manager'
  | 'rnd_manager'
  | 'executive';

export type Department =
  | 'sales'
  | 'manufacturing'
  | 'qc'
  | 'warehouse'
  | 'finance'
  | 'hr'
  | 'fieldops'
  | 'rnd'
  | 'executive';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: Department;
  avatar?: string;
  region?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccessDepartment: (department: Department) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------ Permissions ------------------ */

const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ['*'],
  executive: ['view_all', 'view_reports', 'approve_high'],
  sales_officer: ['sales_view', 'sales_create', 'sales_edit'],
  field_officer: ['field_view', 'field_create'],
  mdo: ['marketing_manage'],
  regional_manager: ['sales_view', 'sales_approve'],
  zonal_manager: ['sales_view', 'sales_approve'],
  warehouse_manager: ['warehouse_manage'],
  manufacturing_manager: ['manufacturing_manage'],
  qc_analyst: ['qc_manage'],
  finance_officer: ['finance_manage'],
  hr_manager: ['hr_manage'],
  rnd_manager: ['rnd_manage'],
};

const roleDepartmentAccess: Record<UserRole, Department[]> = {
  super_admin: ['sales', 'manufacturing', 'qc', 'warehouse', 'finance', 'hr', 'fieldops', 'rnd', 'executive'],
  executive: ['sales', 'manufacturing', 'qc', 'warehouse', 'finance', 'hr', 'fieldops', 'rnd', 'executive'],
  sales_officer: ['sales'],
  field_officer: ['fieldops'],
  mdo: ['sales'],
  regional_manager: ['sales', 'fieldops'],
  zonal_manager: ['sales', 'fieldops'],
  warehouse_manager: ['warehouse'],
  manufacturing_manager: ['manufacturing'],
  qc_analyst: ['qc'],
  finance_officer: ['finance'],
  hr_manager: ['hr'],
  rnd_manager: ['rnd'],
};

/* ------------------ Provider ------------------ */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /* Restore session on refresh */
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          role: (profile as any).role ?? null,
          department: profile.department as Department,
          avatar: profile.avatar_url ?? null,
          region: (profile as any).region ?? null,
        });
      }
    };

    restoreSession();
  }, []);

  /* ------------------ Login ------------------ */
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) return false;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) return false;

    const userData: User = {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: (profile as any).role ?? null,
      department: profile.department as Department,
      avatar: profile.avatar_url ?? null,
      region: (profile as any).region ?? null,
    };
    setUser(userData);
    localStorage.setItem('biofactor_user', JSON.stringify(userData));
    return true;
  }, []);

  /* ------------------ Logout ------------------ */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('biofactor_user');
  }, []);

  /* ------------------ Helpers ------------------ */
  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      const perms = rolePermissions[user.role];
      return perms.includes('*') || perms.includes(permission);
    },
    [user]
  );

  const canAccessDepartment = useCallback(
    (department: Department) => {
      if (!user) return false;
      return roleDepartmentAccess[user.role]?.includes(department);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
        canAccessDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
