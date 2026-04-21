
-- Table to store page section settings (visibility, order, custom content)
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page, section_key)
);

-- Enable RLS
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read page_sections" ON public.page_sections FOR SELECT USING (true);

-- Public write (for now, no auth)
CREATE POLICY "Public write page_sections" ON public.page_sections FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed dashboard sections with defaults
INSERT INTO public.page_sections (page, section_key, title_ar, title_en, is_visible, sort_order, content) VALUES
  ('dashboard', 'hero_banner', 'البانر الرئيسي', 'Hero Banner', true, 1, '{"title_ar":"الخطة الاستراتيجية والتنفيذية","title_en":"Strategic & Executive Plan","subtitle_ar":"جامعة نايف العربية للعلوم الأمنية — بناء مستقبل أمني متميز","subtitle_en":"Naif Arab University for Security Sciences — Building a distinguished security future","year_range":"2025 — 2029"}'::jsonb),
  ('dashboard', 'vision_mission_values', 'الرؤية والرسالة والقيم', 'Vision, Mission & Values', true, 2, '{}'::jsonb),
  ('dashboard', 'stat_cards', 'الإحصائيات', 'Statistics', true, 3, '{}'::jsonb),
  ('dashboard', 'strategic_map', 'الخريطة الاستراتيجية', 'Strategic Map', true, 4, '{}'::jsonb),
  ('dashboard', 'pillar_overview', 'نظرة على الركائز', 'Pillar Overview', true, 5, '{}'::jsonb),
  ('dashboard', 'charts', 'الرسوم البيانية', 'Charts', true, 6, '{}'::jsonb),
  ('dashboard', 'project_timeline', 'الجدول الزمني', 'Project Timeline', true, 7, '{}'::jsonb);
