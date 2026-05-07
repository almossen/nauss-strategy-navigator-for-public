import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageSections, PageSection } from '@/hooks/usePageSections';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function PagesAdmin() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = usePageSections('global');
  const [local, setLocal] = useState<PageSection[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sections) setLocal([...sections]);
  }, [sections]);

  const toggle = (key: string) => {
    setLocal(prev => prev.map(s => s.section_key === key ? { ...s, is_visible: !s.is_visible } : s));
  };

  const save = async () => {
    setSaving(true);
    try {
      for (const s of local) {
        await supabase.from('page_sections').update({ is_visible: s.is_visible }).eq('id', s.id);
      }
      queryClient.invalidateQueries({ queryKey: ['page_sections', 'global'] });
      toast.success(t('تم الحفظ بنجاح', 'Saved successfully'));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
          <Save className="h-4 w-4" />
          {saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save Changes')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('إدارة ظهور الصفحات', 'Pages Visibility')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {local.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
              <div className="flex items-center gap-3">
                {s.is_visible ? <Eye className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="font-semibold text-foreground">{t(s.title_ar, s.title_en)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('التحكم في ظهور الصفحة في القائمة الجانبية', 'Control page visibility in sidebar navigation')}
                  </p>
                </div>
              </div>
              <Switch checked={s.is_visible} onCheckedChange={() => toggle(s.section_key)} />
            </div>
          ))}
          {local.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t('لا توجد صفحات للإدارة', 'No pages to manage')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}