import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects } from '@/hooks/useStrategyData';
import { useAllKPIs } from '@/hooks/useAllKPIs';
import { useTargetSettingByYear } from '@/hooks/useTargetSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Rocket, TrendingUp, Calendar, Star, Zap, Award, BarChart3,
  GraduationCap, BookOpen, Globe2, Shield, Sparkles,
  Users, Lightbulb, Building2, CheckCircle2, Flag
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

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

const iconMap: Record<string, any> = {
  GraduationCap, Target, Rocket, Globe2, Lightbulb, Users, Flag, CheckCircle2, Sparkles, Award, Star, BookOpen, Shield, Building2
};

export default function TargetsPage({ year }: { year: number }) {
  const { t, isRTL } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: projects } = useAllProjects();
  const { data: kpis } = useAllKPIs();
  const { data: settings } = useTargetSettingByYear(year);
  const [activePillarId, setActivePillarId] = useState<string | null>(null);

  const yearStr = String(year);
  const targetField = `target_${year}` as string;

  // Projects active in this year
  const projectsForYear = useMemo(() => projects?.filter(p => {
    const startYear = p.start_date ? parseInt(p.start_date.substring(0, 4)) : null;
    const endYear = p.end_date ? parseInt(p.end_date.substring(0, 4)) : null;
    if (startYear && endYear) return startYear <= year && endYear >= year;
    if (startYear) return startYear <= year;
    if (endYear) return endYear >= year;
    return false;
  }) || [], [projects, year]);

  // KPIs with targets for this year
  const kpisForYear = useMemo(() => kpis?.filter(k => {
    const val = (k as any)[targetField];
    return val && val !== '' && val !== '0' && val !== '-';
  }) || [], [kpis, targetField]);

  // Group by pillar
  const pillarStats = useMemo(() => pillars?.map(pillar => {
    const pillarProjects = projectsForYear.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pillarKPIs = kpisForYear.filter(k => (k as any).initiatives?.pillar_id === pillar.id);
    return { pillar, projects: pillarProjects, kpis: pillarKPIs };
  }).filter(s => s.projects.length > 0 || s.kpis.length > 0) || [], [pillars, projectsForYear, kpisForYear]);

  useEffect(() => {
    if (pillarStats.length > 0 && !activePillarId) {
      setActivePillarId(pillarStats[0].pillar.id);
    }
  }, [pillarStats, activePillarId]);

  const activePS = pillarStats.find(ps => ps.pillar.id === activePillarId);

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6" style={{
        background: 'linear-gradient(135deg, hsl(var(--nauss-dark)) 0%, hsl(195,41%,31%) 40%, hsl(var(--nauss-primary)) 100%)'
      }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `hsla(37, 35%, 63%, ${Math.random() * 0.3 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: 'spring' }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8" style={{ background: 'hsla(37, 35%, 63%, 0.2)', border: '1px solid hsla(37, 35%, 63%, 0.3)' }}>
              <Target className="h-5 w-5" style={{ color: 'hsl(var(--nauss-gold))' }} />
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-gold))' }}>
                {t('المستهدفات السنوية', 'Annual Targets')} {year}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
          >
            {t(settings?.hero_title_ar || 'مستهدفات عام', settings?.hero_title_en || 'Targets of')} <span style={{ color: 'hsl(var(--nauss-gold))' }}>{year}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-white/70 max-w-2xl mx-auto mb-12"
          >
            {t(
              settings?.hero_subtitle_ar || 'المستهدفات التي نسعى لتحقيقها ضمن الخطة الاستراتيجية',
              settings?.hero_subtitle_en || 'Targets we aim to achieve within the strategic plan'
            )}
          </motion.p>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Rocket, label: t('مشروع نشط', 'Active Projects'), value: projectsForYear.length, color: '#60a5fa' },
              { icon: Target, label: t('مؤشر أداء مستهدف', 'Target KPIs'), value: kpisForYear.length, color: 'hsl(var(--nauss-gold))' },
              { icon: Flag, label: t('ركيزة مشاركة', 'Active Pillars'), value: pillarStats.length, color: '#4ade80' },
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


      {/* Pillar Filter + Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{t('مستهدفات الركائز', 'Pillar Targets')}</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {t('ما نسعى لتحقيقه عبر كل ركيزة', 'What We Aim to Achieve Across Each Pillar')}
            </h2>
          </motion.div>

          {/* Pillar Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {pillarStats.map((ps, i) => {
              const isActive = activePillarId === ps.pillar.id;
              return (
                <motion.button
                  key={ps.pillar.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActivePillarId(ps.pillar.id)}
                  className="relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2"
                  style={{
                    borderColor: isActive ? ps.pillar.color : 'transparent',
                    background: isActive ? `${ps.pillar.color}15` : 'hsl(var(--muted))',
                    color: isActive ? ps.pillar.color : 'hsl(var(--muted-foreground))',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t(ps.pillar.name_ar, ps.pillar.name_en)}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{
                      background: isActive ? `${ps.pillar.color}25` : 'hsl(var(--background))',
                    }}>
                      {ps.projects.length + ps.kpis.length}
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTargetTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                      style={{ background: ps.pillar.color }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Active Pillar Content */}
          <AnimatePresence mode="wait">
            {activePS && (
              <motion.div
                key={activePS.pillar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border bg-card overflow-hidden shadow-lg"
              >
                {/* Pillar Header */}
                <div className="p-6 flex items-center gap-4" style={{ borderBottom: `3px solid ${activePS.pillar.color}` }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${activePS.pillar.color}20` }}>
                    <Target className="h-7 w-7" style={{ color: activePS.pillar.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{t(activePS.pillar.name_ar, activePS.pillar.name_en)}</h3>
                    <p className="text-sm text-muted-foreground">{t(activePS.pillar.description_ar, activePS.pillar.description_en)}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div className="px-4 py-2 rounded-lg" style={{ background: `${activePS.pillar.color}10` }}>
                      <div className="text-2xl font-bold" style={{ color: activePS.pillar.color }}>{activePS.projects.length}</div>
                      <div className="text-[10px] text-muted-foreground">{t('مشروع نشط', 'Active Projects')}</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-accent">
                      <div className="text-2xl font-bold text-accent-foreground">{activePS.kpis.length}</div>
                      <div className="text-[10px] text-muted-foreground">{t('مؤشر مستهدف', 'Target KPIs')}</div>
                    </div>
                  </div>
                </div>


                {/* Projects */}
                {activePS.projects.length > 0 && (
                  <div className="p-6 pb-3">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Rocket className="h-4 w-4" /> {t('المشاريع المستهدفة', 'Target Projects')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activePS.projects.map((proj, pi) => (
                        <motion.div
                          key={proj.id}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: pi * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl border bg-background/50 hover:shadow-md transition-shadow"
                        >
                          <div className="mt-0.5 shrink-0">
                            <Zap className="h-5 w-5" style={{ color: activePS.pillar.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-snug text-foreground">{t(proj.name_ar, proj.name_en)}</p>
                            {proj.outputs_ar && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t(proj.outputs_ar, proj.outputs_en)}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${activePS.pillar.color}15`, color: activePS.pillar.color }}>
                                {t('مستهدف', 'Target')}
                              </span>
                              {proj.start_date && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {proj.start_date} → {proj.end_date || '...'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Separator */}
                {activePS.projects.length > 0 && activePS.kpis.length > 0 && (
                  <div className="mx-6 border-t border-dashed border-border" />
                )}

                {/* KPIs */}
                {activePS.kpis.length > 0 && (
                  <div className="p-6">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: activePS.pillar.color }}>
                      <Target className="h-4 w-4" /> {t('مؤشرات الأداء المستهدفة', 'Target KPIs')}
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${activePS.pillar.color}15` }}>{activePS.kpis.length}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activePS.kpis.map((kpi, ki) => {
                        const target = (kpi as any)[targetField];
                        return (
                          <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: ki * 0.05 }}
                            className="p-4 rounded-xl border"
                            style={{ borderColor: `${activePS.pillar.color}30`, background: `${activePS.pillar.color}05` }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="text-sm font-medium text-foreground leading-snug flex-1">{t(kpi.name_ar, kpi.name_en)}</p>
                              <TrendingUp className="h-4 w-4 shrink-0" style={{ color: activePS.pillar.color }} />
                            </div>
                            <div className="text-center p-3 rounded-lg" style={{ background: `${activePS.pillar.color}10` }}>
                              <p className="text-[10px] text-muted-foreground mb-0.5">{t('المستهدف', 'Target')}</p>
                              <p className="text-2xl font-bold" style={{ color: activePS.pillar.color }}>{target}</p>
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

      {/* Summary Footer */}
      <section className="py-16 px-6" style={{
        background: 'linear-gradient(135deg, hsl(var(--nauss-teal-dark)), hsl(var(--nauss-primary)))'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Target className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(var(--nauss-gold))' }} />
            <h2 className="text-3xl font-bold text-white mb-3">
              {t(settings?.footer_title_ar || 'نسعى لتحقيق أهدافنا', settings?.footer_title_en || 'Striving to Achieve Our Goals')}
            </h2>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ background: 'hsla(37, 35%, 63%, 0.2)', border: '1px solid hsla(37, 35%, 63%, 0.3)' }}>
              <span className="text-sm font-semibold" style={{ color: 'hsl(var(--nauss-gold))' }}>
                {t('الخطة الاستراتيجية', 'Strategic Plan')} NAUSS 2029
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
