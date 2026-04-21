import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAllKPIs() {
  return useQuery({
    queryKey: ['all_kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*, initiatives!inner(pillar_id, name_ar, name_en)')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

export function useAllStrategicGoals() {
  return useQuery({
    queryKey: ['all_strategic_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategic_goals')
        .select('*, pillars!inner(name_ar, name_en, color)')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}
