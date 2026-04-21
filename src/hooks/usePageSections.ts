import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageSection {
  id: string;
  page: string;
  section_key: string;
  title_ar: string;
  title_en: string;
  is_visible: boolean;
  sort_order: number;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function usePageSections(page: string) {
  return useQuery({
    queryKey: ['page_sections', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page', page)
        .order('sort_order');
      if (error) throw error;
      return data as unknown as PageSection[];
    },
  });
}

export function useSectionVisibility(page: string) {
  const { data: sections } = usePageSections(page);
  
  return {
    sections,
    isVisible: (sectionKey: string) => {
      if (!sections) return true; // Default to visible if not loaded
      const section = sections.find(s => s.section_key === sectionKey);
      return section ? section.is_visible : true;
    },
    getSection: (sectionKey: string) => {
      return sections?.find(s => s.section_key === sectionKey);
    },
    getSortedKeys: () => {
      if (!sections) return [];
      return sections
        .filter(s => s.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(s => s.section_key);
    },
  };
}
