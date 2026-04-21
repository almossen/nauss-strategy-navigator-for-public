import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects } from '@/hooks/useStrategyData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import timelineBg from '@/assets/timeline-bg.jpg';

const YEARS = [2025, 2026, 2027, 2028, 2029];
const TOTAL_MONTHS = 60;
const START_DATE = new Date(2025, 0, 1);

function monthDiff(start: Date, end: Date) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.04 }
  }
};

export default function TimelineView() {
  const { t, isRTL } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: allProjects } = useAllProjects();
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    let projects = allProjects.filter((p: any) => p.start_date && p.end_date);
    if (filterPillar !== 'all') projects = projects.filter((p: any) => p.initiatives?.pillar_id === filterPillar);
    return projects;
  }, [allProjects, filterPillar]);

  const getPillarColor = (pid: string) => pillars?.find(p => p.id === pid)?.color || 'hsl(174,42%,33%)';
  const getPillarName = (pid: string) => { const p = pillars?.find(p => p.id === pid); return p ? t(p.name_ar, p.name_en) : ''; };

  // For RTL: years display in same order but the bar positioning flips (right instead of left)
  const displayYears = YEARS;

  return (
    <div className="space-y-8 w-full">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="hero-banner h-44 md:h-52 relative"
      >
        <img src={timelineBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 z-10 flex items-center justify-between px-8 md:px-12" style={{ background: 'linear-gradient(135deg, hsla(174,50%,12%,0.92), hsla(174,42%,33%,0.8))' }}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-white/70" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t('الجدول الزمني', 'Timeline')}</h1>
            </div>
            <p className="text-white/50 text-sm">{t('عرض المشاريع على الخط الزمني 2025 - 2029', 'View projects on the 2025-2029 timeline')}</p>
          </motion.div>
          <Select value={filterPillar} onValueChange={setFilterPillar}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white backdrop-blur-md">
              <SelectValue placeholder={t('تصفية', 'Filter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
              {pillars?.map(p => (
                <SelectItem key={p.id} value={p.id}>{t(p.name_ar, p.name_en)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="card-premium p-6 overflow-x-auto"
      >
        <div className="min-w-[900px]">
          {/* Year Headers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex border-b border-border pb-3 mb-5"
          >
            <div className="w-56 shrink-0" />
            <div className="flex-1 flex">
              {displayYears.map((year, i) => (
                <motion.div
                  key={year}
                  className="flex-1 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                >
                  <span className="text-sm font-bold text-foreground bg-muted/60 px-4 py-1.5 rounded-full">{year}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Grid Lines */}
          <div className="relative">
            <div
              className="absolute inset-0 flex pointer-events-none"
              style={isRTL ? { paddingRight: '14rem' } : { paddingLeft: '14rem' }}
            >
              {YEARS.map((_, i) => (
                <div key={i} className={`flex-1 ${isRTL ? 'border-r' : 'border-l'} border-border/30 first:border-l-0 first:border-r-0`} />
              ))}
            </div>

            {/* Project Rows */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-1 relative"
            >
              {filteredProjects.map((proj: any, index: number) => {
                const start = new Date(proj.start_date);
                const end = new Date(proj.end_date);
                const startOffset = Math.max(0, monthDiff(START_DATE, start));
                const duration = Math.max(1, monthDiff(start, end) + 1);
                const posPercent = (startOffset / TOTAL_MONTHS) * 100;
                const widthPercent = (duration / TOTAL_MONTHS) * 100;
                const color = getPillarColor(proj.initiatives?.pillar_id);
                const isExpanded = expandedProject === proj.id;

                // In RTL: position from right; in LTR: position from left
                const barStyle: React.CSSProperties = {
                  ...(isRTL ? { right: `${posPercent}%` } : { left: `${posPercent}%` }),
                  width: `${Math.min(widthPercent, 100 - posPercent)}%`,
                  background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, ${color}, ${color}cc)`,
                  minWidth: '24px',
                };

                return (
                  <motion.div
                    key={proj.id}
                    variants={fadeInUp}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                  >
                    <div
                      className={`flex items-center cursor-pointer rounded-lg transition-all duration-200 py-2 px-2 ${isExpanded ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                      onClick={() => setExpandedProject(isExpanded ? null : proj.id)}
                    >
                      <div className={`w-52 shrink-0 ${isRTL ? 'pl-4' : 'pr-4'} flex items-center gap-2`}>
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <p className="text-xs font-semibold truncate text-foreground">{t(proj.name_ar, proj.name_en)}</p>
                      </div>
                      <div className="flex-1 relative h-8">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              className="absolute top-1 h-6 rounded-full flex items-center px-3 shadow-sm hover:brightness-110 transition-all"
                              style={barStyle}
                              initial={{ scaleX: 0, originX: isRTL ? 1 : 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 + index * 0.03, ease: 'easeOut' }}
                            >
                              <span className="text-[10px] text-white truncate font-semibold drop-shadow-sm">
                                {widthPercent > 10 ? t(proj.name_ar, proj.name_en) : ''}
                              </span>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="glass-card border-none p-3 max-w-xs">
                            <p className="font-bold text-sm mb-1">{t(proj.name_ar, proj.name_en)}</p>
                            <p className="text-xs text-muted-foreground">{getPillarName(proj.initiatives?.pillar_id)}</p>
                            <p className="text-xs mt-1">{proj.start_date} → {proj.end_date}</p>
                            <p className="text-xs text-muted-foreground">{t('المسؤول:', 'Owner:')} {t(proj.owner_ar, proj.owner_en)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground mx-2 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mx-2 shrink-0" />}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className={`${isRTL ? 'mr-56' : 'ml-56'} my-2`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div
                            className={`card-premium p-5 ${isRTL ? 'border-r-4' : 'border-l-4'}`}
                            style={isRTL ? { borderRightColor: color } : { borderLeftColor: color }}
                          >
                            <motion.div
                              className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs"
                              initial="hidden"
                              animate="visible"
                              variants={stagger}
                            >
                              {[
                                { label: t('الركيزة', 'Pillar'), val: getPillarName(proj.initiatives?.pillar_id) },
                                { label: t('المسؤول', 'Owner'), val: t(proj.owner_ar, proj.owner_en) },
                                { label: t('الفترة', 'Period'), val: `${proj.start_date} — ${proj.end_date}` },
                                { label: t('الحالة', 'Status'), val: proj.status === 'in_progress' ? t('قيد التنفيذ', 'In Progress') : proj.status === 'completed' ? t('مكتمل', 'Completed') : proj.status === 'delayed' ? t('متأخر', 'Delayed') : t('مخطط', 'Planned') },
                              ].map((f, i) => (
                                <motion.div
                                  key={i}
                                  variants={fadeInUp}
                                  transition={{ duration: 0.3 }}
                                  className="bg-muted/30 rounded-lg p-3"
                                >
                                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">{f.label}</span>
                                  <p className="text-foreground font-semibold mt-1">{f.val}</p>
                                </motion.div>
                              ))}
                              {(proj.outputs_ar || proj.outputs_en) && (
                                <motion.div
                                  variants={fadeInUp}
                                  transition={{ duration: 0.3 }}
                                  className="col-span-2 md:col-span-4 bg-muted/30 rounded-lg p-3"
                                >
                                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">{t('المخرجات', 'Outputs')}</span>
                                  <p className="text-foreground font-semibold mt-1">{t(proj.outputs_ar, proj.outputs_en)}</p>
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              {filteredProjects.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-12">{t('لا توجد مشاريع لعرضها', 'No projects to display')}</p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
