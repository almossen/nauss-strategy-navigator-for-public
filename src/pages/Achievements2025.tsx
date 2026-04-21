import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects } from '@/hooks/useStrategyData';
import { useAllKPIs } from '@/hooks/useAllKPIs';
import { useAchievementSettingByYear, useKpiActuals } from '@/hooks/useAchievementSettings';
import { DISTRIBUTION_DATA, OVERALL_DISTRIBUTION } from '@/constants/distributionData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Rocket, CheckCircle2,
  Calendar, Star, Zap, Award, BarChart3, ArrowUp, ArrowDown,
  GraduationCap, BookOpen, Globe2, Shield, Sparkles,
  Users, Lightbulb, Building2, AlertTriangle,
  Monitor
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import KeyTargetsSection from '@/components/achievements/KeyTargetsSection';
import PresentationMode from '@/components/achievements/PresentationMode';
import { CoverSlide, KeyNumbersSlide, HighlightsSlide, PillarSlide, PillarKPISlide, SummarySlide, ClosingSlide } from '@/components/achievements/InfographicSlides';


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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.15, duration: 0.5, type: 'spring' as const, stiffness: 100 } })
};

export default function Achievements2025() {
  const { t, isRTL } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: projects } = useAllProjects();
  const { data: kpis } = useAllKPIs();
  const { data: settings } = useAchievementSettingByYear(2025);
  const { data: kpiActuals } = useKpiActuals(2025);
  const [activePillarId, setActivePillarId] = useState<string | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pdfMode, setPdfMode] = useState(false);

  // Filter 2025 data - use status field
  const normalizeProjectStatus = (status?: string) => {
    if (status === 'in_progress' || status === 'planned') return 'launched';
    return status || 'launched';
  };

  const projectsForYear = projects?.filter(
    p => (p.end_date && p.end_date.startsWith('2025')) || (p.start_date && p.start_date.startsWith('2025'))
  ) || [];

  const completedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'completed');
  const launchedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'launched');
  const delayedProjects = projectsForYear.filter(p => normalizeProjectStatus(p.status) === 'delayed');
  const kpis2025 = kpis?.filter(k => k.target_2025 && k.target_2025 !== '' && k.target_2025 !== '0' && k.target_2025 !== '-') || [];

  // Map kpi actuals
  const actualsMap = useMemo(() => {
    const map: Record<string, string> = {};
    kpiActuals?.forEach(a => { map[a.kpi_id] = a.actual_value; });
    return map;
  }, [kpiActuals]);

  // Helper to check if KPI achieved target
  const isKpiAchieved = (kpi: any) => {
    const actual = actualsMap[kpi.id] || '';
    if (!actual) return false;
    const numTarget = parseFloat(kpi.target_2025);
    const numActual = parseFloat(actual);
    return !isNaN(numActual) && !isNaN(numTarget) && numActual >= numTarget;
  };

  // Group by pillar
  const pillarStats = pillars?.map(pillar => {
    const pillarCompleted = completedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarLaunched = launchedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarDelayed = delayedProjects.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarKPIs = kpis2025.filter(k => (k as any).initiatives?.pillar_id === pillar.id);
    const kpisAchieved = pillarKPIs.filter(k => isKpiAchieved(k));
    const kpisNotAchieved = pillarKPIs.filter(k => !isKpiAchieved(k));
    return { pillar, completed: pillarCompleted, launched: pillarLaunched, delayed: pillarDelayed, kpis: pillarKPIs, kpisAchieved, kpisNotAchieved };
  }).filter(s => s.completed.length > 0 || s.launched.length > 0 || s.delayed.length > 0 || s.kpis.length > 0) || [];

  useEffect(() => {
    if (pillarStats.length > 0 && !activePillarId) {
      setActivePillarId(pillarStats[0].pillar.id);
    }
  }, [pillarStats, activePillarId]);

  const totalCompleted = completedProjects.length;
  const totalLaunched = launchedProjects.length;
  const totalDelayed = delayedProjects.length;
  const totalKPIs = kpis2025.length;
  const totalKPIsAchieved = pillarStats.reduce((sum, ps) => sum + ps.kpisAchieved.length, 0);
  const totalKPIsNotAchieved = pillarStats.reduce((sum, ps) => sum + ps.kpisNotAchieved.length, 0);

  // Average of "% of Target Achieved" across pillars (same logic as PillarPage)
  const yearIdx = 2025 - 2025;
  const pillarsWithProjects = pillarStats.filter(ps => (ps.completed.length + ps.launched.length + ps.delayed.length) > 0);
  const avgProjectsCompletion = pillarsWithProjects.length > 0
    ? Math.round(
        pillarsWithProjects.reduce((sum, ps) => {
          const annualTarget = DISTRIBUTION_DATA[ps.pillar.name_ar]?.[yearIdx] ?? 0;
          const completedWeightPct = ps.completed.reduce((s: number, p: any) => s + (parseFloat(p.weight) || 0), 0);
          const achievementOfTarget = annualTarget > 0
            ? Math.min((completedWeightPct / (annualTarget * 100)) * 100, 100)
            : 0;
          return sum + achievementOfTarget;
        }, 0) / pillarsWithProjects.length
      )
    : 0;

  // Average KPI Performance Rate across pillars (same logic as PillarPage)
  const pillarsWithKPIs = pillarStats.filter(ps => ps.kpis.length > 0);
  const avgKPIsAchievement = pillarsWithKPIs.length > 0
    ? Math.round(
        pillarsWithKPIs.reduce((sum, ps) => {
          const totalKPIs = ps.kpis.length;
          const weightPerKPI = 100 / totalKPIs;
          let totalScore = 0;
          ps.kpis.forEach((kpi: any) => {
            const actual = parseFloat(actualsMap[kpi.id] || '0');
            const target = parseFloat(kpi.target_2025 || '0');
            if (target > 0) {
              totalScore += Math.min(actual / target, 1) * weightPerKPI;
            }
          });
          return sum + totalScore;
        }, 0) / pillarsWithKPIs.length
      )
    : 0;

  // Overall achievement vs baseline target for 2025 (from Annual Achievement Distribution)
  // Baseline = المؤشر العام لعام 2025 (sourced from OVERALL_DISTRIBUTION[0])
  // Achieved = average completed-weights across pillars (each pillar sums to 100% when fully done)
  const baseline2025Pct = OVERALL_DISTRIBUTION[yearIdx] * 100; // e.g., 12.539
  const avgCompletedWeightsAcrossPillars = pillarsWithProjects.length > 0
    ? pillarsWithProjects.reduce((sum, ps) => {
        const completedWeightPct = ps.completed.reduce((s: number, p: any) => s + (parseFloat(p.weight) || 0), 0);
        return sum + completedWeightPct;
      }, 0) / pillarsWithProjects.length
    : 0;
  const overallAchievementPct = baseline2025Pct > 0
    ? Math.round(Math.min((avgCompletedWeightsAcrossPillars / baseline2025Pct) * 100, 100))
    : 0;

  const iconMap: Record<string, any> = {
    GraduationCap, Target, Rocket, Globe2, Lightbulb, Users, Trophy, CheckCircle2, Sparkles, Award, Star, BookOpen, Shield, Building2
  };

  const activePS = pillarStats.find(ps => ps.pillar.id === activePillarId);

  // Build presentation slides
  const presentationSlides = useMemo(() => {
    const slides: React.ReactNode[] = [];
    
    // Slide 1: Cover
    slides.push(<CoverSlide key="cover" settings={settings} />);
    
    // Slide 2: Key Numbers
    const statsData = [
      { icon: CheckCircle2, label: t('مشروع مكتمل', 'Completed Projects'), value: totalCompleted, color: '#4ade80' },
      { icon: Rocket, label: t('مشروع منطلق', 'Launched Projects'), value: totalLaunched, color: '#60a5fa' },
      ...(totalDelayed > 0 ? [{ icon: AlertTriangle, label: t('مشروع متأخر', 'Delayed'), value: totalDelayed, color: '#ef4444' }] : []),
      { icon: ArrowUp, label: t('مؤشر محقق', 'KPIs Achieved'), value: totalKPIsAchieved, color: '#4ade80' },
      { icon: ArrowDown, label: t('مؤشر لم يتحقق', 'Not Achieved'), value: totalKPIsNotAchieved, color: '#ef4444' },
    ];
    slides.push(<KeyNumbersSlide key="numbers" stats={statsData} />);
    
    // Slide 3: Highlights
    if (settings?.highlights?.length > 0) {
      slides.push(<HighlightsSlide key="highlights" highlights={settings.highlights} />);
    }
    
    // Slides 4+: Pillar overview + KPI details for each
    pillarStats.forEach(ps => {
      slides.push(<PillarSlide key={`pillar-${ps.pillar.id}`} pillarStat={ps} />);
      // Add KPI details slide if pillar has KPIs
      if (ps.kpis.length > 0) {
        slides.push(<PillarKPISlide key={`kpi-${ps.pillar.id}`} pillarStat={ps} actualsMap={actualsMap} />);
      }
    });

    // Summary comparison slide
    slides.push(<SummarySlide key="summary" pillarStats={pillarStats} />);
    
    // Final slide
    slides.push(<ClosingSlide key="closing" settings={settings} />);
    
    return slides;
  }, [settings, pillarStats, actualsMap, totalCompleted, totalLaunched, totalDelayed, totalKPIsAchieved, totalKPIsNotAchieved, t]);

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} ref={contentRef}>
      {/* Presentation Mode */}
      <PresentationMode
        slides={presentationSlides}
        isOpen={showPresentation}
        onClose={() => setShowPresentation(false)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6" style={{
        background: 'linear-gradient(135deg, hsl(var(--nauss-dark)) 0%, hsl(var(--nauss-teal-dark)) 40%, hsl(var(--nauss-primary)) 100%)'
      }}>
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `hsla(37, 35%, 63%, ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: 'spring' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8" style={{ background: 'hsla(37, 35%, 63%, 0.2)', border: '1px solid hsla(37, 35%, 63%, 0.3)' }}>
              <Trophy className="h-5 w-5" style={{ color: 'hsl(var(--nauss-gold))' }} />
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-gold))' }}>
                {t('التقرير السنوي', 'Annual Report')} 2025
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
            style={{ fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t(settings?.hero_title_ar || 'منجزات عام', settings?.hero_title_en || 'Achievements of')} <span style={{ color: 'hsl(var(--nauss-gold))' }}>2025</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-white/70 max-w-2xl mx-auto mb-12"
          >
            {t(
              settings?.hero_subtitle_ar || 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية ضمن خطتها الاستراتيجية 2025-2029',
              settings?.hero_subtitle_en || 'Exceptional achievements by NAUSS as part of the 2025-2029 Strategic Plan'
            )}
          </motion.p>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle2, label: t('مشروع مكتمل', 'Completed Projects'), value: totalCompleted, color: '#4ade80' },
              { icon: Rocket, label: t('مشروع مُنطلق', 'Launched Projects'), value: totalLaunched, color: '#60a5fa' },
              ...(totalDelayed > 0 ? [{ icon: AlertTriangle, label: t('مشروع متأخر', 'Delayed Projects'), value: totalDelayed, color: '#ef4444' }] : []),
              { icon: ArrowUp, label: t('مؤشر محقق', 'KPIs Achieved'), value: totalKPIsAchieved, color: '#4ade80' },
              { icon: ArrowDown, label: t('مؤشر لم يتحقق', 'KPIs Not Achieved'), value: totalKPIsNotAchieved, color: '#ef4444' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="relative p-6 rounded-2xl backdrop-blur-md text-center"
                style={{ background: 'hsla(0, 0%, 100%, 0.08)', border: '1px solid hsla(0, 0%, 100%, 0.12)' }}
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3" style={{ color: stat.color }} />
                <div className="text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={stat.value} />
                </div>
                <p className="text-sm text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Overall Strategic Plan Execution Stats */}
      <section className="py-16 px-6" style={{ background: 'hsl(var(--background))' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'hsla(186, 37%, 29%, 0.1)', border: '1px solid hsla(186, 37%, 29%, 0.2)' }}>
              <BarChart3 className="h-4 w-4" style={{ color: 'hsl(var(--nauss-primary))' }} />
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-primary))' }}>
                {t('نظرة عامة', 'Overview')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'hsl(var(--foreground))', fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}>
              {t('الإحصائيات العامة لتنفيذ الخطة الاستراتيجية', 'Overall Strategic Plan Execution Statistics')}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t('متوسط أداء المرتكزات لعام 2025', 'Average pillar performance for 2025')}
            </p>
          </motion.div>

          {/* Overall Achievement vs 2025 Baseline Target */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-2xl mb-8"
            style={{
              background: 'linear-gradient(135deg, hsl(186, 37%, 22%) 0%, hsl(186, 37%, 29%) 50%, hsl(37, 38%, 43%) 100%)',
              border: '1px solid hsla(37, 38%, 63%, 0.25)',
            }}
          >
            <div className="absolute -top-16 -end-16 w-64 h-64 rounded-full opacity-20" style={{ background: 'hsl(37, 38%, 63%)' }} />
            <div className="absolute -bottom-12 -start-12 w-48 h-48 rounded-full opacity-10" style={{ background: 'white' }} />

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-4 md:col-span-1">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'hsla(0, 0%, 100%, 0.18)', backdropFilter: 'blur(10px)' }}>
                  <Trophy className="h-8 w-8" style={{ color: 'hsl(var(--nauss-gold))' }} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2" style={{ background: 'hsla(37, 38%, 63%, 0.25)' }}>
                    <Sparkles className="h-3 w-3" style={{ color: 'hsl(var(--nauss-gold))' }} />
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: 'hsl(var(--nauss-gold))' }}>
                      {t('المؤشر العام', 'Overall Index')}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                    {t('نسبة المحقق من إنجاز عام 2025', '2025 Achievement Rate')}
                  </h3>
                </div>
              </div>

              <div className="text-center md:col-span-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg">
                    <AnimatedCounter end={overallAchievementPct} />
                  </span>
                  <span className="text-4xl font-bold text-white/80">%</span>
                </div>
                <p className="text-xs text-white/70 mt-2 font-medium">
                  {t('من المستهدف السنوي', 'of the annual target')}
                </p>
              </div>

              <div className="md:col-span-1 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsla(0, 0%, 100%, 0.1)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" style={{ color: 'hsl(var(--nauss-gold))' }} />
                    <span className="text-xs font-semibold text-white/85">{t('خط الأساس 2025', 'Baseline 2025')}</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">{baseline2025Pct.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsla(0, 0%, 100%, 0.1)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: '#4ade80' }} />
                    <span className="text-xs font-semibold text-white/85">{t('المحقق', 'Achieved')}</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">{avgCompletedWeightsAcrossPillars.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="relative mt-8 h-3 rounded-full overflow-hidden" style={{ background: 'hsla(0, 0%, 100%, 0.15)' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${overallAchievementPct}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.4, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(var(--nauss-gold)), hsla(0, 0%, 100%, 0.95))' }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Rocket,
                label: t('نسبة الإنجاز للمشاريع لعام 2025', 'Projects Completion Rate 2025'),
                sublabel: t('متوسط إنجاز المشاريع عبر المرتكزات', 'Average across pillars'),
                value: avgProjectsCompletion,
                gradient: 'linear-gradient(135deg, hsl(186, 37%, 29%), hsl(186, 37%, 22%))',
                accent: 'hsl(186, 37%, 45%)',
              },
              {
                icon: Target,
                label: t('نسبة تحقيق مؤشرات الأداء لعام 2025', 'KPIs Achievement Rate 2025'),
                sublabel: t('متوسط تحقيق المؤشرات عبر المرتكزات', 'Average across pillars'),
                value: avgKPIsAchievement,
                gradient: 'linear-gradient(135deg, hsl(37, 38%, 53%), hsl(37, 38%, 43%))',
                accent: 'hsl(37, 38%, 53%)',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl p-8 shadow-xl"
                style={{ background: stat.gradient, border: '1px solid hsla(0, 0%, 100%, 0.1)' }}
              >
                <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full opacity-20" style={{ background: stat.accent }} />
                <div className="relative flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'hsla(0, 0%, 100%, 0.15)', backdropFilter: 'blur(10px)' }}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white/90 mb-1">{stat.label}</h3>
                    <p className="text-xs text-white/60 mb-3">{stat.sublabel}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-extrabold text-white">
                        <AnimatedCounter end={stat.value} />
                      </span>
                      <span className="text-3xl font-bold text-white/80">%</span>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="relative mt-6 h-2 rounded-full overflow-hidden" style={{ background: 'hsla(0, 0%, 100%, 0.15)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.6))' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
