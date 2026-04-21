
CREATE TABLE public.target_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  is_visible boolean NOT NULL DEFAULT false,
  hero_title_ar text NOT NULL DEFAULT '',
  hero_title_en text NOT NULL DEFAULT '',
  hero_subtitle_ar text NOT NULL DEFAULT '',
  hero_subtitle_en text NOT NULL DEFAULT '',
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  story_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  footer_title_ar text NOT NULL DEFAULT '',
  footer_title_en text NOT NULL DEFAULT '',
  footer_subtitle_ar text NOT NULL DEFAULT '',
  footer_subtitle_en text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (year)
);

ALTER TABLE public.target_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read target_settings" ON public.target_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public write target_settings" ON public.target_settings FOR ALL TO public USING (true) WITH CHECK (true);

INSERT INTO public.target_settings (year, hero_title_ar, hero_title_en, hero_subtitle_ar, hero_subtitle_en, footer_title_ar, footer_title_en, footer_subtitle_ar, footer_subtitle_en)
VALUES
  (2025, 'مستهدفات عام', 'Targets of', 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية', 'Targets we aim to achieve within the strategic plan', 'نسعى لتحقيق أهدافنا', 'Striving to Achieve Our Goals', 'بخطى واثقة نحو تحقيق رؤيتنا الاستراتيجية', 'Confident steps towards achieving our strategic vision'),
  (2026, 'مستهدفات عام', 'Targets of', 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية', 'Targets we aim to achieve within the strategic plan', 'نسعى لتحقيق أهدافنا', 'Striving to Achieve Our Goals', 'بخطى واثقة نحو تحقيق رؤيتنا الاستراتيجية', 'Confident steps towards achieving our strategic vision'),
  (2027, 'مستهدفات عام', 'Targets of', 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية', 'Targets we aim to achieve within the strategic plan', 'نسعى لتحقيق أهدافنا', 'Striving to Achieve Our Goals', 'بخطى واثقة نحو تحقيق رؤيتنا الاستراتيجية', 'Confident steps towards achieving our strategic vision'),
  (2028, 'مستهدفات عام', 'Targets of', 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية', 'Targets we aim to achieve within the strategic plan', 'نسعى لتحقيق أهدافنا', 'Striving to Achieve Our Goals', 'بخطى واثقة نحو تحقيق رؤيتنا الاستراتيجية', 'Confident steps towards achieving our strategic vision'),
  (2029, 'مستهدفات عام', 'Targets of', 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية', 'Targets we aim to achieve within the strategic plan', 'نسعى لتحقيق أهدافنا', 'Striving to Achieve Our Goals', 'بخطى واثقة نحو تحقيق رؤيتنا الاستراتيجية', 'Confident steps towards achieving our strategic vision');
