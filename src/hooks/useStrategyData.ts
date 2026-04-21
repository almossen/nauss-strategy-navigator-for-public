import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUniversityInfo() {
  return useQuery({
    queryKey: ['university_info'],
    queryFn: async () => {
      const { data, error } = await supabase.from('university_info').select('*').limit(1).single();
      if (error) throw error;
      return data;
    },
  });
}

export function usePillars() {
  return useQuery({
    queryKey: ['pillars'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pillars').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

export function useStrategicGoals(pillarId?: string) {
  return useQuery({
    queryKey: ['strategic_goals', pillarId],
    queryFn: async () => {
      let query = supabase.from('strategic_goals').select('*').order('sort_order');
      if (pillarId) query = query.eq('pillar_id', pillarId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: pillarId !== undefined,
  });
}

export function useInitiatives(pillarId?: string) {
  return useQuery({
    queryKey: ['initiatives', pillarId],
    queryFn: async () => {
      let query = supabase.from('initiatives').select('*').order('sort_order');
      if (pillarId) query = query.eq('pillar_id', pillarId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useProjects(initiativeId?: string) {
  return useQuery({
    queryKey: ['projects', initiativeId],
    queryFn: async () => {
      let query = supabase.from('projects').select('*').order('sort_order');
      if (initiativeId) query = query.eq('initiative_id', initiativeId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAllProjects() {
  return useQuery({
    queryKey: ['all_projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*, initiatives!inner(pillar_id, name_ar, name_en)').order('start_date');
      if (error) throw error;
      return data;
    },
  });
}

export function useKPIs(initiativeId?: string) {
  return useQuery({
    queryKey: ['kpis', initiativeId],
    queryFn: async () => {
      let query = supabase.from('kpis').select('*').order('sort_order');
      if (initiativeId) query = query.eq('initiative_id', initiativeId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [pillars, initiatives, projects, kpis] = await Promise.all([
        supabase.from('pillars').select('id', { count: 'exact' }),
        supabase.from('initiatives').select('id', { count: 'exact' }),
        supabase.from('projects').select('id, status', { count: 'exact' }),
        supabase.from('kpis').select('id', { count: 'exact' }),
      ]);
      return {
        pillarsCount: pillars.count || 0,
        initiativesCount: initiatives.count || 0,
        projectsCount: projects.count || 0,
        kpisCount: kpis.count || 0,
        projects: projects.data || [],
      };
    },
  });
}
