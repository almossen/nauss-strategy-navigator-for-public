import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePillars, useStrategicGoals, useInitiatives, useProjects, useKPIs } from '@/hooks/useStrategyData';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, GraduationCap, Microscope, Dumbbell, Globe, Banknote, Shield, Monitor, Users, Target, FolderKanban, Layers, Eye, BarChart3, Calendar, User, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import KPICard from '@/components/KPICard';
import hierarchyBg from '@/assets/hierarchy-bg.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_MAP: Record<string, any> = {
  'graduation-cap': GraduationCap, 'microscope': Microscope, 'dumbbell': Dumbbell, 'globe': Globe,
  'banknote': Banknote, 'shield': Shield, 'monitor': Monitor, 'users': Users,
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } }
};

type ViewLevel = 'pillars' | 'pillar-detail' | 'initiative-detail';

export default function HierarchyView() {
  const { t, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState<ViewLevel>('pillars');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const { data: pillars } = usePillars();
  const { data: goals } = useStrategicGoals(selectedPillarId || undefined);
  const { data: initiatives } = useInitiatives(selectedPillarId || undefined);
  const { data: projects } = useProjects(selectedInitiativeId || undefined);
  const { data: kpis } = useKPIs(selectedInitiativeId || undefined);
  const { data: allInitiatives } = useInitiatives();
  const { data: allProjects } = useProjects();

  useEffect(() => {
    const pillarParam = searchParams.get('pillar');
    if (pillarParam && pillars?.find(p => p.id === pillarParam)) {
      setSelectedPillarId(pillarParam);
      setLevel('pillar-detail');
    }
  }, [searchParams, pillars]);

  const selectedPillar = pillars?.find(p => p.id === selectedPillarId);
  const selectedInitiative = initiatives?.find(i => i.id === selectedInitiativeId) || allInitiatives?.find(i => i.id === selectedInitiativeId);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const getInitiativeCount = (pid: string) => allInitiatives?.filter(i => i.pillar_id === pid).length || 0;
  const getProjectCount = (pid: string) => {
    const ids = allInitiatives?.filter(i => i.pillar_id === pid).map(i => i.id) || [];
    return allProjects?.filter(p => ids.includes(p.initiative_id)).length || 0;
  };

  const navigateToPillar = (id: string) => { setSelectedPillarId(id); setLevel('pillar-detail'); };
  const navigateToInitiative = (id: string) => { setSelectedInitiativeId(id); setLevel('initiative-detail'); };
  const cameFromDashboard = !!searchParams.get('pillar');
  const goBack = () => {
    if (level === 'initiative-detail') { setSelectedInitiativeId(null); setLevel('pillar-detail'); }
    else if (cameFromDashboard) { navigate('/'); }
    else { setSelectedPillarId(null); setLevel('pillars'); }
  };

  // Shared breadcrumb
  const breadcrumb = (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap"
    >
      <button onClick={() => navigate('/')} className="hover:text-primary transition-colors font-medium">
        {t('لوحة المعلومات', 'Dashboard')}
      </button>
      {selectedPillar && (
        <>
          <Chevron className="h-3 w-3 opacity-40" />
          <button onClick={() => { setLevel('pillar-detail'); setSelectedInitiativeId(null); }} className="hover:text-primary transition-colors font-medium">
            {t(selectedPillar.name_ar, selectedPillar.name_en)}
          </button>
        </>
      )}
      {selectedInitiative && (
        <>
          <Chevron className="h-3 w-3 opacity-40" />
          <span className="text-foreground font-semibold">{t(selectedInitiative.name_ar, selectedInitiative.name_en)}</span>
        </>
      )}
    </motion.div>
  );

  // ========== PILLARS GRID ==========
  if (level === 'pillars') {
    const pillarItems = pillars?.filter(p => p.type === 'pillar') || [];
    const enablerItems = pillars?.filter(p => p.type === 'enabler') || [];

    const PillarGrid = ({ items, title }: { items: typeof pillarItems; title: string }) => (
      <div>
        <div className="section-header">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((pillar, i) => {
            const Icon = ICON_MAP[pillar.icon] || Target;
            return (
              <motion.div
                key={pillar.id}
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className="pillar-card group"
                onClick={() => navigateToPillar(pillar.id)}
              >
                <div className="h-1.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, ${pillar.color}, ${pillar.color}88)` }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: pillar.color + '15' }}>
                      <Icon className="h-6 w-6" style={{ color: pillar.color }} />
                    </div>
                    <Chevron className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-3 leading-snug">{t(pillar.name_ar, pillar.name_en)}</h3>
                  <div className="flex gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: pillar.color + '12', color: pillar.color }}>
                      {getInitiativeCount(pillar.id)} {t('مبادرة', 'initiatives')}
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                      {getProjectCount(pillar.id)} {t('مشروع', 'projects')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );

    return (
      <div className="space-y-8 w-full">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="hero-banner h-44 md:h-52 relative rounded-2xl overflow-hidden">
          <img src={hierarchyBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex items-center px-8 md:px-12" style={{ background: 'linear-gradient(135deg, hsla(174,50%,12%,0.92), hsla(174,42%,33%,0.8))' }}>
            <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-2">
                <Layers className="h-6 w-6 text-white/70" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t('الهيكل التنظيمي', 'Strategic Hierarchy')}</h1>
              </div>
              <p className="text-white/50 text-sm max-w-lg">{t('استعرض الركائز والممكنات والمبادرات والمشاريع', 'Browse pillars, enablers, initiatives and projects')}</p>
            </motion.div>
          </div>
        </motion.div>

        <PillarGrid items={pillarItems} title={t('الركائز الاستراتيجية', 'Strategic Pillars')} />
        {enablerItems.length > 0 && <PillarGrid items={enablerItems} title={t('الممكنات', 'Enablers')} />}
      </div>
    );
  }

  // ========== PILLAR DETAIL ==========
  if (level === 'pillar-detail' && selectedPillar) {
    const Icon = ICON_MAP[selectedPillar.icon] || Target;
    const color = selectedPillar.color;
    const totalProjects = (() => {
      const initIds = initiatives?.map(i => i.id) || [];
      return allProjects?.filter(p => initIds.includes(p.initiative_id)).length || 0;
    })();

    return (
      <div className="space-y-6 w-full">
        {breadcrumb}

        {/* Compact Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute top-0 end-0 w-72 h-72 rounded-full bg-white" style={{ filter: 'blur(80px)', transform: 'translate(30%, -40%)' }} />
          </div>

          <div className="relative z-10 p-6 md:p-8">
            {/* Top row: back + pillar name + stats */}
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="outline" size="icon" onClick={goBack} className="rounded-xl h-9 w-9 shrink-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                <BackArrow className="h-4 w-4" />
              </Button>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight">{t(selectedPillar.name_ar, selectedPillar.name_en)}</h1>
              </div>
              {/* Inline stats */}
              <div className="flex gap-2">
                {[
                  { val: goals?.length || 0, label: t('أهداف', 'Goals') },
                  { val: initiatives?.length || 0, label: t('مبادرات', 'Init.') },
                  { val: totalProjects, label: t('مشاريع', 'Proj.') },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[60px]">
                    <p className="text-lg font-extrabold text-white leading-none">{s.val}</p>
                    <p className="text-[9px] text-white/50 font-semibold mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Goal */}
            {(selectedPillar.general_goal_ar || selectedPillar.general_goal_en) && (
              <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="h-3.5 w-3.5 text-white/60" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{t('الهدف العام', 'General Goal')}</span>
                </div>
                <p className="text-white font-semibold text-sm leading-relaxed">{t(selectedPillar.general_goal_ar, selectedPillar.general_goal_en)}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Two-column layout: Goals + Initiatives side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Strategic Goals — Left column (2/5) */}
          {goals && goals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="section-header">
                <h2 className="font-bold text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  {t('الأهداف الاستراتيجية', 'Strategic Goals')}
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">{goals.length}</span>
                </h2>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2.5">
                {goals.map((goal, i) => {
                  const linkedInits = initiatives?.filter(init => init.goal_id === goal.id) || [];
                  return (
                    <motion.div
                      key={goal.id}
                      variants={fadeIn}
                      transition={{ duration: 0.3 }}
                      className="group rounded-xl border border-border/50 bg-card hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0"
                          style={{ backgroundColor: color + '12', color }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground leading-snug">{t(goal.name_ar, goal.name_en)}</p>
                          {linkedInits.length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {linkedInits.length} {t('مبادرة', 'initiatives')}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Initiatives — Right column (3/5) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={goals && goals.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'}
          >
            <div className="section-header">
              <h2 className="font-bold text-base flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                {t('المبادرات', 'Initiatives')}
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">{initiatives?.length || 0}</span>
              </h2>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2.5">
              {initiatives?.map((init, i) => {
                const projCount = allProjects?.filter(p => p.initiative_id === init.id).length || 0;
                return (
                  <motion.div
                    key={init.id}
                    variants={fadeIn}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-xl border border-border/50 bg-card cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden"
                    onClick={() => navigateToInitiative(init.id)}
                  >
                    <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-1 rounded-full`} style={{ backgroundColor: color }} />
                    <div className={`p-4 ${isRTL ? 'pr-5' : 'pl-5'} flex items-center gap-3`}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-extrabold" style={{ backgroundColor: color + '10', color }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-foreground leading-snug">{t(init.name_ar, init.name_en)}</p>
                        {(init.description_ar || init.description_en) && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{t(init.description_ar, init.description_en)}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-muted/60" style={{ color }}>{projCount}</span>
                        <span className="text-[10px] text-muted-foreground hidden sm:inline">{t('مشروع', 'proj.')}</span>
                        <Chevron className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {(!initiatives || initiatives.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">{t('لا توجد مبادرات', 'No initiatives')}</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ========== INITIATIVE DETAIL ==========
  if (level === 'initiative-detail' && selectedInitiative) {
    const pillarColor = selectedPillar?.color || 'hsl(174,42%,33%)';
    const statusConfig: Record<string, { color: string; bg: string; ar: string; en: string }> = {
      planned: { color: '#94a3b8', bg: '#94a3b814', ar: 'مخطط', en: 'Planned' },
      in_progress: { color: 'hsl(174,42%,33%)', bg: 'hsla(174,42%,33%,0.08)', ar: 'قيد التنفيذ', en: 'In Progress' },
      completed: { color: '#22c55e', bg: '#22c55e14', ar: 'مكتمل', en: 'Completed' },
      delayed: { color: '#f59e0b', bg: '#f59e0b14', ar: 'متأخر', en: 'Delayed' },
    };

    return (
      <div className="space-y-6 w-full">
        {breadcrumb}

        {/* Initiative Hero — compact & informative */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${pillarColor}, ${pillarColor}bb)` }}
        >
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute top-0 end-0 w-80 h-80 rounded-full bg-white" style={{ filter: 'blur(90px)', transform: 'translate(30%, -40%)' }} />
          </div>
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Button variant="outline" size="icon" onClick={goBack} className="rounded-xl h-9 w-9 shrink-0 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white mt-0.5">
                <BackArrow className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FolderKanban className="h-4 w-4 text-white/50" />
                  <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">{t('المبادرة', 'Initiative')}</span>
                </div>
                <h1 className="text-lg md:text-xl font-extrabold text-white leading-snug mb-2">{t(selectedInitiative.name_ar, selectedInitiative.name_en)}</h1>
                {(selectedInitiative.description_ar || selectedInitiative.description_en) && (
                  <p className="text-white/60 text-sm leading-relaxed max-w-3xl">{t(selectedInitiative.description_ar, selectedInitiative.description_en)}</p>
                )}
                {/* Inline stats */}
                <div className="flex gap-3 mt-4">
                  {[
                    { val: projects?.length || 0, label: t('مشاريع', 'Projects'), icon: FolderKanban },
                    { val: kpis?.length || 0, label: t('مؤشرات', 'KPIs'), icon: BarChart3 },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                      <s.icon className="h-4 w-4 text-white/50" />
                      <div>
                        <p className="text-xl font-extrabold text-white leading-none">{s.val}</p>
                        <p className="text-[9px] text-white/50 font-semibold mt-0.5">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout: KPIs + Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPIs Column */}
          {kpis && kpis.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="section-header">
                <h2 className="font-bold text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  {t('مؤشرات الأداء', 'KPIs')}
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">{kpis.length}</span>
                </h2>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                {kpis.map((kpi, ki) => (
                  <motion.div
                    key={kpi.id}
                    variants={fadeIn}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-border/50 bg-card hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4">
                      {/* KPI name + eye button */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold shrink-0 mt-0.5" style={{ backgroundColor: pillarColor + '12', color: pillarColor }}>
                            {ki + 1}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-[13px] text-foreground leading-snug">{t(kpi.name_ar, kpi.name_en)}</h3>
                            {kpi.unit && (
                              <span className="text-[10px] text-muted-foreground inline-block mt-0.5">{kpi.unit}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg shrink-0 hover:bg-primary/10" onClick={() => setSelectedKPI(kpi)}>
                          <Eye className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </div>

                      {/* Targets — compact grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Baseline */}
                        <div className="text-center rounded-lg py-2 px-0.5" style={{ backgroundColor: 'hsla(35, 90%, 55%, 0.08)' }}>
                          <p className="text-[7px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'hsl(35, 80%, 50%)' }}>{t('الأساس', 'Base')}</p>
                          <p className="text-[11px] font-bold" style={{ color: 'hsl(35, 80%, 40%)' }}>{kpi.baseline || '—'}</p>
                        </div>
                        {/* Years */}
                        {[
                          { label: '25', value: kpi.target_2025 },
                          { label: '26', value: kpi.target_2026 },
                          { label: '27', value: kpi.target_2027 },
                          { label: '28', value: kpi.target_2028 },
                          { label: '29', value: kpi.target_2029 },
                        ].map((cell, ci) => (
                          <div key={ci} className="text-center rounded-lg py-2 px-0.5 bg-muted/30">
                            <p className="text-[7px] font-bold uppercase tracking-wider mb-0.5 text-muted-foreground">20{cell.label}</p>
                            <p className="text-[11px] font-bold text-foreground">{cell.value || '—'}</p>
                          </div>
                        ))}
                        {/* Final target */}
                        <div className="text-center rounded-lg py-2 px-0.5 ring-1 ring-primary/20" style={{ backgroundColor: pillarColor + '0d' }}>
                          <p className="text-[7px] font-bold uppercase tracking-wider mb-0.5" style={{ color: pillarColor }}>{t('النهائي', 'Final')}</p>
                          <p className="text-[11px] font-extrabold" style={{ color: pillarColor }}>{kpi.final_target || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Projects Column */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <div className="section-header">
              <h2 className="font-bold text-base flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                {t('المشاريع', 'Projects')}
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">{projects?.length || 0}</span>
              </h2>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2.5">
              {projects?.map((proj, pi) => {
                const sc = statusConfig[proj.status] || statusConfig.planned;
                const isExpanded = expandedProject === proj.id;
                return (
                  <motion.div
                    key={proj.id}
                    variants={fadeIn}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-border/50 bg-card transition-all duration-300 overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedProject(isExpanded ? null : proj.id)}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {pi + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-foreground leading-snug">{t(proj.name_ar, proj.name_en)}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {t(sc.ar, sc.en)}
                          </span>
                          {proj.start_date && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {proj.start_date} → {proj.end_date || '—'}
                            </span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-border/30 p-4 space-y-2.5"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            {[
                              { icon: User, label: t('المسؤول', 'Owner'), val: t(proj.owner_ar, proj.owner_en) },
                              { icon: Calendar, label: t('البداية', 'Start'), val: proj.start_date || '—' },
                              { icon: Calendar, label: t('النهاية', 'End'), val: proj.end_date || '—' },
                            ].map((f, fi) => (
                              <div key={fi} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2.5">
                                <f.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <div>
                                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">{f.label}</span>
                                  <p className="text-foreground font-medium">{f.val}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {((proj as any).description_ar || (proj as any).description_en) && (
                            <div className="bg-muted/30 rounded-lg p-3">
                              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">{t('الوصف', 'Description')}</span>
                              <p className="text-foreground font-medium mt-1 text-xs leading-relaxed">{t((proj as any).description_ar, (proj as any).description_en)}</p>
                            </div>
                          )}
                          {(proj.outputs_ar || proj.outputs_en) && (
                            <div className="bg-muted/30 rounded-lg p-3">
                              <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">{t('المخرجات', 'Outputs')}</span>
                              <p className="text-foreground font-medium mt-1 text-xs leading-relaxed">{t(proj.outputs_ar, proj.outputs_en)}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              {(!projects || projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">{t('لا توجد مشاريع', 'No projects')}</p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* KPI Modal */}
        {selectedKPI && (
          <KPICard
            kpi={selectedKPI}
            pillarName={selectedPillar ? t(selectedPillar.name_ar, selectedPillar.name_en) : ''}
            pillarColor={selectedPillar?.color}
            goalName={goals?.[0] ? t(goals[0].name_ar, goals[0].name_en) : ''}
            initiativeName={t(selectedInitiative.name_ar, selectedInitiative.name_en)}
            onClose={() => setSelectedKPI(null)}
          />
        )}
      </div>
    );
  }

  return null;
}
