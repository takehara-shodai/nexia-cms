import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Tenant {
  id: string;
  name: string;
  short_name?: string;
  description?: string;
}

interface TenantState {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  setCurrentTenant: (tenant: Tenant) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenant: null,
  tenants: [],
  isLoading: false,
  error: null,
  fetchTenants: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        set({ 
          tenants: [],
          currentTenant: null,
          error: 'User not authenticated',
          isLoading: false 
        });
        return;
      }

      const { data: userTenants, error: userTenantsError } = await supabase
        .from('user_tenants')
        .select(`
          tenant:tenants (
            id,
            name,
            short_name
          )
        `)
        .eq('user_id', user.id);

      if (userTenantsError) throw userTenantsError;

      const tenants = userTenants.map(ut => ut.tenant);
      set({ 
        tenants,
        currentTenant: tenants[0] || null,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
}));