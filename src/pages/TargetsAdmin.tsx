import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTargetSettings, TargetSetting } from '@/hooks/useTargetSettings';
import { usePillars } from '@/hooks/useStrategyData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Target, Save, Eye, EyeOff, Sparkles, Type,
  Plus, Trash2, Zap,
  GraduationCap, Rocket, Globe2, Lightbulb, Users, CheckCircle2
} from 'lucide-react';

const YEARS = [2025, 2026, 2027, 2028, 2029];

const iconOptions = [
  { value: 'GraduationCap', label: 'GraduationCap' },
  { value: 'Target', label: 'Target' },
  { value: 'Rocket', label: 'Rocket' },
  { value: 'Globe2', label: 'Globe2' },
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Users', label: 'Users' },
  { value: 'Flag', label: 'Flag' },
  { value: 'CheckCircle2', label: 'CheckCircle2' },
  { value: 'Sparkles', label: 'Sparkles' },
];

export default function TargetsAdmin({ embedded = false }: { embedded?: boolean }) {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useTargetSettings();
  const { data: pillars } = usePillars();
  const [activeYear, setActiveYear] = useState(2025);
  const [localSettings, setLocalSettings] = useState<TargetSetting[]>([]);
  const [storyPillarFilter, setStoryPillarFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setLocalSettings([...settings]);
  }, [settings]);

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
    updateField('highlights', [...(current.highlights || []), { icon: 'Target', titleAr: '', titleEn: '', descAr: '', descEn: '' }]);
  };

  const removeHighlight = (index: number) => {
    if (!current) return;
    const h = [...(current.highlights || [])];
    h.splice(index, 1);
    updateField('highlights', h);
  };

  const updateStoryItem = (index: number, field: string, value: string) => {
    if (!current) return;
    const items = [...(current.story_items || [])];
    items[index] = { ...items[index], [field]: value };
    updateField('story_items', items);
  };

  const addStoryItem = () => {
    if (!current) return;
    updateField('story_items', [...(current.story_items || []), { icon: 'Target', textAr: '', textEn: '' }]);
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
      if (current) {
        await supabase
          .from('target_settings' as any)
          .update({
            is_visible: current.is_visible,
            hero_title_ar: current.hero_title_ar,
            hero_title_en: current.hero_title_en,
            hero_subtitle_ar: current.hero_subtitle_ar,
            hero_subtitle_en: current.hero_subtitle_en,
            highlights: current.highlights as any,
            story_items: current.story_items as any,
            footer_title_ar: current.footer_title_ar,
            footer_title_en: current.footer_title_en,
            footer_subtitle_ar: current.footer_subtitle_ar,
            footer_subtitle_en: current.footer_subtitle_en,
          } as any)
          .eq('id', current.id);
      }

      queryClient.invalidateQueries({ queryKey: ['target_settings'] });
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
      <div className="flex justify-end">
        <Button onClick={saveAll} disabled={saving} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
          <Save className="h-4 w-4" />
          {saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save Changes')}
        </Button>
      </div>

      <Tabs value={String(activeYear)} onValueChange={(v) => setActiveYear(Number(v))}>
        <TabsList className="bg-muted/50">
          {YEARS.map(year => (
            <TabsTrigger key={year} value={String(year)} className="gap-2">
              <Target className="h-3.5 w-3.5" />
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
                            {t(`إظهار صفحة مستهدفات ${year}`, `Show ${year} Targets Page`)}
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
                        {t('بطاقات أبرز المستهدفات', 'Key Targets Cards')}
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
                          <span className="text-sm font-semibold text-foreground">{t(`بطاقة ${i + 1}`, `Card ${i + 1}`)}</span>
                          <div className="flex gap-2">
                            <select
                              value={h.icon || 'Target'}
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

                {/* Story Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t('عناصر السرد القصصي للمستهدفات', 'Target Story Highlights')}
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addStoryItem} className="gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        {t('إضافة', 'Add')}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        'عناصر إضافية تظهر في قسم السرد القصصي بجانب العناصر التلقائية من المشاريع والمؤشرات',
                        'Additional items shown in the story section alongside auto-generated items from projects and KPIs'
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
                        {t('الكل', 'All')} ({(current.story_items || []).length})
                      </button>
                      {pillars?.map(p => {
                        const count = (current.story_items || []).filter((item: any) => item.pillarId === p.id).length;
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
                  <CardContent className="space-y-4">
                    {(current.story_items || []).map((item: any, i: number) => {
                      if (storyPillarFilter !== 'all') {
                        if (storyPillarFilter === 'none' && item.pillarId) return null;
                        if (storyPillarFilter !== 'none' && item.pillarId !== storyPillarFilter) return null;
                      }
                      const itemPillar = pillars?.find(p => p.id === item.pillarId);
                      return (
                        <div key={i} className="p-4 rounded-xl border bg-muted/20 space-y-3" style={{ borderInlineStartWidth: '3px', borderInlineStartColor: itemPillar?.color || 'hsl(var(--border))' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">{t(`عنصر ${i + 1}`, `Item ${i + 1}`)}</span>
                            <div className="flex gap-2 items-center">
                              <select
                                value={item.pillarId || ''}
                                onChange={e => updateStoryItem(i, 'pillarId', e.target.value || '')}
                                className="text-xs border rounded px-2 py-1 bg-background"
                              >
                                <option value="">{t('بدون مرتكز', 'No pillar')}</option>
                                {pillars?.map(p => (
                                  <option key={p.id} value={p.id}>{t(p.name_ar, p.name_en)}</option>
                                ))}
                              </select>
                              <select
                                value={item.icon || 'Target'}
                                onChange={e => updateStoryItem(i, 'icon', e.target.value)}
                                className="text-xs border rounded px-2 py-1 bg-background"
                              >
                                {iconOptions.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeStoryItem(i)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder={t('النص (عربي)', 'Text AR')} value={item.textAr || ''} onChange={e => updateStoryItem(i, 'textAr', e.target.value)} dir="rtl" />
                            <Input placeholder={t('النص (إنجليزي)', 'Text EN')} value={item.textEn || ''} onChange={e => updateStoryItem(i, 'textEn', e.target.value)} dir="ltr" />
                          </div>
                        </div>
                      );
                    })}
                    {(!current.story_items || current.story_items.length === 0) && (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {t('لا توجد عناصر. المشاريع والمؤشرات ستظهر تلقائياً.', 'No items. Projects and KPIs will appear automatically.')}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Footer Content */}
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
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
