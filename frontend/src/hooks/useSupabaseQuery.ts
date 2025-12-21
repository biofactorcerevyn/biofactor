import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/* =========================================================
   READ (SELECT)
========================================================= */
export function useSupabaseQuery<T = any>(
  tableName: string,
  options?: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    enabled?: boolean;
  }
) {
  return useQuery<T[], Error>({
    queryKey: [tableName, JSON.stringify(options ?? {})],
    enabled: options?.enabled !== false,
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select(options?.select ?? '*');

      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        }
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as T[];
    }
  });
}

/* =========================================================
   CREATE (INSERT)
========================================================= */
export function useSupabaseInsert<T = any>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, Record<string, any>>({
    mutationFn: async (insertData) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert([insertData]) // ✅ must be array
        .select()
        .single();

      if (error) throw error;
      return data as T;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success('Record created successfully');
    },

    onError: (error) => {
      if (error.message.toLowerCase().includes('row-level security')) {
        toast.error('Permission denied by security policy');
      } else {
        toast.error(error.message || 'Failed to create record');
      }
    }
  });
}

/* =========================================================
   UPDATE
========================================================= */
export function useSupabaseUpdate<T = any>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, { id: string; data: Record<string, any> }>({
    mutationFn: async ({ id, data }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as T;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success('Record updated successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update record');
    }
  });
}

/* =========================================================
   DELETE
========================================================= */
export function useSupabaseDelete(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      toast.success('Record deleted successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to delete record');
    }
  });
}
