import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Filter } from 'lucide-react';
import { DISTRIBUTION_DATA, OVERALL_DISTRIBUTION as OVERALL, ALL_YEARS } from '@/constants/distributionData';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

interface Pillar {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
}

interface Props {
  pillars: Pillar[];
  allKPIs: any[];
}


export function AchievementDistribution({ pillars }: Props) {
  const { t, isRTL } = useLanguage();
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredPillars = useMemo(() => {
    if (selectedPillar === 'all') return pillars;
    return pillars.filter(p => p.id === selectedPillar);
  }, [pillars, selectedPillar]);

  const visibleYearIndices = useMemo(() => {
    if (selectedYear === 'all') return ALL_YEARS.map((_, i) => i);
    const idx = ALL_YEARS.indexOf(Number(selectedYear) as typeof ALL_YEARS[number]);
    return idx >= 0 ? [idx] : ALL_YEARS.map((_, i) => i);
  }, [selectedYear]);

  const visibleYears = visibleYearIndices.map(i => ALL_YEARS[i]);

  const rows = useMemo(() => {
    return filteredPillars.map(p => {
      const dist = DISTRIBUTION_DATA[p.name_ar] || [0, 0, 0, 0, 0];
      return { pillar: p, values: dist };
    });
  }, [filteredPillars]);

  const cumulativeOverall = useMemo(() => {
    const cum: number[] = [];
    OVERALL.forEach((v, i) => cum.push(i === 0 ? v : cum[i - 1] + v));
    return cum;
  }, []);

  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const showOverall = selectedPillar === 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="section-header mb-0 pb-0 after:hidden">
          <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t('توزيع نسب الإنجاز السنوية', 'Annual Achievement Distribution')}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {/* Pillar filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedPillar('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
              style={{
                backgroundColor: selectedPillar === 'all' ? 'hsl(var(--primary))' : 'transparent',
                color: selectedPillar === 'all' ? 'white' : 'hsl(var(--muted-foreground))',
                borderColor: selectedPillar === 'all' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
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
                  color: selectedPillar === p.id ? 'white' : 'hsl(var(--muted-foreground))',
                  borderColor: selectedPillar === p.id ? p.color : 'hsl(var(--border))',
                }}
              >
                {t(p.name_ar, p.name_en)}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border/60 mx-1" />

          {/* Year filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedYear('all')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
              style={{
                backgroundColor: selectedYear === 'all' ? 'hsl(var(--primary))' : 'transparent',
                color: selectedYear === 'all' ? 'white' : 'hsl(var(--muted-foreground))',
                borderColor: selectedYear === 'all' ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }}
            >
              {t('كل السنوات', 'All Years')}
            </button>
            {ALL_YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(String(y))}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
                style={{
                  backgroundColor: selectedYear === String(y) ? 'hsl(var(--primary))' : 'transparent',
                  color: selectedYear === String(y) ? 'white' : 'hsl(var(--muted-foreground))',
                  borderColor: selectedYear === String(y) ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className={`font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'} min-w-[140px]`}>
                {t('الركيزة', 'Pillar')}
              </TableHead>
              {visibleYears.map(y => (
                <TableHead key={y} className="text-center font-bold text-foreground min-w-[100px]">
                  {y}
                </TableHead>
              ))}
              {selectedYear === 'all' && (
                <TableHead className="text-center font-bold text-foreground min-w-[80px]">
                  {t('المجموع', 'Total')}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ pillar, values }) => {
              const filteredValues = visibleYearIndices.map(i => values[i]);
              const maxVal = Math.max(...filteredValues);
              const cumValues: number[] = [];
              values.forEach((v, i) => cumValues.push(i === 0 ? v : cumValues[i - 1] + v));
              const filteredCum = visibleYearIndices.map(i => cumValues[i]);

              return (
                <>
                  <TableRow key={pillar.id} className="border-b-0 hover:bg-muted/30">
                    <TableCell rowSpan={2} className={`font-semibold text-sm ${isRTL ? 'text-right' : 'text-left'} border-b border-border/30`}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pillar.color }} />
                        {t(pillar.name_ar, pillar.name_en)}
                      </div>
                    </TableCell>
                    {filteredValues.map((v, i) => {
                      const intensity = maxVal > 0 ? v / maxVal : 0;
                      return (
                        <TableCell key={i} className="text-center p-2">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-medium">{t('سنوي', 'Annual')}</span>
                            <span className="text-sm font-bold text-foreground">{formatPct(v)}</span>
                            <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden max-w-[80px]">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: pillar.color, opacity: 0.7 + intensity * 0.3 }}
                                initial={{ width: 0 }}
                                animate={{ width: `${v * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                    {selectedYear === 'all' && (
                      <TableCell className="text-center">
                        <span className="text-sm font-extrabold text-primary">100%</span>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow key={`${pillar.id}-cum`} className="border-border/30" style={{ backgroundColor: `${pillar.color}08` }}>
                    {filteredCum.map((v, i) => (
                      <TableCell key={i} className="text-center p-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-medium" style={{ color: pillar.color }}>{t('تراكمي', 'Cumulative')}</span>
                          <span className="text-sm font-bold" style={{ color: pillar.color }}>{formatPct(v)}</span>
                          <div className="w-full h-2 rounded-full overflow-hidden max-w-[80px]" style={{ backgroundColor: `${pillar.color}15` }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: pillar.color, opacity: 0.4 }}
                              initial={{ width: 0 }}
                              animate={{ width: `${v * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    {selectedYear === 'all' && (
                      <TableCell className="text-center">
                        <span className="text-sm font-extrabold" style={{ color: pillar.color }}>100%</span>
                      </TableCell>
                    )}
                  </TableRow>
                </>
              );
            })}

            {/* Overall rows */}
            {showOverall && (
              <>
                <TableRow className="border-t-2 border-primary/30 bg-primary/5">
                  <TableCell className={`font-bold text-sm text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      {t('المؤشر العام', 'Overall Index')}
                    </div>
                  </TableCell>
                  {visibleYearIndices.map(i => (
                    <TableCell key={i} className="text-center p-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-primary">{formatPct(OVERALL[i])}</span>
                        <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden max-w-[80px]">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${OVERALL[i] * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  {selectedYear === 'all' && (
                    <TableCell className="text-center">
                      <span className="text-sm font-extrabold text-primary">100%</span>
                    </TableCell>
                  )}
                </TableRow>

                <TableRow className="bg-primary/[0.03]">
                  <TableCell className={`font-bold text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('المؤشر العام التراكمي', 'Cumulative Overall')}
                  </TableCell>
                  {visibleYearIndices.map(i => (
                    <TableCell key={i} className="text-center p-2">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-foreground/70">{formatPct(cumulativeOverall[i])}</span>
                        <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden max-w-[80px]">
                          <motion.div
                            className="h-full rounded-full bg-foreground/30"
                            initial={{ width: 0 }}
                            animate={{ width: `${cumulativeOverall[i] * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  {selectedYear === 'all' && (
                    <TableCell className="text-center">
                      <span className="text-sm font-extrabold text-foreground/70">100%</span>
                    </TableCell>
                  )}
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
