import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAchievementSettings, AchievementSetting, useKpiActuals, KpiActual } from '@/hooks/useAchievementSettings';
import { useAllKPIs } from '@/hooks/useAllKPIs';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Trophy, Save, Eye, EyeOff, Sparkles, Type, Target, Zap,
  Pencil, Plus, Trash2, BarChart3, ArrowUp, ArrowDown,
  GraduationCap, Rocket, Globe2, Lightbulb, Users, CheckCircle2,
  AlertTriangle, FolderOpen
} from 'lucide-react';
import { useAllProjects, usePillars } from '@/hooks/useStrategyData';

const YEARS = [2025, 2026, 2027, 2028, 2029];

const iconOptions = [
  { value: 'GraduationCap', label: 'GraduationCap' },
  { value: 'Target', label: 'Target' },
  { value: 'Rocket', label: 'Rocket' },
  { value: 'Globe2', label: 'Globe2' },
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Users', label: 'Users' },
  { value: 'Trophy', label: 'Trophy' },
  { value: 'CheckCircle2', label: 'CheckCircle2' },
  { value: 'Sparkles', label: 'Sparkles' },
];

export default function AchievementsAdmin({ embedded = false }: { embedded?: boolean }) {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useAchievementSettings();
  const { data: allKpis } = useAllKPIs();
  const { data: allProjects } = useAllProjects();
  const { data: pillars } = usePillars();
  const [activeYear, setActiveYear] = useState(2025);
  const [localSettings, setLocalSettings] = useState<AchievementSetting[]>([]);
  const [kpiActuals, setKpiActuals] = useState<Record<string, string>>({});
  const [projectStatuses, setProjectStatuses] = useState<Record<string, string>>({});
  const [projectPillarFilter, setProjectPillarFilter] = useState<string>('all');
  const [storyPillarFilter, setStoryPillarFilter] = useState<string>('all');
  const [kpiPillarFilter, setKpiPillarFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  const { data: yearActuals } = useKpiActuals(activeYear);

  useEffect(() => {
    if (settings) setLocalSettings([...settings]);
  }, [settings]);

  useEffect(() => {
    if (yearActuals) {
      const map: Record<string, string> = {};
      yearActuals.forEach(a => { map[a.kpi_id] = a.actual_value; });
      setKpiActuals(map);
    } else {
      setKpiActuals({});
    }
  }, [yearActuals]);

  // Load project statuses
  useEffect(() => {
    if (allProjects) {
      const map: Record<string, string> = {};
      allProjects.forEach(p => { map[p.id] = p.status || 'planned'; });
      setProjectStatuses(map);
    }
  }, [allProjects]);

  // Filter projects relevant to the active year (by start or end date)
  const yearProjects = allProjects?.filter(p => {
    const yearStr = String(activeYear);
    const matchesYear = (p.start_date && p.start_date.startsWith(yearStr)) || (p.end_date && p.end_date.startsWith(yearStr));
    const matchesPillar = projectPillarFilter === 'all' || (p as any).initiatives?.pillar_id === projectPillarFilter;
    return matchesYear && matchesPillar;
  }) || [];

  const current = localSettings.find(s => s.year === activeYear);

  const updateField = (field: string, value: any) => {
    setLocalSettings(prev => prev.map(s =>
      s.year === activeYear ? { ...s, [field]: value } : s
    ));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    if (!current) return;
    const newHighlights = [...(current.highlights || [])];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    updateField('highlights', newHighlights);
  };

  const addHighlight = () => {
    if (!current) return;
    const newHighlights = [...(current.highlights || []), {
      icon: 'Sparkles', titleAr: '', titleEn: '', descAr: '', descEn: ''
    }];
    updateField('highlights', newHighlights);
  };

  const removeHighlight = (index: number) => {
    if (!current) return;
    const newHighlights = [...(current.highlights || [])];
    newHighlights.splice(index, 1);
    updateField('highlights', newHighlights);
  };

  const targetField = `target_${activeYear}` as string;
  const yearKpis = allKpis?.filter((k: any) => {
    const val = (k as any)[targetField];
    const hasTarget = val && val !== '' && val !== '0' && val !== '-';
    const matchesPillar = kpiPillarFilter === 'all' || (k as any).initiatives?.pillar_id === kpiPillarFilter;
    return hasTarget && matchesPillar;
  }) || [];

  const normalizeStatus = (status?: string) => {
    if (status === 'in_progress' || status === 'planned') return 'launched';
    return status || 'launched';
  };

  const populateStoryFromData = () => {
    if (!current) return;
    const items: any[] = [];
    const completed = yearProjects.filter(p => normalizeStatus(projectStatuses[p.id] || p.status) === 'completed');
    const launched = yearProjects.filter(p => normalizeStatus(projectStatuses[p.id] || p.status) === 'launched');
    const delayed = yearProjects.filter(p => normalizeStatus(projectStatuses[p.id] || p.status) === 'delayed');

    completed.forEach(p => items.push({ icon: 'CheckCircle2', textAr: `تم إنجاز: ${p.name_ar}`, textEn: `Completed: ${p.name_en}`, pillarId: (p as any).initiatives?.pillar_id || '' }));
    launched.forEach(p => items.push({ icon: 'Rocket', textAr: `تم إطلاق: ${p.name_ar}`, textEn: `Launched: ${p.name_en}`, pillarId: (p as any).initiatives?.pillar_id || '' }));
    delayed.forEach(p => items.push({ icon: 'AlertTriangle', textAr: `متأخر: ${p.name_ar}`, textEn: `Delayed: ${p.name_en}`, pillarId: (p as any).initiatives?.pillar_id || '' }));
    yearKpis.slice(0, 5).forEach((k: any) => {
      const target = (k as any)[targetField];
      items.push({ icon: 'Target', textAr: `تحقيق مستهدف "${k.name_ar}" بقيمة ${target}`, textEn: `Achieved "${k.name_en}" target of ${target}`, pillarId: (k as any).initiatives?.pillar_id || '' });
    });

    updateField('story_items', [...(current.story_items || []), ...items]);
    toast.success(t('تمت إضافة العناصر التلقائية', 'Auto items added'));
  };

  const updateStoryItem = (index: number, field: string, value: string) => {
    if (!current) return;
    const items = [...(current.story_items || [])];
    items[index] = { ...items[index], [field]: value };
    updateField('story_items', items);
  };

  const addStoryItem = () => {
    if (!current) return;
    const items = [...(current.story_items || []), { icon: 'Sparkles', textAr: '', textEn: '' }];
    updateField('story_items', items);
  };

  const removeStoryItem = (index: number) => {
    if (!current) return;
    const items = [...(current.story_items || [])];
    items.splice(index, 1);
    updateField('story_items', items);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save settings
      if (current) {
        await supabase
          .from('achievement_settings')
          .update({
            is_visible: current.is_visible,
            hero_title_ar: current.hero_title_ar,
            hero_title_en: current.hero_title_en,
            hero_subtitle_ar: current.hero_subtitle_ar,
            hero_subtitle_en: current.hero_subtitle_en,
            highlights: current.highlights as any,
            story_items: current.story_items as any,
            key_targets: current.key_targets as any,
            footer_title_ar: current.footer_title_ar,
            footer_title_en: current.footer_title_en,
            footer_subtitle_ar: current.footer_subtitle_ar,
            footer_subtitle_en: current.footer_subtitle_en,
          })
          .eq('id', current.id);
      }

      // Save KPI actuals - upsert
      const upserts = Object.entries(kpiActuals)
        .filter(([_, val]) => val !== '')
        .map(([kpi_id, actual_value]) => ({
          kpi_id,
          year: activeYear,
          actual_value,
        }));

      if (upserts.length > 0) {
        await supabase
          .from('kpi_actuals')
          .upsert(upserts as any, { onConflict: 'kpi_id,year' });
      }

      // Save project statuses - update ALL projects for the year, not just changed ones
      for (const proj of yearProjects) {
        const newStatus = projectStatuses[proj.id];
        if (newStatus) {
          // Map display status back to DB-valid values
          const dbStatus = newStatus === 'launched' ? 'in_progress' : newStatus;
          const { error: statusError } = await supabase
            .from('projects')
            .update({ status: dbStatus })
            .eq('id', proj.id);
          if (statusError) {
            console.error('Failed to update project status:', proj.id, statusError);
            throw new Error(`Failed to update status for ${proj.name_ar}: ${statusError.message}`);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['achievement_settings'] });
      queryClient.invalidateQueries({ queryKey: ['kpi_actuals'] });
      queryClient.invalidateQueries({ queryKey: ['all_projects'] });
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
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveAll} disabled={saving} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
          <Save className="h-4 w-4" />
          {saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save Changes')}
        </Button>
      </div>

      {/* Year Tabs */}
      <Tabs value={String(activeYear)} onValueChange={(v) => setActiveYear(Number(v))}>
        <TabsList className="bg-muted/50">
          {YEARS.map(year => (
            <TabsTrigger key={year} value={String(year)} className="gap-2">
              <Trophy className="h-3.5 w-3.5" />
              {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {YEARS.map(year => (
          <TabsContent key={year} value={String(year)} className="mt-6 space-y-6">
            {current && current.year === year && (
              <>
                {/* Visibility Toggle */}
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {current.is_visible ? <Eye className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="font-semibold text-foreground">
                            {t(`إظهار صفحة منجزات ${year}`, `Show ${year} Achievements Page`)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('التحكم في ظهور الصفحة في القائمة الجانبية', 'Control page visibility in sidebar navigation')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={current.is_visible}
                        onCheckedChange={(v) => updateField('is_visible', v)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Hero Content */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Type className="h-5 w-5 text-primary" />
                      {t('محتوى البانر الرئيسي', 'Hero Banner Content')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('العنوان (عربي)', 'Title (AR)')}</label>
                        <Input value={current.hero_title_ar} onChange={e => updateField('hero_title_ar', e.target.value)} dir="rtl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('العنوان (إنجليزي)', 'Title (EN)')}</label>
                        <Input value={current.hero_title_en} onChange={e => updateField('hero_title_en', e.target.value)} dir="ltr" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('الوصف (عربي)', 'Subtitle (AR)')}</label>
                        <Textarea value={current.hero_subtitle_ar} onChange={e => updateField('hero_subtitle_ar', e.target.value)} dir="rtl" rows={2} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('الوصف (إنجليزي)', 'Subtitle (EN)')}</label>
                        <Textarea value={current.hero_subtitle_en} onChange={e => updateField('hero_subtitle_en', e.target.value)} dir="ltr" rows={2} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Highlights Cards */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t('بطاقات أبرز المنجزات', 'Key Highlights Cards')}
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addHighlight} className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        {t('إضافة', 'Add')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(current.highlights || []).map((h: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border bg-muted/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            {t(`بطاقة ${i + 1}`, `Card ${i + 1}`)}
                          </span>
                          <div className="flex gap-2">
                            <select
                              value={h.icon || 'Sparkles'}
                              onChange={e => updateHighlight(i, 'icon', e.target.value)}
                              className="text-xs border rounded px-2 py-1 bg-background"
                            >
                              {iconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeHighlight(i)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input placeholder={t('العنوان (عربي)', 'Title AR')} value={h.titleAr || ''} onChange={e => updateHighlight(i, 'titleAr', e.target.value)} dir="rtl" />
                          <Input placeholder={t('العنوان (إنجليزي)', 'Title EN')} value={h.titleEn || ''} onChange={e => updateHighlight(i, 'titleEn', e.target.value)} dir="ltr" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Textarea placeholder={t('الوصف (عربي)', 'Desc AR')} value={h.descAr || ''} onChange={e => updateHighlight(i, 'descAr', e.target.value)} dir="rtl" rows={2} />
                          <Textarea placeholder={t('الوصف (إنجليزي)', 'Desc EN')} value={h.descEn || ''} onChange={e => updateHighlight(i, 'descEn', e.target.value)} dir="ltr" rows={2} />
                        </div>
                      </div>
                    ))}
                    {(!current.highlights || current.highlights.length === 0) && (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {t('لا توجد بطاقات. أضف بطاقة جديدة.', 'No cards yet. Add a new card.')}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Project Status Management */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      {t(`إدارة حالات المشاريع ${activeYear}`, `Project Status Management ${activeYear}`)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'تحكم بحالة كل مشروع: مكتمل أو منطلق أو متأخر. المشاريع المتأخرة ستظهر باللون الأحمر.',
                        'Control each project status: completed, launched, or delayed. Delayed projects will appear in red.'
                      )}
                    </p>
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      <button
                        onClick={() => setProjectPillarFilter('all')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
                        style={{
                          backgroundColor: projectPillarFilter === 'all' ? 'hsl(var(--primary))' : 'transparent',
                          color: projectPillarFilter === 'all' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                          borderColor: projectPillarFilter === 'all' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                        }}
                      >
                        {t('الكل', 'All')}
                      </button>
                      {pillars?.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setProjectPillarFilter(p.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
                          style={{
                            backgroundColor: projectPillarFilter === p.id ? p.color : 'transparent',
                            color: projectPillarFilter === p.id ? 'white' : 'hsl(var(--muted-foreground))',
                            borderColor: projectPillarFilter === p.id ? p.color : 'hsl(var(--border))',
                          }}
                        >
                          {t(p.name_ar, p.name_en)}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {yearProjects.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {t('لا توجد مشاريع لهذا العام', 'No projects for this year')}
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {yearProjects.map((proj) => {
                          const status = projectStatuses[proj.id] || 'planned';
                          const isDelayed = status === 'delayed';
                          return (
                            <div
                              key={proj.id}
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                                isDelayed ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800' : 'border-border bg-background'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{t(proj.name_ar, proj.name_en)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {proj.start_date && `${proj.start_date} → ${proj.end_date || '...'}`}
                                </p>
                              </div>
                              <select
                                value={status}
                                onChange={e => setProjectStatuses(prev => ({ ...prev, [proj.id]: e.target.value }))}
                                className={`text-xs border rounded-lg px-3 py-2 bg-background font-medium ${
                                  status === 'completed' ? 'text-green-700 border-green-300' :
                                  status === 'launched' ? 'text-blue-700 border-blue-300' :
                                  status === 'delayed' ? 'text-red-700 border-red-300' :
                                  'text-muted-foreground'
                                }`}
                              >
                                <option value="planned">{t('مخطط', 'Planned')}</option>
                                <option value="launched">{t('منطلق', 'Launched')}</option>
                                <option value="completed">{t('مكتمل', 'Completed')}</option>
                                <option value="delayed">{t('متأخر', 'Delayed')}</option>
                              </select>
                              <div className="w-6">
                                {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {status === 'launched' && <Rocket className="h-4 w-4 text-blue-500" />}
                                {status === 'delayed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Key Targets Management */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        {t('المستهدفات الرئيسية', 'Key Targets')}
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => {
                        if (!current) return;
                        const items = [...(current.key_targets || []), {
                          pillar_id: pillars?.[0]?.id || '',
                          pillar_ar: pillars?.[0]?.name_ar || '',
                          pillar_en: pillars?.[0]?.name_en || '',
                          goal_ar: '', goal_en: '',
                          initiative_ar: '', initiative_en: '',
                          target_ar: '', target_en: '',
                          kpi_ar: '', kpi_en: '',
                          target_value: '', actual_value: ''
                        }];
                        updateField('key_targets', items);
                      }} className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        {t('إضافة مستهدف', 'Add Target')}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'المستهدفات الرئيسية لكل ركيزة التي تظهر في صفحة المنجزات.',
                        'Key targets per pillar displayed on the achievements page.'
                      )}
                    </p>
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      <button
                        onClick={() => setStoryPillarFilter('all')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
                        style={{
                          backgroundColor: storyPillarFilter === 'all' ? 'hsl(var(--primary))' : 'transparent',
                          color: storyPillarFilter === 'all' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                          borderColor: storyPillarFilter === 'all' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                        }}
                      >
                        {t('الكل', 'All')} ({(current?.key_targets || []).length})
                      </button>
                      {pillars?.map(p => {
                        const count = (current?.key_targets || []).filter((item: any) => item.pillar_id === p.id).length;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setStoryPillarFilter(p.id)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border"
                            style={{
                              backgroundColor: storyPillarFilter === p.id ? p.color : 'transparent',
                              color: storyPillarFilter === p.id ? 'white' : 'hsl(var(--muted-foreground))',
                              borderColor: storyPillarFilter === p.id ? p.color : 'hsl(var(--border))',
                            }}
                          >
                            {t(p.name_ar, p.name_en)} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {(current?.key_targets || []).map((item: any, i: number) => {
                      if (storyPillarFilter !== 'all' && item.pillar_id !== storyPillarFilter) return null;
                      const itemPillar = pillars?.find(p => p.id === item.pillar_id);
                      return (
                        <div key={i} className="p-4 rounded-xl border bg-muted/20 space-y-3" style={{ borderInlineStartWidth: '3px', borderInlineStartColor: itemPillar?.color || 'hsl(var(--border))' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {t(`مستهدف ${i + 1}`, `Target ${i + 1}`)}
                            </span>
                            <div className="flex gap-2 items-center">
                              <select
                                value={item.pillar_id || ''}
                                onChange={e => {
                                  const p = pillars?.find(pl => pl.id === e.target.value);
                                  const items = [...(current?.key_targets || [])];
                                  items[i] = { ...items[i], pillar_id: e.target.value, pillar_ar: p?.name_ar || '', pillar_en: p?.name_en || '' };
                                  updateField('key_targets', items);
                                }}
                                className="text-xs border rounded px-2 py-1 bg-background"
                              >
                                {pillars?.map(p => (
                                  <option key={p.id} value={p.id}>{t(p.name_ar, p.name_en)}</option>
                                ))}
                              </select>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => {
                                const items = [...(current?.key_targets || [])];
                                items.splice(i, 1);
                                updateField('key_targets', items);
                              }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('الهدف الاستراتيجي (عربي)', 'Strategic Goal AR')} value={item.goal_ar || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], goal_ar: e.target.value }; updateField('key_targets', items);
                            }} dir="rtl" />
                            <Input placeholder={t('الهدف الاستراتيجي (إنجليزي)', 'Strategic Goal EN')} value={item.goal_en || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], goal_en: e.target.value }; updateField('key_targets', items);
                            }} dir="ltr" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('المبادرة (عربي)', 'Initiative AR')} value={item.initiative_ar || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], initiative_ar: e.target.value }; updateField('key_targets', items);
                            }} dir="rtl" />
                            <Input placeholder={t('المبادرة (إنجليزي)', 'Initiative EN')} value={item.initiative_en || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], initiative_en: e.target.value }; updateField('key_targets', items);
                            }} dir="ltr" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('المستهدف (عربي)', 'Target AR')} value={item.target_ar || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], target_ar: e.target.value }; updateField('key_targets', items);
                            }} dir="rtl" />
                            <Input placeholder={t('المستهدف (إنجليزي)', 'Target EN')} value={item.target_en || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], target_en: e.target.value }; updateField('key_targets', items);
                            }} dir="ltr" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('مؤشر الأداء (عربي)', 'KPI AR')} value={item.kpi_ar || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], kpi_ar: e.target.value }; updateField('key_targets', items);
                            }} dir="rtl" />
                            <Input placeholder={t('مؤشر الأداء (إنجليزي)', 'KPI EN')} value={item.kpi_en || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], kpi_en: e.target.value }; updateField('key_targets', items);
                            }} dir="ltr" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('القيمة المستهدفة (مثال: 25)', 'Target Value (e.g. 25)')} value={item.target_value || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], target_value: e.target.value }; updateField('key_targets', items);
                            }} className="border-blue-200 dark:border-blue-800" />
                            <Input placeholder={t('القيمة المتحققة (مثال: 20)', 'Actual Value (e.g. 20)')} value={item.actual_value || ''} onChange={e => {
                              const items = [...(current?.key_targets || [])]; items[i] = { ...items[i], actual_value: e.target.value }; updateField('key_targets', items);
                            }} className="border-green-200 dark:border-green-800" />
                          </div>
                        </div>
                      );
                    })}
                    {(!current?.key_targets || current.key_targets.length === 0) && (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {t('لا توجد مستهدفات. أضف مستهدف جديد.', 'No key targets yet. Add a new target.')}
                      </p>
                    )}
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Type className="h-5 w-5 text-primary" />
                      {t('محتوى التذييل', 'Footer Content')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('العنوان (عربي)', 'Title (AR)')}</label>
                        <Input value={current.footer_title_ar} onChange={e => updateField('footer_title_ar', e.target.value)} dir="rtl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('العنوان (إنجليزي)', 'Title (EN)')}</label>
                        <Input value={current.footer_title_en} onChange={e => updateField('footer_title_en', e.target.value)} dir="ltr" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('الوصف (عربي)', 'Subtitle (AR)')}</label>
                        <Textarea value={current.footer_subtitle_ar} onChange={e => updateField('footer_subtitle_ar', e.target.value)} dir="rtl" rows={2} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">{t('الوصف (إنجليزي)', 'Subtitle (EN)')}</label>
                        <Textarea value={current.footer_subtitle_en} onChange={e => updateField('footer_subtitle_en', e.target.value)} dir="ltr" rows={2} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KPI Actuals */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      {t(`القيم المحققة لمؤشرات الأداء ${year}`, `KPI Actual Values ${year}`)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'أدخل القيمة المحققة لكل مؤشر. إذا كانت أقل من المستهدف سيظهر باللون الأحمر تلقائياً.',
                        'Enter the actual value for each KPI. If below target, it will display in red automatically.'
                      )}
                    </p>
                    {/* Pillar Filter for KPIs */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <Button
                        size="sm"
                        variant={kpiPillarFilter === 'all' ? 'default' : 'outline'}
                        className="h-7 text-xs"
                        onClick={() => setKpiPillarFilter('all')}
                      >
                        {t('الكل', 'All')}
                      </Button>
                      {pillars?.map((p: any) => {
                        const count = allKpis?.filter((k: any) => {
                          const val = (k as any)[targetField];
                          return val && val !== '' && val !== '0' && val !== '-' && (k as any).initiatives?.pillar_id === p.id;
                        }).length || 0;
                        if (count === 0) return null;
                        return (
                          <Button
                            key={p.id}
                            size="sm"
                            variant={kpiPillarFilter === p.id ? 'default' : 'outline'}
                            className="h-7 text-xs"
                            style={kpiPillarFilter === p.id ? { backgroundColor: p.color, borderColor: p.color } : { borderColor: p.color, color: p.color }}
                            onClick={() => setKpiPillarFilter(p.id)}
                          >
                            {t(p.name_ar, p.name_en)} ({count})
                          </Button>
                        );
                      })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {yearKpis.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {t('لا توجد مؤشرات أداء لهذا العام', 'No KPIs for this year')}
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {yearKpis.map((kpi: any) => {
                          const target = (kpi as any)[targetField];
                          const actual = kpiActuals[kpi.id] || '';
                          const numTarget = parseFloat(target);
                          const numActual = parseFloat(actual);
                          const isBelowTarget = actual !== '' && !isNaN(numActual) && !isNaN(numTarget) && numActual < numTarget;

                          return (
                            <div
                              key={kpi.id}
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                                isBelowTarget ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800' : 'border-border bg-background'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{t(kpi.name_ar, kpi.name_en)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t('المستهدف', 'Target')}: <span className="font-semibold">{target}</span>
                                  {kpi.unit && ` (${kpi.unit})`}
                                </p>
                              </div>
                              <div className="w-32">
                                <Input
                                  value={actual}
                                  onChange={e => setKpiActuals(prev => ({ ...prev, [kpi.id]: e.target.value }))}
                                  placeholder={t('المحقق', 'Actual')}
                                  className={`text-center ${isBelowTarget ? 'border-red-400 text-red-600' : ''}`}
                                  dir="ltr"
                                />
                              </div>
                              <div className="w-6">
                                {actual !== '' && (
                                  isBelowTarget ? (
                                    <ArrowDown className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <ArrowUp className="h-4 w-4 text-green-500" />
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
