import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects } from '@/hooks/useStrategyData';
import { useAllKPIs } from '@/hooks/useAllKPIs';
import { useAchievementSettingByYear, useKpiActuals } from '@/hooks/useAchievementSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Rocket, CheckCircle2, TrendingUp, 
  Calendar, Star, Zap, Award, BarChart3, ArrowUp, ArrowDown,
  GraduationCap, BookOpen, Globe2, Shield, Sparkles,
  Users, Lightbulb, Building2, FileCheck2, AlertTriangle
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import KeyTargetsSection from '@/components/achievements/KeyTargetsSection';


function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
}

const YEAR = 2027;
const TARGET_KEY = 'target_2027' as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.15, duration: 0.5, type: 'spring' as const, stiffness: 100 } })
};

export default function Achievements2027() {
  const { t, isRTL } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: projects } = useAllProjects();
  const { data: kpis } = useAllKPIs();
  const { data: settings } = useAchievementSettingByYear(YEAR);
  const { data: kpiActuals } = useKpiActuals(YEAR);
  const [activePillarId, setActivePillarId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pdfMode, setPdfMode] = useState(false);

  const normalizeProjectStatus = (status?: string) => {
    if (status === 'in_progress' || status === 'planned') return 'launched';
    return status || 'launched';
  };

  const projectsForYear = projects?.filter(
    p => (p.end_date && p.end_date.startsWith(String(YEAR))) || (p.start_date && p.start_date.startsWith(String(YEAR)))
  ) || [];

  const completedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'completed');
  const launchedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'launched');
  const delayedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'delayed');
  const filteredKpis = kpis?.filter(k => k[TARGET_KEY] && k[TARGET_KEY] !== '' && k[TARGET_KEY] !== '0' && k[TARGET_KEY] !== '-') || [];

  const actualsMap = useMemo(() => {
    const map: Record<string, string> = {};
    kpiActuals?.forEach(a => { map[a.kpi_id] = a.actual_value; });
    return map;
  }, [kpiActuals]);

  const isKpiAchieved = (kpi: any) => {
    const actual = actualsMap[kpi.id] || '';
    if (!actual) return false;
    const numTarget = parseFloat(kpi[TARGET_KEY]);
    const numActual = parseFloat(actual);
    return !isNaN(numActual) && !isNaN(numTarget) && numActual >= numTarget;
  };

  const pillarStats = pillars?.map(pillar => {
    const pillarCompleted = completedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarLaunched = launchedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarDelayed = delayedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarKPIs = filteredKpis.filter(k => (k as any).initiatives?.pillar_id === pillar.id);
    const kpisAchieved = pillarKPIs.filter(k => isKpiAchieved(k));
    const kpisNotAchieved = pillarKPIs.filter(k => !isKpiAchieved(k));
    return { pillar, completed: pillarCompleted, launched: pillarLaunched, delayed: pillarDelayed, kpis: pillarKPIs, kpisAchieved, kpisNotAchieved };
  }).filter(s => s.completed.length > 0 || s.launched.length > 0 || s.delayed.length > 0 || s.kpis.length > 0) || [];

  useEffect(() => {
    if (pillarStats.length > 0 && !activePillarId) setActivePillarId(pillarStats[0].pillar.id);
  }, [pillarStats, activePillarId]);

  const totalCompleted = completedProjects.length;
  const totalLaunched = launchedProjects.length;
  const totalDelayed = delayedProjects.length;
  const totalKPIs = filteredKpis.length;
  const totalKPIsAchieved = pillarStats.reduce((sum, ps) => sum + ps.kpisAchieved.length, 0);
  const totalKPIsNotAchieved = pillarStats.reduce((sum, ps) => sum + ps.kpisNotAchieved.length, 0);

  const iconMap: Record<string, any> = {
    GraduationCap, Target, Rocket, Globe2, Lightbulb, Users, Trophy, CheckCircle2, Sparkles, Award, Star, BookOpen, Shield, Building2
  };

  const activePS = pillarStats.find(ps => ps.pillar.id === activePillarId);

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} ref={contentRef}>
      
      <section className="relative overflow-hidden py-20 px-6" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-dark)) 0%, hsl(var(--nauss-teal-dark)) 40%, hsl(var(--nauss-primary)) 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, background: `hsla(37, 35%, 63%, ${Math.random() * 0.4 + 0.1})`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: 'spring' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8" style={{ background: 'hsla(37, 35%, 63%, 0.2)', border: '1px solid hsla(37, 35%, 63%, 0.3)' }}>
              <Trophy className="h-5 w-5" style={{ color: 'hsl(var(--nauss-gold))' }} />
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-gold))' }}>{t('التقرير السنوي', 'Annual Report')} {YEAR}</span>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}>
            {t(settings?.hero_title_ar || 'منجزات عام', settings?.hero_title_en || 'Achievements of')} <span style={{ color: 'hsl(var(--nauss-gold))' }}>{YEAR}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-lg text-white/70 max-w-2xl mx-auto mb-12">
            {t(settings?.hero_subtitle_ar || 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029', settings?.hero_subtitle_en || 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan')}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: CheckCircle2, label: t('مشروع مكتمل', 'Completed Projects'), value: totalCompleted, color: '#4ade80' },
              { icon: Rocket, label: t('مشروع مُنطلق', 'Launched Projects'), value: totalLaunched, color: '#60a5fa' },
              ...(totalDelayed > 0 ? [{ icon: AlertTriangle, label: t('مشروع متأخر', 'Delayed Projects'), value: totalDelayed, color: '#ef4444' }] : []),
              { icon: Target, label: t('مؤشر أداء محقق', 'KPIs Achieved'), value: totalKPIs, color: 'hsl(var(--nauss-gold))' },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={scaleIn} initial="hidden" animate="visible"
                className="relative p-6 rounded-2xl backdrop-blur-md text-center" style={{ background: 'hsla(0, 0%, 100%, 0.08)', border: '1px solid hsla(0, 0%, 100%, 0.12)' }}>
                <stat.icon className="h-8 w-8 mx-auto mb-3" style={{ color: stat.color }} />
                <div className="text-4xl font-extrabold text-white mb-1"><AnimatedCounter end={stat.value} /></div>
                <p className="text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={`shape-${i}`} className="absolute rounded-full opacity-[0.04]"
              style={{ width: 100 + i * 60, height: 100 + i * 60, background: `hsl(var(--nauss-primary))`, left: `${10 + i * 15}%`, top: `${5 + (i % 3) * 30}%` }}
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="inline-block mb-4">
              <Sparkles className="h-10 w-10" style={{ color: 'hsl(var(--nauss-gold))' }} />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">{t(`أبرز ما تم تحقيقه في ${YEAR}`, `Key Highlights of ${YEAR}`)}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('نظرة سريعة على أهم الإنجازات الاستراتيجية التي تحققت خلال العام', 'A quick look at the most important strategic achievements of the year')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const defaultColors = [
                { gradient: 'linear-gradient(135deg, hsla(170, 35%, 48%, 0.08), hsla(170, 35%, 48%, 0.02))', iconColor: 'hsl(var(--nauss-primary))', borderColor: 'hsla(170, 35%, 48%, 0.2)' },
                { gradient: 'linear-gradient(135deg, hsla(37, 35%, 63%, 0.12), hsla(37, 35%, 63%, 0.02))', iconColor: 'hsl(var(--nauss-gold))', borderColor: 'hsla(37, 35%, 63%, 0.25)' },
                { gradient: 'linear-gradient(135deg, hsla(217, 70%, 60%, 0.08), hsla(217, 70%, 60%, 0.02))', iconColor: 'hsl(217, 70%, 60%)', borderColor: 'hsla(217, 70%, 60%, 0.2)' },
                { gradient: 'linear-gradient(135deg, hsla(280, 50%, 55%, 0.08), hsla(280, 50%, 55%, 0.02))', iconColor: 'hsl(280, 50%, 55%)', borderColor: 'hsla(280, 50%, 55%, 0.2)' },
                { gradient: 'linear-gradient(135deg, hsla(45, 80%, 55%, 0.08), hsla(45, 80%, 55%, 0.02))', iconColor: 'hsl(45, 80%, 50%)', borderColor: 'hsla(45, 80%, 55%, 0.2)' },
                { gradient: 'linear-gradient(135deg, hsla(150, 50%, 45%, 0.08), hsla(150, 50%, 45%, 0.02))', iconColor: 'hsl(150, 50%, 45%)', borderColor: 'hsla(150, 50%, 45%, 0.2)' },
              ];
              const highlightItems = (settings?.highlights && settings.highlights.length > 0)
                ? settings.highlights.map((h: any, i: number) => ({ icon: iconMap[h.icon] || Sparkles, titleAr: h.titleAr || '', titleEn: h.titleEn || '', descAr: h.descAr || '', descEn: h.descEn || '', ...(defaultColors[i % defaultColors.length]) }))
                : [
                    { icon: GraduationCap, titleAr: 'تطوير البرامج الأكاديمية', titleEn: 'Academic Programs Development', descAr: `تم إطلاق وإنجاز ${totalCompleted} مشاريع أكاديمية`, descEn: `Launched ${totalCompleted} academic projects`, ...defaultColors[0] },
                    { icon: Target, titleAr: 'تحقيق مؤشرات الأداء', titleEn: 'KPI Achievement', descAr: `تم تحقيق ${totalKPIs} مؤشر أداء`, descEn: `Achieved ${totalKPIs} KPIs`, ...defaultColors[1] },
                    { icon: Rocket, titleAr: 'مشاريع جديدة منطلقة', titleEn: 'New Projects Launched', descAr: `انطلاق ${totalLaunched} مشروعاً`, descEn: `${totalLaunched} new projects`, ...defaultColors[2] },
                    { icon: Globe2, titleAr: 'التعاون الدولي', titleEn: 'International Cooperation', descAr: 'تعزيز الشراكات الدولية', descEn: 'Strengthening partnerships', ...defaultColors[3] },
                    { icon: Lightbulb, titleAr: 'الابتكار والبحث', titleEn: 'Innovation & Research', descAr: 'دعم البحث العلمي', descEn: 'Supporting research', ...defaultColors[4] },
                    { icon: Users, titleAr: 'بناء القدرات', titleEn: 'Capacity Building', descAr: 'تأهيل الكوادر الأمنية', descEn: 'Training personnel', ...defaultColors[5] },
                  ];
              return highlightItems.map((item, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group relative rounded-2xl p-6 border backdrop-blur-sm cursor-default"
                  style={{ background: item.gradient, borderColor: item.borderColor }}>
                  <motion.div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.iconColor}15` }}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
                      <item.icon className="h-7 w-7" style={{ color: item.iconColor }} />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{t(item.titleAr, item.titleEn)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descAr, item.descEn)}</p>
                  <div className="absolute top-0 end-0 w-20 h-20 rounded-es-[40px] opacity-[0.06]" style={{ background: item.iconColor }} />
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{t('إنجازات الركائز', 'Pillar Achievements')}</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t('ما حققناه عبر كل ركيزة', 'What We Achieved Across Each Pillar')}</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {pillarStats.map((ps, i) => {
              const isActive = activePillarId === ps.pillar.id;
              return (
                <motion.button key={ps.pillar.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setActivePillarId(ps.pillar.id)}
                  className="relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2"
                  style={{ borderColor: isActive ? ps.pillar.color : 'transparent', background: isActive ? `${ps.pillar.color}15` : 'hsl(var(--muted))', color: isActive ? ps.pillar.color : 'hsl(var(--muted-foreground))' }}>
                  <span className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {t(ps.pillar.name_ar, ps.pillar.name_en)}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: isActive ? `${ps.pillar.color}25` : 'hsl(var(--background))' }}>
                      {ps.completed.length + ps.launched.length + ps.delayed.length + ps.kpis.length}
                    </span>
                  </span>
                  {isActive && <motion.div layoutId="activeTab2027" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full" style={{ background: ps.pillar.color }} />}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            {activePS && (
              <motion.div key={activePS.pillar.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }} className="rounded-2xl border bg-card overflow-hidden shadow-lg">
                <div className="p-6 flex items-center gap-4" style={{ borderBottom: `3px solid ${activePS.pillar.color}` }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${activePS.pillar.color}20` }}>
                    <Award className="h-7 w-7" style={{ color: activePS.pillar.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{t(activePS.pillar.name_ar, activePS.pillar.name_en)}</h3>
                    <p className="text-sm text-muted-foreground">{t(activePS.pillar.description_ar, activePS.pillar.description_en)}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    {activePS.completed.length > 0 && (<div className="px-4 py-2 rounded-lg" style={{ background: `${activePS.pillar.color}10` }}><div className="text-2xl font-bold" style={{ color: activePS.pillar.color }}>{activePS.completed.length}</div><div className="text-[10px] text-muted-foreground">{t('مكتمل', 'Completed')}</div></div>)}
                    {activePS.launched.length > 0 && (<div className="px-4 py-2 rounded-lg bg-accent"><div className="text-2xl font-bold text-accent-foreground">{activePS.launched.length}</div><div className="text-[10px] text-muted-foreground">{t('منطلق', 'Launched')}</div></div>)}
                    {activePS.delayed.length > 0 && (<div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30"><div className="text-2xl font-bold text-red-600">{activePS.delayed.length}</div><div className="text-[10px] text-muted-foreground">{t('متأخر', 'Delayed')}</div></div>)}
                    {activePS.kpisAchieved.length > 0 && (<div className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30"><div className="text-2xl font-bold text-green-600">{activePS.kpisAchieved.length}</div><div className="text-[10px] text-muted-foreground">{t('مؤشر محقق', 'Achieved')}</div></div>)}
                    {activePS.kpisNotAchieved.length > 0 && (<div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30"><div className="text-2xl font-bold text-red-500">{activePS.kpisNotAchieved.length}</div><div className="text-[10px] text-muted-foreground">{t('مؤشر لم يتحقق', 'Not Achieved')}</div></div>)}
                  </div>
                </div>
                {/* Key Targets */}
                <KeyTargetsSection
                  kpis={activePS.kpis}
                  actualsMap={actualsMap}
                  activeYear={YEAR}
                  pillarColor={activePS.pillar.color}
                  forceExpanded={pdfMode}
                />
                {(activePS.completed.length > 0 || activePS.launched.length > 0 || activePS.delayed.length > 0) && (
                  <div className="p-6 pb-3">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Rocket className="h-4 w-4" /> {t('المشاريع', 'Projects')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[...activePS.completed, ...activePS.launched, ...activePS.delayed].map((proj, pi) => {
                        const status = normalizeProjectStatus(proj.status);
                        const isDelayed = status === 'delayed';
                        const isCompleted = status === 'completed';
                        return (
                          <motion.div key={proj.id} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: pi * 0.05 }}
                            className={`flex items-start gap-3 p-3 rounded-xl border hover:shadow-md transition-shadow ${isDelayed ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800' : 'bg-background/50'}`}>
                            <div className="mt-0.5 shrink-0">
                              {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : isDelayed ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <Zap className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium leading-snug ${isDelayed ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>{t(proj.name_ar, proj.name_en)}</p>
                              {proj.outputs_ar && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t(proj.outputs_ar, proj.outputs_en)}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  isDelayed ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {isCompleted ? t('مكتمل', 'Completed') : isDelayed ? t('متأخر', 'Delayed') : t('منطلق', 'Launched')}
                                </span>
                                {proj.start_date && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {proj.start_date} → {proj.end_date || '...'}</span>}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {(activePS.completed.length > 0 || activePS.launched.length > 0 || activePS.delayed.length > 0) && activePS.kpis.length > 0 && (
                  <div className="mx-6 border-t border-dashed border-border" />
                )}
                {activePS.kpisAchieved.length > 0 && (
                  <div className="p-6 pb-3">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                      <ArrowUp className="h-4 w-4" /> {t('مؤشرات أداء محققة', 'Achieved KPIs')}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 font-bold">{activePS.kpisAchieved.length}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activePS.kpisAchieved.map((kpi, ki) => {
                        const actual = actualsMap[kpi.id] || '';
                        return (
                          <motion.div key={kpi.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ki * 0.05 }}
                            className="p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="text-sm font-medium text-foreground leading-snug flex-1">{t(kpi.name_ar, kpi.name_en)}</p>
                              <ArrowUp className="h-4 w-4 text-green-500 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 text-center p-2 rounded-lg" style={{ background: `${activePS.pillar.color}10` }}>
                                <p className="text-[10px] text-muted-foreground mb-0.5">{t('المستهدف', 'Target')}</p>
                                <p className="text-lg font-bold" style={{ color: activePS.pillar.color }}>{kpi[TARGET_KEY]}</p>
                              </div>
                              <div className="flex-1 text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                                <p className="text-[10px] text-muted-foreground mb-0.5">{t('المحقق', 'Achieved')}</p>
                                <p className="text-lg font-bold text-green-600">{actual || kpi[TARGET_KEY]}</p>
                              </div>
                            </div>
                            {kpi.unit && <p className="text-[10px] text-muted-foreground mt-2 text-center">{kpi.unit}</p>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {activePS.kpisNotAchieved.length > 0 && (
                  <div className="p-6 pt-3">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <ArrowDown className="h-4 w-4" /> {t('مؤشرات أداء لم تتحقق', 'KPIs Not Achieved')}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 font-bold">{activePS.kpisNotAchieved.length}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activePS.kpisNotAchieved.map((kpi, ki) => {
                        const actual = actualsMap[kpi.id] || '';
                        const hasActual = actual !== '';
                        return (
                          <motion.div key={kpi.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ki * 0.05 }}
                            className="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="text-sm font-medium text-foreground leading-snug flex-1">{t(kpi.name_ar, kpi.name_en)}</p>
                              <ArrowDown className="h-4 w-4 text-red-500 shrink-0" />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 text-center p-2 rounded-lg" style={{ background: `${activePS.pillar.color}10` }}>
                                <p className="text-[10px] text-muted-foreground mb-0.5">{t('المستهدف', 'Target')}</p>
                                <p className="text-lg font-bold" style={{ color: activePS.pillar.color }}>{kpi[TARGET_KEY]}</p>
                              </div>
                              <div className="flex-1 text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                                <p className="text-[10px] text-muted-foreground mb-0.5">{t('المحقق', 'Achieved')}</p>
                                <p className="text-lg font-bold text-red-600">{hasActual ? actual : '-'}</p>
                              </div>
                            </div>
                            {kpi.unit && <p className="text-[10px] text-muted-foreground mt-2 text-center">{kpi.unit}</p>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-teal-dark)), hsl(var(--nauss-primary)))' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Trophy className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(var(--nauss-gold))' }} />
            <h2 className="text-3xl font-bold text-white mb-3">{t(settings?.footer_title_ar || 'عام من الإنجازات المتميزة', settings?.footer_title_en || 'A Year of Outstanding Achievements')}</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">{t(settings?.footer_subtitle_ar || 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية بخطى واثقة وإنجازات ملموسة', settings?.footer_subtitle_en || 'We continue our journey towards achieving our strategic vision with confident steps and tangible results')}</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ background: 'hsla(37, 35%, 63%, 0.2)', border: '1px solid hsla(37, 35%, 63%, 0.3)' }}>
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-gold))' }}>{t('الخطة الاستراتيجية', 'Strategic Plan')} NAUSS 2029</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
