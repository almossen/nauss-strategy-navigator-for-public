
-- Create university_info table
CREATE TABLE public.university_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vision_ar TEXT NOT NULL DEFAULT '',
  vision_en TEXT NOT NULL DEFAULT '',
  mission_ar TEXT NOT NULL DEFAULT '',
  mission_en TEXT NOT NULL DEFAULT '',
  values_ar TEXT NOT NULL DEFAULT '',
  values_en TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pillars table (for both pillars and enablers)
CREATE TABLE public.pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'pillar' CHECK (type IN ('pillar', 'enabler')),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'building',
  color TEXT NOT NULL DEFAULT '#005F5F',
  general_goal_ar TEXT NOT NULL DEFAULT '',
  general_goal_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strategic_goals table
CREATE TABLE public.strategic_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create initiatives table
CREATE TABLE public.initiatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.strategic_goals(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_id UUID NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  owner_ar TEXT NOT NULL DEFAULT '',
  owner_en TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'delayed')),
  outputs_ar TEXT NOT NULL DEFAULT '',
  outputs_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kpis table
CREATE TABLE public.kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_id UUID NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  baseline TEXT NOT NULL DEFAULT '',
  target_2025 TEXT NOT NULL DEFAULT '',
  target_2026 TEXT NOT NULL DEFAULT '',
  target_2027 TEXT NOT NULL DEFAULT '',
  target_2028 TEXT NOT NULL DEFAULT '',
  target_2029 TEXT NOT NULL DEFAULT '',
  final_target TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read, public write for this internal tool)
ALTER TABLE public.university_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- Public read policies (internal tool, no auth needed)
CREATE POLICY "Public read university_info" ON public.university_info FOR SELECT USING (true);
CREATE POLICY "Public write university_info" ON public.university_info FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read pillars" ON public.pillars FOR SELECT USING (true);
CREATE POLICY "Public write pillars" ON public.pillars FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read strategic_goals" ON public.strategic_goals FOR SELECT USING (true);
CREATE POLICY "Public write strategic_goals" ON public.strategic_goals FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read initiatives" ON public.initiatives FOR SELECT USING (true);
CREATE POLICY "Public write initiatives" ON public.initiatives FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read kpis" ON public.kpis FOR SELECT USING (true);
CREATE POLICY "Public write kpis" ON public.kpis FOR ALL USING (true) WITH CHECK (true);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_university_info_updated_at BEFORE UPDATE ON public.university_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pillars_updated_at BEFORE UPDATE ON public.pillars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_strategic_goals_updated_at BEFORE UPDATE ON public.strategic_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_initiatives_updated_at BEFORE UPDATE ON public.initiatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON public.kpis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
