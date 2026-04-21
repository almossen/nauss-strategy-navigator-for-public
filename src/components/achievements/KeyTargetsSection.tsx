import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BarChart3, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface KpiData {
  id: string;
  name_ar: string;
  name_en: string;
  target_2029_description: string;
  [key: string]: any;
}

interface KeyTargetsSectionProps {
  kpis: KpiData[];
  actualsMap: Record<string, string>;
  activeYear: number;
  pillarColor: string;
  forceExpanded?: boolean;
}

interface TargetGroup {
  description: string;
  kpis: { name_ar: string; name_en: string; targetValue: string; actualValue: string }[];
}

export default function KeyTargetsSection({ kpis, actualsMap, activeYear, pillarColor, forceExpanded = false }: KeyTargetsSectionProps) {
  const { t, isRTL } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const targetField = `target_${activeYear}`;
  const filtered = kpis.filter(k => k.target_2029_description && k.target_2029_description.trim() !== '' && k.target_2029_description.trim() !== 'مؤشرات داعمة');
  if (filtered.length === 0) return null;

  // Group by target_2029_description
  const targetGroups: TargetGroup[] = [];
  filtered.forEach(kpi => {
    const desc = kpi.target_2029_description.trim();
    const targetValue = kpi[targetField] || '';
    const actualValue = actualsMap[kpi.id] || '';
    const existing = targetGroups.find(g => g.description === desc);
    if (existing) {
      existing.kpis.push({ name_ar: kpi.name_ar, name_en: kpi.name_en, targetValue, actualValue });
    } else {
      targetGroups.push({
        description: desc,
        kpis: [{ name_ar: kpi.name_ar, name_en: kpi.name_en, targetValue, actualValue }]
      });
    }
  });

  const formatValue = (v: string) => {
    if (!v) return v;
    const n = parseFloat(v.replace(/[^\d.,-]/g, ''));
    if (isNaN(n)) return v;
    if (n > 0 && n < 1) {
      return `${Math.round(n * 100)}%`;
    }
    return v;
  };

  const parseNum = (v: string) => {
    if (!v) return null;
    const n = parseFloat(v.replace(/[^\d.,-]/g, ''));
    return isNaN(n) ? null : n;
  };

  const getPct = (tv: string, av: string) => {
    const t = parseNum(tv), a = parseNum(av);
    if (t === null || a === null || t === 0) return null;
    return Math.round((a / t) * 100);
  };

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getGroupStatus = (group: TargetGroup) => {
    const kpisWithValues = group.kpis.filter(k => k.targetValue && k.actualValue);
    if (kpisWithValues.length === 0) return { achieved: 0, total: 0 };
    const achieved = kpisWithValues.filter(k => {
      const t = parseNum(k.targetValue), a = parseNum(k.actualValue);
      return t !== null && a !== null && a >= t;
    }).length;
    return { achieved, total: kpisWithValues.length };
  };

  return (
    <div className="px-6 pt-6 pb-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <h4 className="text-lg font-bold text-foreground mb-5 flex items-center justify-center gap-2">
        <Target className="h-5 w-5" style={{ color: pillarColor }} />
        {t('المستهدفات الرئيسية', 'Key Targets')}
        <span className="text-xs font-normal text-muted-foreground/70">
          ({targetGroups.length})
        </span>
      </h4>

      <div className="space-y-3">
        {targetGroups.map((group, gi) => {
          const itemKey = `t-${gi}`;
          const isExpanded = forceExpanded || expandedItems[itemKey] || false;
          const status = getGroupStatus(group);
          const allAchieved = status.total > 0 && status.achieved === status.total;
          const hasAnyValues = group.kpis.some(k => k.targetValue || k.actualValue);

          return (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.06, duration: 0.35 }}
              className="rounded-xl border bg-card/50 overflow-hidden shadow-sm"
              style={{ borderColor: `${pillarColor}20` }}
            >
              <button
                onClick={() => toggleItem(itemKey)}
                className="w-full text-start p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors" dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                    !hasAnyValues
                      ? 'border-border/50 bg-muted/30'
                      : allAchieved
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/30'
                        : 'border-rose-200 bg-rose-50 dark:border-rose-800/50 dark:bg-rose-950/30'
                  }`}
                >
                  {!hasAnyValues ? (
                    <Target className="h-4 w-4 text-muted-foreground" />
                  ) : allAchieved ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-relaxed">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {group.kpis.length} {t('مؤشرات', 'KPIs')}
                    </span>
                    {status.total > 0 && (
                      <span className={`text-[11px] font-medium ${allAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                        {status.achieved}/{status.total} {t('محقق', 'achieved')}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 mt-1 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t divide-y divide-border/30" style={{ borderColor: `${pillarColor}15` }}>
                      {group.kpis.map((kpi, ki) => {
                        const tNum = parseNum(kpi.targetValue);
                        const aNum = parseNum(kpi.actualValue);
                        const isAchieved = tNum !== null && aNum !== null && aNum >= tNum;
                        const pct = getPct(kpi.targetValue, kpi.actualValue);
                        const hasVals = kpi.targetValue || kpi.actualValue;

                        return (
                          <div key={ki} className="px-4 py-3 flex items-center gap-3">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: pillarColor }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground/85 leading-snug">
                                {t(kpi.name_ar, kpi.name_en)}
                              </p>
                            </div>
                            {hasVals && (
                              <div className="flex items-center gap-2 shrink-0">
                                {kpi.targetValue && (
                                  <div className="text-center px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                                    <span className="text-[9px] text-muted-foreground block leading-none mb-0.5">{t('المستهدف', 'Target')}</span>
                                    <span className="text-xs font-bold text-foreground">{formatValue(kpi.targetValue)}</span>
                                  </div>
                                )}
                                {kpi.actualValue && (
                                  <div className={`text-center px-2.5 py-1 rounded-md border ${
                                    isAchieved
                                      ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40'
                                      : 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/40'
                                  }`}>
                                    <span className={`text-[9px] block leading-none mb-0.5 ${isAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                                      {t('المتحقق', 'Actual')}
                                    </span>
                                    <span className={`text-xs font-bold ${isAchieved ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                                      {formatValue(kpi.actualValue)}
                                    </span>
                                  </div>
                                )}
                                {pct !== null && (
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                    isAchieved
                                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                                      : 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-300'
                                  }`}>
                                    {pct}%
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
