import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, CheckCircle2, Clock, Calendar, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

type EnablerProject = {
  name: string;
  enabler: string;
  subgroup?: string;
  start: string;
  end: string;
  status: string;
};

const PROJECTS: EnablerProject[] = [
  { name: 'تقييم البنية التحتية التقنية', enabler: 'التحوّل الرقمي والعمليات القائمة على البيانات', start: '11/10/25', end: '12/28/25', status: 'مكتمل' },
  { name: 'تقييم الأنظمة والتطبيقات القائمة', enabler: 'التحوّل الرقمي والعمليات القائمة على البيانات', start: '9/2/25', end: '10/10/25', status: 'مكتمل' },
  { name: 'الحوكمة في التحول الرقمي', enabler: 'التحوّل الرقمي والعمليات القائمة على البيانات', start: '6/29/25', end: '3/8/26', status: 'مكتمل' },
  
  { name: 'مشروع مراجعة وتطوير لائحة الموارد البشرية', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '7/30/26', status: 'مكتمل' },
  { name: 'مشروع إدارة الأداء الوظيفي', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '12/31/26', status: 'مكتمل' },
  { name: 'مشروع تطوير وتأهيل الموارد البشرية', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '12/31/27', status: 'جاري التنفيذ' },
  { name: 'مشروع إدارة المواهب', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '12/31/27', status: 'جاري التنفيذ' },
  { name: 'مشروع التفاعل المؤسسي', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '12/31/26', status: 'مكتمل' },
  { name: 'مشروع جائزة موظف السنة', enabler: 'التطوير الإداري وموائمة الهيكل التنظيمي مع الاحتياجات الإستراتيجية', start: '7/1/25', end: '12/31/25', status: 'مكتمل' },
  { name: 'التحول لأساس الاستحقاق (المرحلة الأولى: التعاقد مع الاستشاري والحصول الجرد والارصدة الافتتاحية وتقييم الاصول ومقترح اللوائح اللازم)', enabler: 'الاستدامة المالية', subgroup: 'تطوير الأنظمة المالية', start: '1/1/25', end: '12/31/25', status: 'مكتمل' },
  { name: 'كفاءة الانفاق (المرحلة الاولى اعداد تقارير والتوصيات الاستشارية)', enabler: 'الاستدامة المالية', subgroup: 'تطوير الأنظمة المالية', start: '1/1/24', end: '8/31/25', status: 'مكتمل' },
  { name: 'مشروع توريد وتركيب وتشغيل مفاتيح الضغط المتوسط 17,5 كيلو فولت', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '9/11/25', end: '4/11/26', status: 'جاري التنفيذ' },
  { name: 'مشروع ترميم وتطوير بلوك أ بفندق الجامعة', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '8/25/25', end: '5/8/26', status: 'جاري التنفيذ' },
  { name: 'مشروع توريد وتركيب المدرجات للملعب وتجهيزات رياضية لملاعب الجامعة والنادي الرياضي', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '7/13/25', end: '12/31/26', status: 'جاري التنفيذ' },
  
  { name: 'مشروع الأنسنة وتحسين المشهد الحضري للمقرات الحكومية (المرحلة الأولى)', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '1/1/25', end: '12/31/25', status: 'مكتمل' },
  { name: 'المرحلة الأولى/إعداد مخططات أنسنة الموقع واستضافة المناسبات المهمة محليا وعالميا', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '1/1/25', end: '3/27/25', status: 'مكتمل' },
  { name: 'مشروع إنشاء صالة الإستقبال الرئيسية لكبار الشخصيات للمسرح الرئيسي بمبنى العلاقات الخارجية بملحقاتها وتطوير الحرم الجامعى', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '6/24/25', end: '10/30/25', status: 'مكتمل' },
  { name: 'مشروع تأهيل وترميم مبنى مركز الذكاء الإصطناعى الأمني بالجامعة', enabler: 'الاستدامة المالية', subgroup: 'تنفيذ المشاريع الرأسمالية والبنية التحتية', start: '11/4/24', end: '12/30/25', status: 'مكتمل' },
  { name: 'تعزيز الحوكمة في الجامعة - المرحلة الأولى (مرحلة تقييم الوضع الراهن)', enabler: 'تعزيز الحوكمة', start: '1/1/25', end: '12/31/25', status: 'مكتمل' },
];

const STATUS_STYLES: Record<string, string> = {
  'مكتمل': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'جاري التنفيذ': 'bg-amber-50 text-amber-700 border-amber-200',
  'معلق': 'bg-rose-50 text-rose-700 border-rose-200',
  '': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function Enablers() {
  const { t, isRTL } = useLanguage();

  const groups = useMemo(() => {
    const map = new Map<string, EnablerProject[]>();
    PROJECTS.forEach((p) => {
      if (!map.has(p.enabler)) map.set(p.enabler, []);
      map.get(p.enabler)!.push(p);
    });
    return Array.from(map.entries());
  }, []);

  const totalProjects = PROJECTS.length;
  const completed = PROJECTS.filter((p) => p.status === 'مكتمل').length;
  const inProgress = PROJECTS.filter((p) => p.status === 'جاري التنفيذ').length;

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              الممكنات
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              الممكنات الإستراتيجية الداعمة لتنفيذ خطة الجامعة 2029
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Layers} label="إجمالي المشاريع" value={totalProjects} color="hsl(var(--nauss-primary))" delay={0.1} />
        <StatCard icon={CheckCircle2} label="مكتمل" value={completed} color="hsl(160, 60%, 38%)" delay={0.2} />
        <StatCard icon={Clock} label="جاري التنفيذ" value={inProgress} color="hsl(38, 85%, 50%)" delay={0.3} />
      </div>

      {/* Grouped enablers */}
      <div className="space-y-6">
        {groups.map(([enabler, items], gi) => (
          <motion.div
            key={enabler}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + gi * 0.08 }}
          >
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div
                className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-4"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--nauss-primary)/0.08), transparent)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground">{enabler}</h2>
                    {enabler === 'الاستدامة المالية' && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                        (تطوير الأنظمة المالية + تنفيذ المشاريع الرأسمالية والبنية التحتية)
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {items.length} مشروع
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>اسم المشروع</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>تاريخ البداية</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>تاريخ النهاية</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>حالة التنفيذ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((p, i) => {
                      const prevSubgroup = i > 0 ? items[i - 1].subgroup : undefined;
                      const showSubgroupHeader = p.subgroup && p.subgroup !== prevSubgroup;
                      return (
                        <React.Fragment key={i}>
                          {showSubgroupHeader && (
                            <TableRow key={`sg-${i}`} className="hover:bg-transparent border-0">
                              <TableCell colSpan={4} className="bg-muted/30 py-2.5">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(var(--nauss-primary))' }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(var(--nauss-primary))' }} />
                                  {p.subgroup}
                                </span>
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow className="hover:bg-muted/30">
                            <TableCell className="font-medium text-foreground max-w-md">{p.name}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 opacity-60" />
                                {p.start}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 opacity-60" />
                                {p.end}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[p.status] || STATUS_STYLES['']}`}>
                                {p.status === 'مكتمل' && <CheckCircle2 className="h-3 w-3" />}
                                {p.status === 'جاري التنفيذ' && <Clock className="h-3 w-3" />}
                                {p.status || '—'}
                              </span>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: { icon: any; label: string; value: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-5 flex items-center gap-4 border-border/60 hover:shadow-md transition-shadow">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}15`, color }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </Card>
    </motion.div>
  );
}
