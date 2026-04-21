import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useStrategicGoals, useInitiatives, useProjects, useKPIs } from '@/hooks/useStrategyData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Upload, Download, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

type TabKey = 'pillars' | 'goals' | 'initiatives' | 'projects' | 'kpis';

export default function AdminPage({ embedded = false }: { embedded?: boolean }) {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>('pillars');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: pillars } = usePillars();
  const { data: goals } = useStrategicGoals('all');
  const { data: initiatives } = useInitiatives();
  const { data: projects } = useProjects();
  const { data: kpis } = useKPIs();

  // Override the enabled check for goals - fetch all
  const { data: allGoals } = useAllGoals();
  const { data: allKpis } = useAllKpis();

  const tabConfig: Record<TabKey, { label_ar: string; label_en: string; data: any[]; columns: { key: string; label_ar: string; label_en: string; type?: string; options?: any[] }[] }> = {
    pillars: {
      label_ar: 'الركائز', label_en: 'Pillars',
      data: pillars || [],
      columns: [
        { key: 'name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)' },
        { key: 'name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)' },
        { key: 'type', label_ar: 'النوع', label_en: 'Type', type: 'select', options: [{ value: 'pillar', label: 'Pillar' }, { value: 'enabler', label: 'Enabler' }] },
        { key: 'color', label_ar: 'اللون', label_en: 'Color', type: 'color' },
        { key: 'icon', label_ar: 'الأيقونة', label_en: 'Icon' },
        { key: 'description_ar', label_ar: 'الوصف (عربي)', label_en: 'Description (AR)', type: 'textarea' },
        { key: 'description_en', label_ar: 'الوصف (إنجليزي)', label_en: 'Description (EN)', type: 'textarea' },
        { key: 'general_goal_ar', label_ar: 'الهدف العام (عربي)', label_en: 'General Goal (AR)', type: 'textarea' },
        { key: 'general_goal_en', label_ar: 'الهدف العام (إنجليزي)', label_en: 'General Goal (EN)', type: 'textarea' },
        { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Sort Order', type: 'number' },
      ],
    },
    goals: {
      label_ar: 'الأهداف الاستراتيجية', label_en: 'Strategic Goals',
      data: allGoals || [],
      columns: [
        { key: 'name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)' },
        { key: 'name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)' },
        { key: 'pillar_id', label_ar: 'الركيزة', label_en: 'Pillar', type: 'ref', options: pillars?.map(p => ({ value: p.id, label: t(p.name_ar, p.name_en) })) || [] },
        { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Sort Order', type: 'number' },
      ],
    },
    initiatives: {
      label_ar: 'المبادرات', label_en: 'Initiatives',
      data: initiatives || [],
      columns: [
        { key: 'name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)' },
        { key: 'name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)' },
        { key: 'pillar_id', label_ar: 'الركيزة', label_en: 'Pillar', type: 'ref', options: pillars?.map(p => ({ value: p.id, label: t(p.name_ar, p.name_en) })) || [] },
        { key: 'goal_id', label_ar: 'الهدف', label_en: 'Goal', type: 'ref', options: allGoals?.map(g => ({ value: g.id, label: t(g.name_ar, g.name_en) })) || [] },
        { key: 'description_ar', label_ar: 'الوصف (عربي)', label_en: 'Description (AR)', type: 'textarea' },
        { key: 'description_en', label_ar: 'الوصف (إنجليزي)', label_en: 'Description (EN)', type: 'textarea' },
        { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Sort Order', type: 'number' },
      ],
    },
    projects: {
      label_ar: 'المشاريع', label_en: 'Projects',
      data: projects || [],
      columns: [
        { key: 'name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)' },
        { key: 'name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)' },
        { key: 'description_ar', label_ar: 'الوصف (عربي)', label_en: 'Description (AR)', type: 'textarea' },
        { key: 'description_en', label_ar: 'الوصف (إنجليزي)', label_en: 'Description (EN)', type: 'textarea' },
        { key: 'initiative_id', label_ar: 'المبادرة', label_en: 'Initiative', type: 'ref', options: initiatives?.map(i => ({ value: i.id, label: t(i.name_ar, i.name_en) })) || [] },
        { key: 'status', label_ar: 'الحالة', label_en: 'Status', type: 'select', options: [{ value: 'planned', label: t('مخطط', 'Planned') }, { value: 'in_progress', label: t('قيد التنفيذ', 'In Progress') }, { value: 'completed', label: t('مكتمل', 'Completed') }, { value: 'delayed', label: t('متأخر', 'Delayed') }] },
        { key: 'owner_ar', label_ar: 'المسؤول (عربي)', label_en: 'Owner (AR)' },
        { key: 'owner_en', label_ar: 'المسؤول (إنجليزي)', label_en: 'Owner (EN)' },
        { key: 'start_date', label_ar: 'تاريخ البدء', label_en: 'Start Date', type: 'date' },
        { key: 'end_date', label_ar: 'تاريخ الانتهاء', label_en: 'End Date', type: 'date' },
        { key: 'outputs_ar', label_ar: 'المخرجات (عربي)', label_en: 'Outputs (AR)', type: 'textarea' },
        { key: 'outputs_en', label_ar: 'المخرجات (إنجليزي)', label_en: 'Outputs (EN)', type: 'textarea' },
        { key: 'weight', label_ar: 'الوزن', label_en: 'Weight', type: 'number' },
        { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Sort Order', type: 'number' },
      ],
    },
    kpis: {
      label_ar: 'مؤشرات الأداء', label_en: 'KPIs',
      data: allKpis || [],
      columns: [
        { key: 'name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)' },
        { key: 'name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)' },
        { key: 'initiative_id', label_ar: 'المبادرة', label_en: 'Initiative', type: 'ref', options: initiatives?.map(i => ({ value: i.id, label: t(i.name_ar, i.name_en) })) || [] },
        { key: 'unit', label_ar: 'الوحدة', label_en: 'Unit' },
        { key: 'baseline', label_ar: 'خط الأساس', label_en: 'Baseline' },
        { key: 'target_2025', label_ar: '2025', label_en: '2025' },
        { key: 'target_2026', label_ar: '2026', label_en: '2026' },
        { key: 'target_2027', label_ar: '2027', label_en: '2027' },
        { key: 'target_2028', label_ar: '2028', label_en: '2028' },
        { key: 'target_2029', label_ar: '2029', label_en: '2029' },
        { key: 'final_target', label_ar: 'المستهدف النهائي', label_en: 'Final Target' },
        { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Sort Order', type: 'number' },
      ],
    },
  };

  const currentConfig = tabConfig[activeTab];
  // Only show a subset of columns in the table view
  const tableColumns = currentConfig.columns.filter(c => !['textarea'].includes(c.type || '') || ['name_ar', 'name_en'].includes(c.key));
  const displayColumns = currentConfig.columns.slice(0, 5);

  const openAdd = () => {
    setEditingItem(null);
    const defaults: Record<string, any> = {};
    currentConfig.columns.forEach(c => {
      if (c.type === 'number') defaults[c.key] = 0;
      else defaults[c.key] = '';
    });
    setFormData(defaults);
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    const data: Record<string, any> = {};
    currentConfig.columns.forEach(c => {
      data[c.key] = item[c.key] ?? '';
    });
    setFormData(data);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const tableName = activeTab === 'goals' ? 'strategic_goals' : activeTab;
      if (editingItem) {
        const { error } = await supabase.from(tableName as any).update(formData).eq('id', editingItem.id);
        if (error) throw error;
        toast.success(t('تم التحديث بنجاح', 'Updated successfully'));
      } else {
        const { error } = await supabase.from(tableName as any).insert(formData);
        if (error) throw error;
        toast.success(t('تمت الإضافة بنجاح', 'Added successfully'));
      }
      queryClient.invalidateQueries();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const tableName = activeTab === 'goals' ? 'strategic_goals' : activeTab;
      const { error } = await supabase.from(tableName as any).delete().eq('id', id);
      if (error) throw error;
      toast.success(t('تم الحذف بنجاح', 'Deleted successfully'));
      queryClient.invalidateQueries();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getRefLabel = (col: any, value: string) => {
    const opt = col.options?.find((o: any) => o.value === value);
    return opt?.label || value?.substring(0, 8) || '—';
  };

  // Excel Import
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const tableMap: Record<string, string> = {
        'pillars': 'pillars', 'الركائز': 'pillars',
        'goals': 'strategic_goals', 'الأهداف': 'strategic_goals', 'strategic_goals': 'strategic_goals',
        'initiatives': 'initiatives', 'المبادرات': 'initiatives',
        'projects': 'projects', 'المشاريع': 'projects',
        'kpis': 'kpis', 'مؤشرات': 'kpis', 'المؤشرات': 'kpis',
      };

      let importedCount = 0;

      for (const sheetName of workbook.SheetNames) {
        const tableName = tableMap[sheetName.toLowerCase().trim()] || tableMap[Object.keys(tableMap).find(k => sheetName.toLowerCase().includes(k)) || ''];
        if (!tableName) {
          console.warn(`Skipping sheet "${sheetName}" - no matching table`);
          continue;
        }

        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);
        if (rows.length === 0) continue;

        // Map column names
        const mappedRows = rows.map(row => {
          const mapped: Record<string, any> = {};
          for (const [key, value] of Object.entries(row)) {
            const normalizedKey = normalizeColumnName(key);
            if (normalizedKey) {
              mapped[normalizedKey] = value;
            }
          }
          // Remove id to let DB generate it
          delete mapped.id;
          delete mapped.created_at;
          delete mapped.updated_at;
          return mapped;
        }).filter(row => Object.keys(row).length > 0);

        if (mappedRows.length > 0) {
          const { error } = await supabase.from(tableName as any).insert(mappedRows as any);
          if (error) {
            toast.error(`${t('خطأ في', 'Error in')} ${sheetName}: ${error.message}`);
          } else {
            importedCount += mappedRows.length;
          }
        }
      }

      if (importedCount > 0) {
        toast.success(t(`تم استيراد ${importedCount} سجل بنجاح`, `Successfully imported ${importedCount} records`));
        queryClient.invalidateQueries();
      } else {
        toast.warning(t('لم يتم العثور على بيانات صالحة', 'No valid data found'));
      }
    } catch (err: any) {
      toast.error(t('خطأ في قراءة الملف', 'Error reading file') + ': ' + err.message);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Excel Export
  const handleExcelExport = () => {
    const workbook = XLSX.utils.book_new();
    const data = currentConfig.data;
    if (data.length === 0) {
      toast.warning(t('لا توجد بيانات للتصدير', 'No data to export'));
      return;
    }
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, activeTab);
    XLSX.writeFile(workbook, `${activeTab}_export.xlsx`);
  };

  // Excel Template
  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const tabs: TabKey[] = ['pillars', 'goals', 'initiatives', 'projects', 'kpis'];
    
    for (const tab of tabs) {
      const config = tabConfig[tab];
      const headers = config.columns.map(c => c.key);
      const sheet = XLSX.utils.aoa_to_sheet([headers]);
      const sheetName = tab === 'goals' ? 'strategic_goals' : tab;
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }
    XLSX.writeFile(workbook, 'nauss_data_template.xlsx');
    toast.success(t('تم تحميل القالب', 'Template downloaded'));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header - only show when standalone */}
      {!embedded && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}>
                <Database className="h-5 w-5 text-white" />
              </div>
              {t('إدارة البيانات', 'Data Management')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('إضافة وتعديل وحذف جميع بيانات الخطة الاستراتيجية', 'Add, edit, and delete all strategic plan data')}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
              <Download className="h-4 w-4" />
              {t('تحميل قالب Excel', 'Download Template')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" />
              {t('استيراد Excel', 'Import Excel')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExcelExport} className="gap-2">
              <Download className="h-4 w-4" />
              {t('تصدير', 'Export')}
            </Button>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelImport} />
          </div>
        </div>
      )}
      {embedded && (
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            {t('تحميل قالب Excel', 'Download Template')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            {t('استيراد Excel', 'Import Excel')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExcelExport} className="gap-2">
            <Download className="h-4 w-4" />
            {t('تصدير', 'Export')}
          </Button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelImport} />
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList className="w-full justify-start overflow-x-auto bg-muted/50">
          {(Object.keys(tabConfig) as TabKey[]).map(key => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              {t(tabConfig[key].label_ar, tabConfig[key].label_en)}
              <span className="ms-1.5 text-xs text-muted-foreground">({tabConfig[key].data.length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(tabConfig) as TabKey[]).map(key => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="card-premium">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="font-semibold text-foreground">{t(tabConfig[key].label_ar, tabConfig[key].label_en)}</h2>
                <Button size="sm" onClick={openAdd} className="gap-2" style={{ background: 'hsl(var(--nauss-primary))' }}>
                  <Plus className="h-4 w-4" />
                  {t('إضافة', 'Add')}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {displayColumns.map(col => (
                        <TableHead key={col.key}>{t(col.label_ar, col.label_en)}</TableHead>
                      ))}
                      <TableHead className="w-24">{t('إجراءات', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabConfig[key].data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={displayColumns.length + 2} className="text-center text-muted-foreground py-8">
                          {t('لا توجد بيانات', 'No data')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      tabConfig[key].data.map((item, idx) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                          {displayColumns.map(col => (
                            <TableCell key={col.key} className="text-sm max-w-[200px] truncate">
                              {col.type === 'ref' || col.type === 'select'
                                ? (col.type === 'ref' ? getRefLabel(col, item[col.key]) : item[col.key])
                                : col.type === 'color'
                                  ? <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{ backgroundColor: item[col.key] }} />{item[col.key]}</div>
                                  : (item[col.key] ?? '—')}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(item)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('تعديل', 'Edit') : t('إضافة', 'Add')} {t(currentConfig.label_ar, currentConfig.label_en)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {currentConfig.columns.map(col => (
              <div key={col.key} className={col.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t(col.label_ar, col.label_en)}
                </label>
                {col.type === 'textarea' ? (
                  <Textarea
                    value={formData[col.key] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [col.key]: e.target.value }))}
                    rows={3}
                  />
                ) : col.type === 'select' || col.type === 'ref' ? (
                  <Select value={formData[col.key] || ''} onValueChange={v => setFormData(prev => ({ ...prev, [col.key]: v }))}>
                    <SelectTrigger><SelectValue placeholder={t('اختر', 'Select')} /></SelectTrigger>
                    <SelectContent>
                      {col.options?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : col.type === 'color' ? 'color' : 'text'}
                    value={formData[col.key] ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('إلغاء', 'Cancel')}</Button>
            <Button onClick={handleSave} style={{ background: 'hsl(var(--nauss-primary))' }}>
              {editingItem ? t('حفظ التعديلات', 'Save Changes') : t('إضافة', 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper hooks for fetching all goals and kpis without filter
function useAllGoals() {
  return useQueryAll('all_goals', 'strategic_goals');
}
function useAllKpis() {
  return useQueryAll('all_kpis', 'kpis');
}
function useQueryAll(queryKey: string, table: 'strategic_goals' | 'kpis') {
  return __useQuery(queryKey, table);
}

import { useQuery } from '@tanstack/react-query';
function __useQuery(queryKey: string, table: 'strategic_goals' | 'kpis') {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

function normalizeColumnName(key: string): string | null {
  const map: Record<string, string> = {
    'name_ar': 'name_ar', 'الاسم_عربي': 'name_ar', 'اسم_عربي': 'name_ar',
    'name_en': 'name_en', 'الاسم_انجليزي': 'name_en', 'اسم_انجليزي': 'name_en',
    'description_ar': 'description_ar', 'الوصف_عربي': 'description_ar',
    'description_en': 'description_en', 'الوصف_انجليزي': 'description_en',
    'pillar_id': 'pillar_id', 'goal_id': 'goal_id', 'initiative_id': 'initiative_id',
    'type': 'type', 'color': 'color', 'icon': 'icon',
    'sort_order': 'sort_order', 'الترتيب': 'sort_order',
    'status': 'status', 'الحالة': 'status',
    'start_date': 'start_date', 'تاريخ_البدء': 'start_date',
    'end_date': 'end_date', 'تاريخ_الانتهاء': 'end_date',
    'owner_ar': 'owner_ar', 'المسؤول_عربي': 'owner_ar',
    'owner_en': 'owner_en', 'المسؤول_انجليزي': 'owner_en',
    'outputs_ar': 'outputs_ar', 'المخرجات_عربي': 'outputs_ar',
    'outputs_en': 'outputs_en', 'المخرجات_انجليزي': 'outputs_en',
    'unit': 'unit', 'الوحدة': 'unit',
    'baseline': 'baseline', 'خط_الأساس': 'baseline',
    'target_2025': 'target_2025', 'target_2026': 'target_2026',
    'target_2027': 'target_2027', 'target_2028': 'target_2028',
    'target_2029': 'target_2029',
    'final_target': 'final_target', 'المستهدف_النهائي': 'final_target',
    'general_goal_ar': 'general_goal_ar', 'general_goal_en': 'general_goal_en',
  };
  const normalized = key.trim().toLowerCase().replace(/\s+/g, '_');
  return map[normalized] || (Object.values(map).includes(normalized) ? normalized : null);
}
