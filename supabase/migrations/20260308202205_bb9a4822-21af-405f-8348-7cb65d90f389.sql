
-- Table for KPI actual values per year
CREATE TABLE public.kpi_actuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id uuid NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  year integer NOT NULL,
  actual_value text NOT NULL DEFAULT '',
  notes_ar text NOT NULL DEFAULT '',
  notes_en text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kpi_id, year)
);

ALTER TABLE public.kpi_actuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read kpi_actuals" ON public.kpi_actuals FOR SELECT USING (true);
CREATE POLICY "Public write kpi_actuals" ON public.kpi_actuals FOR ALL USING (true) WITH CHECK (true);

-- Table for achievement page settings per year
CREATE TABLE public.achievement_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  is_visible boolean NOT NULL DEFAULT true,
  hero_title_ar text NOT NULL DEFAULT '',
  hero_title_en text NOT NULL DEFAULT '',
  hero_subtitle_ar text NOT NULL DEFAULT '',
  hero_subtitle_en text NOT NULL DEFAULT '',
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  footer_title_ar text NOT NULL DEFAULT '',
  footer_title_en text NOT NULL DEFAULT '',
  footer_subtitle_ar text NOT NULL DEFAULT '',
  footer_subtitle_en text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievement_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read achievement_settings" ON public.achievement_settings FOR SELECT USING (true);
CREATE POLICY "Public write achievement_settings" ON public.achievement_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed default settings for each year
INSERT INTO public.achievement_settings (year, hero_title_ar, hero_title_en, hero_subtitle_ar, hero_subtitle_en, footer_title_ar, footer_title_en, footer_subtitle_ar, footer_subtitle_en, highlights)
VALUES
(2025, 'منجزات عام', 'Achievements of', 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan', 'عام من الإنجازات المتميزة', 'A Year of Outstanding Achievements', 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', 'We continue our journey towards achieving our strategic vision with confident steps and tangible results',
'[{"icon":"GraduationCap","titleAr":"تطوير البرامج الأكاديمية","titleEn":"Academic Programs Development","descAr":"تم إطلاق وإنجاز مشاريع أكاديمية وبحثية خلال العام لتعزيز الريادة في العلوم الأمنية","descEn":"Launched and completed academic and research projects to strengthen leadership in security sciences"},{"icon":"Target","titleAr":"تحقيق مؤشرات الأداء","titleEn":"KPI Achievement","descAr":"تم تحقيق مؤشرات أداء استراتيجية تغطي جميع محاور الخطة الاستراتيجية","descEn":"Achieved strategic KPIs across all strategic plan pillars"},{"icon":"Rocket","titleAr":"مشاريع جديدة منطلقة","titleEn":"New Projects Launched","descAr":"انطلاق مشاريع جديدة تعكس التزام الجامعة بتحقيق رؤيتها الاستراتيجية","descEn":"New projects launched reflecting the university commitment to its strategic vision"},{"icon":"Globe2","titleAr":"التعاون الدولي والشراكات","titleEn":"International Cooperation","descAr":"تعزيز الشراكات الإقليمية والدولية في مجال الأمن والعدالة الجنائية","descEn":"Strengthening regional and international partnerships in security and criminal justice"},{"icon":"Lightbulb","titleAr":"الابتكار والبحث العلمي","titleEn":"Innovation & Research","descAr":"دعم البحث العلمي والابتكار لمواكبة التطورات في مجال العلوم الأمنية","descEn":"Supporting scientific research and innovation to keep pace with security science developments"},{"icon":"Users","titleAr":"بناء القدرات والكفاءات","titleEn":"Capacity Building","descAr":"تأهيل وتدريب الكوادر الأمنية العربية وفق أعلى المعايير الدولية","descEn":"Qualifying and training Arab security personnel according to the highest international standards"}]'::jsonb),
(2026, 'منجزات عام', 'Achievements of', 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan', 'عام من الإنجازات المتميزة', 'A Year of Outstanding Achievements', 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', 'We continue our journey towards achieving our strategic vision with confident steps and tangible results', '[]'::jsonb),
(2027, 'منجزات عام', 'Achievements of', 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan', 'عام من الإنجازات المتميزة', 'A Year of Outstanding Achievements', 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', 'We continue our journey towards achieving our strategic vision with confident steps and tangible results', '[]'::jsonb),
(2028, 'منجزات عام', 'Achievements of', 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan', 'عام من الإنجازات المتميزة', 'A Year of Outstanding Achievements', 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', 'We continue our journey towards achieving our strategic vision with confident steps and tangible results', '[]'::jsonb),
(2029, 'منجزات عام', 'Achievements of', 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan', 'عام من الإنجازات المتميزة', 'A Year of Outstanding Achievements', 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', 'We continue our journey towards achieving our strategic vision with confident steps and tangible results', '[]'::jsonb);
