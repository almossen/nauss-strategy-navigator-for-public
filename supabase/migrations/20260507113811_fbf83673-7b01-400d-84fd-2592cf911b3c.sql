INSERT INTO public.page_sections (page, section_key, title_ar, title_en, is_visible, sort_order, content)
VALUES ('global', 'strategy_background', 'خلفية الخطة', 'Plan Background', true, 1, '{}'::jsonb)
ON CONFLICT DO NOTHING;