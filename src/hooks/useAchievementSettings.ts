import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface KeyTarget {
  pillar_id: string;
  pillar_ar: string;
  pillar_en: string;
  goal_ar: string;
  goal_en: string;
  initiative_ar: string;
  initiative_en: string;
  target_ar: string;
  target_en: string;
  kpi_ar: string;
  kpi_en: string;
  target_value: string;
  actual_value: string;
}

export interface AchievementSetting {
  id: string;
  year: number;
  is_visible: boolean;
  hero_title_ar: string;
  hero_title_en: string;
  hero_subtitle_ar: string;
  hero_subtitle_en: string;
  highlights: any[];
  story_items: any[];
  key_targets: KeyTarget[];
  footer_title_ar: string;
  footer_title_en: string;
  footer_subtitle_ar: string;
  footer_subtitle_en: string;
  created_at: string;
  updated_at: string;
}

export interface KpiActual {
  id: string;
  kpi_id: string;
  year: number;
  actual_value: string;
  notes_ar: string;
  notes_en: string;
}

export function useAchievementSettings() {
  return useQuery({
    queryKey: ['achievement_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_settings')
        .select('*')
        .order('year');
      if (error) throw error;
      return data as unknown as AchievementSetting[];
    },
  });
}

export function useAchievementSettingByYear(year: number) {
  return useQuery({
    queryKey: ['achievement_settings', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_settings')
        .select('*')
        .eq('year', year)
        .single();
      if (error) throw error;
      return data as unknown as AchievementSetting;
    },
  });
}

export function useKpiActuals(year: number) {
  return useQuery({
    queryKey: ['kpi_actuals', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_actuals')
        .select('*')
        .eq('year', year);
      if (error) throw error;
      return data as unknown as KpiActual[];
    },
  });
}
