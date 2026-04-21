import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUniversityInfo } from '@/hooks/useStrategyData';
import { usePageSections, PageSection } from '@/hooks/usePageSections';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, Reorder } from 'framer-motion';
import {
  LayoutDashboard, Eye, EyeOff, GripVertical, Save,
  Image, Type, BarChart3, Map, Layers, PieChart, Calendar,
  Pencil, ArrowUp, ArrowDown, Settings2
} from 'lucide-react';

const sectionIcons: Record<string, any> = {
  hero_banner: Image,
  vision_mission_values: Eye,
  stat_cards: BarChart3,
  strategic_map: Map,
  pillar_overview: Layers,
  charts: PieChart,
  project_timeline: Calendar,
};

export default function DashboardAdmin({ embedded = false }: { embedded?: boolean }) {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = usePageSections('dashboard');
  const { data: uniInfo } = useUniversityInfo();

  const [localSections, setLocalSections] = useState<PageSection[]>([]);
  const [heroContent, setHeroContent] = useState<Record<string, string>>({});
  const [uniForm, setUniForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Sync from server
  useEffect(() => {
    if (sections) {
      setLocalSections([...sections].sort((a, b) => a.sort_order - b.sort_order));
      const hero = sections.find(s => s.section_key === 'hero_banner');
      if (hero?.content) {
        setHeroContent(hero.content as Record<string, string>);
      }
    }
  }, [sections]);

  useEffect(() => {
    if (uniInfo) {
      setUniForm({
        vision_ar: uniInfo.vision_ar,
        vision_en: uniInfo.vision_en,
        mission_ar: uniInfo.mission_ar,
        mission_en: uniInfo.mission_en,
        values_ar: uniInfo.values_ar,
        values_en: uniInfo.values_en,
      });
    }
  }, [uniInfo]);

  const toggleVisibility = (sectionKey: string) => {
    setLocalSections(prev => prev.map(s =>
      s.section_key === sectionKey ? { ...s, is_visible: !s.is_visible } : s
    ));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    newSections.forEach((s, i) => s.sort_order = i + 1);
    setLocalSections(newSections);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save section visibility & order
      for (const section of localSections) {
        const updateData: any = {
          is_visible: section.is_visible,
          sort_order: section.sort_order,
        };
        if (section.section_key === 'hero_banner') {
          updateData.content = heroContent;
        }
        await supabase
          .from('page_sections')
          .update(updateData)
          .eq('id', section.id);
      }

      // Save university info
      if (uniInfo && Object.keys(uniForm).length > 0) {
        await supabase
          .from('university_info')
          .update(uniForm as any)
          .eq('id', uniInfo.id);
      }

      queryClient.invalidateQueries({ queryKey: ['page_sections'] });
      queryClient.invalidateQueries({ queryKey: ['university_info'] });
      toast.success(t('تم الحفظ بنجاح', 'Saved successfully'));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header - only show when standalone */}
      {!embedded && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}>
              <Settings2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('إدارة لوحة المعلومات', 'Dashboard Management')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('تحكم بأقسام لوحة المعلومات: الإظهار والإخفاء والترتيب والمحتوى', 'Control dashboard sections: visibility, order, and content')}
              </p>
            </div>
          </div>
          <Button onClick={saveAll} disabled={saving} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
            <Save className="h-4 w-4" />
            {saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save Changes')}
          </Button>
        </div>
      )}
      {embedded && (
        <div className="flex justify-end">
          <Button onClick={saveAll} disabled={saving} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
            <Save className="h-4 w-4" />
            {saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save Changes')}
          </Button>
        </div>
      )}

      {/* Section Visibility & Order */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            {t('أقسام لوحة المعلومات', 'Dashboard Sections')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('تحكم في ظهور وترتيب أقسام الصفحة الرئيسية', 'Control the visibility and order of main page sections')}
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {localSections.map((section, index) => {
            const Icon = sectionIcons[section.section_key] || Layers;
            return (
              <motion.div
                key={section.id}
                layout
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  section.is_visible
                    ? 'bg-background border-border'
                    : 'bg-muted/30 border-transparent opacity-60'
                }`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                  background: section.is_visible ? 'hsl(var(--nauss-primary) / 0.1)' : 'hsl(var(--muted))',
                }}>
                  <Icon className="h-4 w-4" style={{ color: section.is_visible ? 'hsl(var(--nauss-primary))' : 'hsl(var(--muted-foreground))' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t(section.title_ar, section.title_en)}</p>
                  <p className="text-xs text-muted-foreground">{section.section_key}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === 0}
                    onClick={() => moveSection(index, 'up')}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === localSections.length - 1}
                    onClick={() => moveSection(index, 'down')}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Switch
                    checked={section.is_visible}
                    onCheckedChange={() => toggleVisibility(section.section_key)}
                  />
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Hero Banner Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            {t('محتوى البانر الرئيسي', 'Hero Banner Content')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t('العنوان (عربي)', 'Title (AR)')}</label>
              <Input
                value={heroContent.title_ar || ''}
                onChange={(e) => setHeroContent(prev => ({ ...prev, title_ar: e.target.value }))}
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t('العنوان (إنجليزي)', 'Title (EN)')}</label>
              <Input
                value={heroContent.title_en || ''}
                onChange={(e) => setHeroContent(prev => ({ ...prev, title_en: e.target.value }))}
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t('الوصف (عربي)', 'Description (AR)')}</label>
              <Textarea
                value={heroContent.subtitle_ar || ''}
                onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle_ar: e.target.value }))}
                dir="rtl" rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t('الوصف (إنجليزي)', 'Description (EN)')}</label>
              <Textarea
                value={heroContent.subtitle_en || ''}
                onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle_en: e.target.value }))}
                dir="ltr" rows={2}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('نطاق السنوات', 'Year Range')}</label>
            <Input
              value={heroContent.year_range || ''}
              onChange={(e) => setHeroContent(prev => ({ ...prev, year_range: e.target.value }))}
              className="max-w-xs"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vision / Mission / Values */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {t('الرؤية والرسالة والقيم', 'Vision, Mission & Values')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'vision', labelAr: 'الرؤية', labelEn: 'Vision' },
            { key: 'mission', labelAr: 'الرسالة', labelEn: 'Mission' },
            { key: 'values', labelAr: 'القيم', labelEn: 'Values' },
          ].map(item => (
            <div key={item.key}>
              <h4 className="text-sm font-semibold text-foreground mb-2">{t(item.labelAr, item.labelEn)}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('عربي', 'Arabic')}</label>
                  <Textarea
                    value={uniForm[`${item.key}_ar`] || ''}
                    onChange={(e) => setUniForm(prev => ({ ...prev, [`${item.key}_ar`]: e.target.value }))}
                    dir="rtl" rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('إنجليزي', 'English')}</label>
                  <Textarea
                    value={uniForm[`${item.key}_en`] || ''}
                    onChange={(e) => setUniForm(prev => ({ ...prev, [`${item.key}_en`]: e.target.value }))}
                    dir="ltr" rows={3}
                  />
                </div>
              </div>
              {item.key !== 'values' && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
