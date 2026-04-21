import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Pillar {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
}

interface Props {
  allProjects: any[];
  pillars: Pillar[];
}

export function ProjectTimeline({ allProjects, pillars }: Props) {
  const { t, isRTL } = useLanguage();
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [startYearFilter, setStartYearFilter] = useState<string>('all');
  const [endYearFilter, setEndYearFilter] = useState<string>('all');

  const years = [2025, 2026, 2027, 2028, 2029];

  const filteredProjects = useMemo(() => {
    if (selectedPillar === 'all') return allProjects;
    return allProjects.filter((p: any) => p.initiatives?.pillar_id === selectedPillar);
  }, [allProjects, selectedPillar]);

  // Build Gantt rows: group by year, show project bars
  const ganttData = useMemo(() => {
    return filteredProjects
      .filter((p: any) => {
        if (startYearFilter !== 'all' && (!p.start_date || new Date(p.start_date).getFullYear() !== Number(startYearFilter))) return false;
        if (endYearFilter !== 'all' && (!p.end_date || new Date(p.end_date).getFullYear() !== Number(endYearFilter))) return false;
        return p.start_date || p.end_date;
      })
      .map((p: any) => {
        const startYear = p.start_date ? new Date(p.start_date).getFullYear() : null;
        const startMonth = p.start_date ? new Date(p.start_date).getMonth() : 0;
        const endYear = p.end_date ? new Date(p.end_date).getFullYear() : null;
        const endMonth = p.end_date ? new Date(p.end_date).getMonth() : 11;
        const pillarId = p.initiatives?.pillar_id;
        const pillar = pillars.find(pl => pl.id === pillarId);
        return {
          id: p.id,
          name: t(p.name_ar, p.name_en),
          startYear,
          startMonth,
          endYear,
          endMonth,
          color: pillar?.color || 'hsl(174,42%,33%)',
          status: p.status,
        };
      })
      .sort((a, b) => {
        const aStart = a.startYear ? a.startYear * 12 + a.startMonth : 9999;
        const bStart = b.startYear ? b.startYear * 12 + b.startMonth : 9999;
        return aStart - bStart;
      });
  }, [filteredProjects, startYearFilter, endYearFilter, pillars, t]);

  // Year summary counts
  const yearSummary = useMemo(() => {
    return years.map(year => {
      const starting = filteredProjects.filter((p: any) => p.start_date && new Date(p.start_date).getFullYear() === year).length;
      const ending = filteredProjects.filter((p: any) => p.end_date && new Date(p.end_date).getFullYear() === year).length;
      const active = filteredProjects.filter((p: any) => {
        const sy = p.start_date ? new Date(p.start_date).getFullYear() : 9999;
        const ey = p.end_date ? new Date(p.end_date).getFullYear() : 0;
        return sy <= year && ey >= year;
      }).length;
      return { year, starting, ending, active };
    });
  }, [filteredProjects, years]);

  // Calculate bar position as percentage across the 5-year timeline
  const totalMonths = years.length * 12; // 60 months
  const baseYear = years[0];

  const getBarStyle = (item: typeof ganttData[0]) => {
    const sYear = item.startYear || baseYear;
    const sMonth = item.startMonth || 0;
    const eYear = item.endYear || years[years.length - 1];
    const eMonth = item.endMonth || 11;

    const startOffset = Math.max(0, (sYear - baseYear) * 12 + sMonth);
    const endOffset = Math.min(totalMonths, (eYear - baseYear) * 12 + eMonth + 1);
    const pos = (startOffset / totalMonths) * 100;
    const width = Math.max(((endOffset - startOffset) / totalMonths) * 100, 1.5);

    // RTL: 2025 on right, 2029 on left — use right positioning
    return { right: `${pos}%`, width: `${width}%` };
  };

  const activePillarColor = selectedPillar !== 'all'
    ? pillars.find(p => p.id === selectedPillar)?.color
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-premium p-6"
    >
      {/* Header + Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="section-header mb-0 pb-0">
          <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {t('توزيع المشاريع على السنوات', 'Projects Distribution by Year')}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Pillar filter */}
          <div className="flex gap-1.5 flex-wrap items-center">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <button
              onClick={() => setSelectedPillar('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
              style={{
                backgroundColor: selectedPillar === 'all' ? 'hsl(174,42%,33%)' : 'transparent',
                color: selectedPillar === 'all' ? 'white' : 'hsl(180,12%,45%)',
                borderColor: selectedPillar === 'all' ? 'hsl(174,42%,33%)' : 'hsl(180,10%,88%)',
              }}
            >
              {t('الكل', 'All')}
            </button>
            {pillars.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
                style={{
                  backgroundColor: selectedPillar === p.id ? p.color : 'transparent',
                  color: selectedPillar === p.id ? 'white' : 'hsl(180,12%,45%)',
                  borderColor: selectedPillar === p.id ? p.color : 'hsl(180,10%,88%)',
                }}
              >
                {t(p.name_ar, p.name_en)}
              </button>
            ))}
          </div>

          {/* Date year filters */}
          <div className="flex gap-3 items-center border-s border-border/50 ps-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground">{t('سنة البداية', 'Start Year')}</span>
              <Select value={startYearFilter} onValueChange={setStartYearFilter}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                  {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-muted-foreground">{t('سنة الإغلاق', 'End Year')}</span>
              <Select value={endYearFilter} onValueChange={setEndYearFilter}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                  {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Year summary cards */}
      <div className="grid grid-cols-5 gap-2 mb-6" style={{ direction: 'rtl' }}>
        {yearSummary.map((ys, i) => (
          <motion.div
            key={ys.year}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="text-center bg-muted/40 rounded-xl py-3 px-2"
          >
            <p className="text-sm font-extrabold text-foreground">{ys.year}</p>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <div className="text-center">
                <p className="text-lg font-extrabold text-primary leading-none">{ys.active}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{t('نشط', 'Active')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-[10px] text-muted-foreground">
                <span className="font-bold text-foreground">{ys.starting}</span> {t('بداية', 'start')}
              </span>
              <span className="text-[10px] text-muted-foreground">
                <span className="font-bold text-foreground">{ys.ending}</span> {t('نهاية', 'end')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Year headers */}
          <div className="border-b border-border/40 mb-1">
            <div className="flex">
              <div className="w-44 shrink-0" />
              <div className="flex-1 flex" style={{ direction: 'rtl' }}>
                {years.map(year => (
                  <div key={year} className="flex-1 text-center border-e border-border/20 first:border-e-0">
                    <p className="text-xs font-bold text-foreground py-1.5">{year}</p>
                    <div className="flex" style={{ direction: 'rtl' }}>
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => (
                        <span key={q} className={`flex-1 text-[8px] text-muted-foreground/60 font-medium pb-1 ${qi > 0 ? 'border-e border-border/[0.08]' : ''}`}>{q}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project rows */}
          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {ganttData.length > 0 ? ganttData.map((item, i) => {
              const barStyle = getBarStyle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  className="flex items-center group hover:bg-muted/30 rounded-lg transition-colors"
                >
                  {/* Project name */}
                  <div className="w-44 shrink-0 pe-2 py-1.5 group/name relative">
                    <p className="text-[11px] font-medium text-foreground line-clamp-1 leading-tight cursor-default">{item.name}</p>
                    <div className="absolute z-50 invisible opacity-0 group-hover/name:visible group-hover/name:opacity-100 transition-opacity duration-200 bg-popover text-popover-foreground border border-border shadow-lg rounded-lg p-2.5 max-w-xs top-full mt-1 end-0">
                      <p className="text-[11px] font-medium leading-relaxed whitespace-normal">{item.name}</p>
                    </div>
                  </div>
                  {/* Bar area */}
                  <div className="flex-1 relative h-7">
                    {/* Year & quarter grid lines */}
                    {years.map((_, yi) => (
                      <React.Fragment key={yi}>
                        {/* Year boundary - solid line */}
                        <div
                          className="absolute top-0 bottom-0 border-e border-border/40"
                          style={{ right: `${(yi / years.length) * 100}%` }}
                        />
                        {/* Quarter lines - dashed */}
                        {[1, 2, 3].map(qi => (
                          <div
                            key={qi}
                            className="absolute top-0 bottom-0 border-e border-dashed border-border/20"
                            style={{ right: `${((yi * 4 + qi) / (years.length * 4)) * 100}%` }}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                    {/* Bar */}
                    <motion.div
                      className="absolute top-1 bottom-1 rounded-md flex items-center justify-center cursor-default"
                      style={{
                        ...barStyle,
                        backgroundColor: item.color,
                      }}
                      initial={{ scaleX: 0, originX: 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: Math.min(i * 0.02, 0.5) }}
                      title={item.name}
                    >
                      {parseFloat(barStyle.width) > 8 && (
                        <span className="text-[9px] text-white font-bold truncate px-1">
                          {item.startYear}–{item.endYear}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">{t('لا توجد مشاريع', 'No projects')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{t('إجمالي المشاريع المعروضة', 'Total projects shown')}</span>
        <span className="text-xl font-extrabold text-primary">{ganttData.length}</span>
      </div>
    </motion.div>
  );
}
