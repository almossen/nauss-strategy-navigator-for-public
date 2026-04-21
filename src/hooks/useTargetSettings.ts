import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TargetSetting {
  id: string;
  year: number;
  is_visible: boolean;
  hero_title_ar: string;
  hero_title_en: string;
  hero_subtitle_ar: string;
  hero_subtitle_en: string;
  highlights: any[];
  story_items: any[];
  footer_title_ar: string;
  footer_title_en: string;
  footer_subtitle_ar: string;
  footer_subtitle_en: string;
  created_at: string;
  updated_at: string;
}

export function useTargetSettings() {
  return useQuery({
    queryKey: ['target_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('target_settings' as any)
        .select('*')
        .order('year');
      if (error) throw error;
      return data as unknown as TargetSetting[];
    },
  });
}

export function useTargetSettingByYear(year: number) {
  return useQuery({
    queryKey: ['target_settings', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('target_settings' as any)
        .select('*')
        .eq('year', year)
        .single();
      if (error) throw error;
      return data as unknown as TargetSetting;
    },
  });
}
