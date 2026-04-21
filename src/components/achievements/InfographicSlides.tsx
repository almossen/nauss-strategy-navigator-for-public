import { motion } from 'framer-motion';
import { 
  Trophy, Target, Rocket, CheckCircle2,
  ArrowUp, ArrowDown, Award, AlertTriangle,
  GraduationCap, BookOpen, Globe2, Shield, Sparkles,
  Users, Lightbulb, Building2, Star, Zap, BarChart3
} from 'lucide-react';
import { SlideWrapper } from './PresentationMode';
import { useLanguage } from '@/contexts/LanguageContext';
import naussLogo from '@/assets/nauss-logo.png';

// NAUSS brand colors
const NAUSS = {
  teal: '#2e6066',
  tealDark: '#1a3a40',
  tealDeep: '#0f1f24',
  gold: '#b79d69',
  goldLight: 'rgba(183, 157, 105, 0.15)',
  goldBorder: 'rgba(183, 157, 105, 0.3)',
  navy: '#2a3f5f',
  olive: '#6b7a4a',
  mauve: '#8b5e6b',
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } })
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5, type: 'spring' as const } })
};

// ============ Slide 1: Cover ============
export function CoverSlide({ settings }: { settings: any }) {
  const { t } = useLanguage();
  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${NAUSS.tealDark} 30%, ${NAUSS.teal} 60%, ${NAUSS.tealDark} 90%, ${NAUSS.tealDeep} 100%)`}>
      <div className="text-center space-y-8">
        {/* Decorative geometric pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 200 + i * 150,
                height: 200 + i * 150,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${NAUSS.gold}${(10 - i * 2).toString().padStart(2, '0')}`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 40 + i * 15, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${NAUSS.gold}40, transparent)` }} />
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${NAUSS.gold}40, transparent)` }} />
        </div>

        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="relative">
          <img src={naussLogo} alt="NAUSS" className="h-20 mx-auto mb-6 opacity-90" />
        </motion.div>

        <motion.div variants={fadeIn} custom={0.5} initial="hidden" animate="visible" className="relative">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full mb-6" style={{ background: NAUSS.goldLight, border: `1px solid ${NAUSS.goldBorder}` }}>
            <Trophy className="h-6 w-6" style={{ color: NAUSS.gold }} />
            <span className="text-lg font-bold" style={{ color: NAUSS.gold }}>{t('التقرير السنوي', 'Annual Report')} 2025</span>
          </div>
        </motion.div>

        <motion.h1 variants={fadeIn} custom={1} initial="hidden" animate="visible"
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight"
        >
          {t(settings?.hero_title_ar || 'منجزات عام', settings?.hero_title_en || 'Achievements of')}
          <br />
          <span style={{ color: NAUSS.gold }}>2025</span>
        </motion.h1>

        <motion.p variants={fadeIn} custom={2} initial="hidden" animate="visible"
          className="text-xl text-white/50 max-w-3xl mx-auto"
        >
          {t(
            settings?.hero_subtitle_ar || 'إنجازات استثنائية حققتها جامعة نايف العربية للعلوم الأمنية',
            settings?.hero_subtitle_en || 'Exceptional achievements by NAUSS'
          )}
        </motion.p>

        <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible"
          className="flex items-center justify-center gap-3 text-white/30 text-sm pt-8"
        >
          <span>{t('جامعة نايف العربية للعلوم الأمنية', 'Naif Arab University for Security Sciences')}</span>
          <span style={{ color: NAUSS.gold }}>◆</span>
          <span>{t('الخطة الاستراتيجية 2025-2029', 'Strategic Plan 2025-2029')}</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============ Slide 2: Key Numbers ============
export function KeyNumbersSlide({ stats }: { stats: { label: string; value: number; icon: any; color: string; }[] }) {
  const { t } = useLanguage();
  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${NAUSS.tealDark} 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="space-y-12">
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="text-center">
          <BarChart3 className="h-10 w-10 mx-auto mb-4" style={{ color: NAUSS.gold }} />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            {t('الأرقام الرئيسية', 'Key Numbers')}
          </h2>
          <p className="text-white/40 text-lg">{t('نظرة شاملة على إنجازات العام', 'An overview of the year\'s achievements')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              custom={i}
              initial="hidden"
              animate="visible"
              className="relative text-center p-8 rounded-3xl overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${NAUSS.tealDark}, ${NAUSS.teal}30)`,
                border: `1px solid ${stat.color}30`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-full" style={{ background: stat.color }} />
              <stat.icon className="h-10 w-10 mx-auto mb-4" style={{ color: stat.color }} />
              <div className="text-5xl md:text-6xl font-black text-white mb-2">{stat.value}</div>
              <p className="text-sm text-white/60 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

// ============ Slide 3: Highlights ============
export function HighlightsSlide({ highlights }: { highlights: any[] }) {
  const { t } = useLanguage();
  const iconMap: Record<string, any> = { GraduationCap, Target, Rocket, Globe2, Lightbulb, Users, Trophy, CheckCircle2, Sparkles, Award, Star, BookOpen, Shield, Building2 };

  const items = highlights.length > 0 ? highlights : [];
  if (items.length === 0) return null;

  // Use NAUSS brand-aligned colors
  const brandColors = [NAUSS.teal, NAUSS.gold, NAUSS.navy, NAUSS.mauve, NAUSS.olive, '#4a8b8b'];

  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${NAUSS.tealDark} 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="space-y-10">
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-4" style={{ color: NAUSS.gold }} />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            {t('أبرز الإنجازات', 'Key Highlights')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item: any, i: number) => {
            const Icon = iconMap[item.icon] || Sparkles;
            const c = brandColors[i % brandColors.length];
            return (
              <motion.div
                key={i}
                variants={fadeIn}
                custom={i + 1}
                initial="hidden"
                animate="visible"
                className="p-6 rounded-2xl border backdrop-blur-sm"
                style={{ background: `${c}12`, borderColor: `${c}30` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c}20` }}>
                  <Icon className="h-6 w-6" style={{ color: c }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t(item.titleAr, item.titleEn)}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{t(item.descAr, item.descEn)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideWrapper>
  );
}

// ============ Pillar Overview Slide ============
export function PillarSlide({ pillarStat }: { pillarStat: any }) {
  const { t } = useLanguage();
  const ps = pillarStat;
  const totalKPIs = ps.kpis.length;
  const achievedPct = totalKPIs > 0 ? Math.round((ps.kpisAchieved.length / totalKPIs) * 100) : 0;

  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${ps.pillar.color}18 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="space-y-6">
        {/* Header with gold accent */}
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible">
          <div className="flex items-center gap-5 mb-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${ps.pillar.color}25`, border: `2px solid ${ps.pillar.color}50` }}>
              <Award className="h-8 w-8" style={{ color: ps.pillar.color }} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">{t(ps.pillar.name_ar, ps.pillar.name_en)}</h2>
              <p className="text-white/40 text-sm mt-1">{t(ps.pillar.description_ar, ps.pillar.description_en)}</p>
            </div>
          </div>
          <div className="h-0.5 mt-4" style={{ background: `linear-gradient(90deg, ${ps.pillar.color}, transparent)` }} />
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible" className="grid grid-cols-5 gap-3">
          {[
            { label: t('مشروع مكتمل', 'Completed'), value: ps.completed.length, color: '#4ade80', icon: CheckCircle2 },
            { label: t('مشروع منطلق', 'Launched'), value: ps.launched.length, color: '#60a5fa', icon: Rocket },
            { label: t('مشروع متأخر', 'Delayed'), value: ps.delayed.length, color: '#ef4444', icon: AlertTriangle },
            { label: t('مؤشر محقق', 'KPIs Met'), value: ps.kpisAchieved.length, color: '#4ade80', icon: ArrowUp },
            { label: t('مؤشر لم يتحقق', 'Not Met'), value: ps.kpisNotAchieved.length, color: '#ef4444', icon: ArrowDown },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-xl" style={{ background: `${NAUSS.tealDark}`, border: `1px solid ${s.value > 0 ? s.color : 'rgba(255,255,255,0.05)'}20` }}>
              <s.icon className="h-5 w-5 mx-auto mb-1" style={{ color: s.value > 0 ? s.color : 'rgba(255,255,255,0.2)' }} />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <p className="text-[10px] text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Achievement ring + projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ring chart */}
          <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible" className="flex items-center justify-center">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke={`${NAUSS.tealDark}`} strokeWidth="14" />
                <motion.circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={ps.pillar.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - achievedPct / 100) }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{achievedPct}%</span>
                <span className="text-[10px] text-white/40 mt-0.5">{t('نسبة تحقق المؤشرات', 'KPI Achievement')}</span>
              </div>
            </div>
          </motion.div>

          {/* Top projects */}
          <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible" className="space-y-2">
            <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
              <Rocket className="h-4 w-4" style={{ color: ps.pillar.color }} />
              {t('أبرز المشاريع', 'Top Projects')}
            </h3>
            {ps.completed.slice(0, 3).map((proj: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(74, 222, 128, 0.06)', border: '1px solid rgba(74, 222, 128, 0.12)' }}>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                <span className="text-xs text-white/80 font-medium leading-snug">{t(proj.name_ar, proj.name_en)}</span>
              </div>
            ))}
            {ps.delayed.slice(0, 2).map((proj: any, i: number) => (
              <div key={`d-${i}`} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span className="text-xs text-white/80 font-medium leading-snug">{t(proj.name_ar, proj.name_en)}</span>
              </div>
            ))}
            {ps.completed.length === 0 && ps.delayed.length === 0 && ps.launched.slice(0, 4).map((proj: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(96, 165, 250, 0.06)', border: '1px solid rgba(96, 165, 250, 0.12)' }}>
                <Zap className="h-4 w-4 shrink-0 text-blue-400" />
                <span className="text-xs text-white/80 font-medium leading-snug">{t(proj.name_ar, proj.name_en)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  );
}

// ============ KPI Details Slide per Pillar ============
export function PillarKPISlide({ pillarStat, actualsMap }: { pillarStat: any; actualsMap: Record<string, string> }) {
  const { t } = useLanguage();
  const ps = pillarStat;

  const formatValue = (v: string) => {
    if (!v) return '-';
    const n = parseFloat(v.replace(/[^\d.,-]/g, ''));
    if (isNaN(n)) return v;
    if (n > 0 && n < 1) return `${Math.round(n * 100)}%`;
    return v;
  };

  // Show up to 8 KPIs
  const displayKPIs = ps.kpis.slice(0, 8);

  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${ps.pillar.color}10 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Target className="h-7 w-7" style={{ color: ps.pillar.color }} />
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                {t('مؤشرات الأداء', 'KPI Performance')} — {t(ps.pillar.name_ar, ps.pillar.name_en)}
              </h2>
              <p className="text-white/40 text-sm">{ps.kpis.length} {t('مؤشر أداء', 'KPIs')} • {ps.kpisAchieved.length} {t('محقق', 'achieved')}</p>
            </div>
          </div>
          <div className="text-center px-5 py-2 rounded-xl" style={{ background: `${ps.pillar.color}15`, border: `1px solid ${ps.pillar.color}30` }}>
            <div className="text-2xl font-black text-white">{ps.kpis.length > 0 ? Math.round((ps.kpisAchieved.length / ps.kpis.length) * 100) : 0}%</div>
            <div className="text-[10px] text-white/40">{t('نسبة التحقق', 'Achievement')}</div>
          </div>
        </motion.div>

        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${ps.pillar.color}60, transparent)` }} />

        {/* KPI Table */}
        <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid rgba(255,255,255,0.06)` }}>
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-white/50" style={{ background: NAUSS.tealDark }}>
              <div className="col-span-6">{t('المؤشر', 'KPI')}</div>
              <div className="col-span-2 text-center">{t('المستهدف', 'Target')}</div>
              <div className="col-span-2 text-center">{t('المتحقق', 'Actual')}</div>
              <div className="col-span-2 text-center">{t('الحالة', 'Status')}</div>
            </div>

            {displayKPIs.map((kpi: any, i: number) => {
              const actual = actualsMap[kpi.id] || '';
              const targetVal = kpi.target_2025 || '';
              const numTarget = parseFloat(targetVal.replace(/[^\d.,-]/g, ''));
              const numActual = parseFloat((actual || '').replace(/[^\d.,-]/g, ''));
              const isAchieved = !isNaN(numActual) && !isNaN(numTarget) && numActual >= numTarget;
              const hasActual = actual !== '';
              const pct = !isNaN(numTarget) && !isNaN(numActual) && numTarget !== 0
                ? Math.round((numActual / numTarget) * 100) : null;

              return (
                <motion.div
                  key={kpi.id}
                  variants={fadeIn}
                  custom={i * 0.5 + 1.5}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
                >
                  <div className="col-span-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: isAchieved ? '#4ade80' : hasActual ? '#ef4444' : 'rgba(255,255,255,0.15)' }} />
                    <span className="text-xs text-white/80 leading-snug font-medium">{t(kpi.name_ar, kpi.name_en)}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold" style={{ color: ps.pillar.color }}>{formatValue(targetVal)}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-bold ${isAchieved ? 'text-green-400' : hasActual ? 'text-red-400' : 'text-white/30'}`}>
                      {hasActual ? formatValue(actual) : '-'}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    {hasActual ? (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAchieved ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {isAchieved ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {pct !== null ? `${pct}%` : (isAchieved ? t('محقق', '✓') : t('لم يتحقق', '✗'))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-white/20">—</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {ps.kpis.length > 8 && (
            <p className="text-center text-xs text-white/30 mt-3">
              +{ps.kpis.length - 8} {t('مؤشرات إضافية', 'more KPIs')}
            </p>
          )}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============ Summary Comparison Slide ============
export function SummarySlide({ pillarStats }: { pillarStats: any[] }) {
  const { t } = useLanguage();

  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${NAUSS.tealDark} 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="space-y-8">
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible" className="text-center">
          <BarChart3 className="h-10 w-10 mx-auto mb-4" style={{ color: NAUSS.gold }} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            {t('ملخص أداء الركائز', 'Pillar Performance Summary')}
          </h2>
        </motion.div>

        <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible" className="space-y-4">
          {pillarStats.map((ps, i) => {
            const totalKPIs = ps.kpis.length;
            const pct = totalKPIs > 0 ? Math.round((ps.kpisAchieved.length / totalKPIs) * 100) : 0;
            const totalProjects = ps.completed.length + ps.launched.length + ps.delayed.length;

            return (
              <motion.div
                key={ps.pillar.id}
                variants={fadeIn}
                custom={i + 1}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: `${ps.pillar.color}08`, border: `1px solid ${ps.pillar.color}20` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${ps.pillar.color}20` }}>
                  <Award className="h-6 w-6" style={{ color: ps.pillar.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white">{t(ps.pillar.name_ar, ps.pillar.name_en)}</h3>
                    <span className="text-lg font-black text-white">{pct}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ps.pillar.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: i * 0.2 }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] text-white/40">
                    <span>{totalProjects} {t('مشروع', 'projects')}</span>
                    <span>•</span>
                    <span>{ps.kpisAchieved.length}/{totalKPIs} {t('مؤشر محقق', 'KPIs met')}</span>
                    <span>•</span>
                    <span className="text-green-400">{ps.completed.length} {t('مكتمل', 'done')}</span>
                    {ps.delayed.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-red-400">{ps.delayed.length} {t('متأخر', 'delayed')}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

// ============ Final Slide ============
export function ClosingSlide({ settings }: { settings: any }) {
  const { t } = useLanguage();
  return (
    <SlideWrapper bg={`linear-gradient(135deg, ${NAUSS.tealDeep} 0%, ${NAUSS.teal} 50%, ${NAUSS.tealDeep} 100%)`}>
      <div className="text-center space-y-8">
        {/* Gold accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${NAUSS.gold}20, transparent)` }} />
          <div className="absolute top-3/4 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${NAUSS.gold}20, transparent)` }} />
        </div>

        <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible">
          <img src={naussLogo} alt="NAUSS" className="h-16 mx-auto mb-4 opacity-90" />
        </motion.div>

        <motion.h2 variants={fadeIn} custom={1} initial="hidden" animate="visible"
          className="text-4xl md:text-6xl font-extrabold text-white"
        >
          {t(settings?.footer_title_ar || 'عام من الإنجازات المتميزة', settings?.footer_title_en || 'A Year of Outstanding Achievements')}
        </motion.h2>

        <motion.p variants={fadeIn} custom={2} initial="hidden" animate="visible"
          className="text-xl text-white/50 max-w-3xl mx-auto"
        >
          {t(
            settings?.footer_subtitle_ar || 'نواصل المسيرة نحو تحقيق رؤيتنا الاستراتيجية',
            settings?.footer_subtitle_en || 'We continue our journey towards achieving our strategic vision'
          )}
        </motion.p>

        <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full mt-8"
          style={{ background: NAUSS.goldLight, border: `1px solid ${NAUSS.goldBorder}` }}
        >
          <Star className="h-5 w-5" style={{ color: NAUSS.gold }} />
          <span className="text-lg font-bold" style={{ color: NAUSS.gold }}>{t('الخطة الاستراتيجية', 'Strategic Plan')} NAUSS 2029</span>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
