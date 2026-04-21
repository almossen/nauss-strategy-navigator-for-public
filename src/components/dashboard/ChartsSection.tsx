import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FolderKanban, BarChart3 } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

interface Pillar {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
}

interface Props {
  pillars: Pillar[];
  initiatives: any[];
  allProjects: any[];
  allKPIs: any[];
  isRTL: boolean;
}

export function ChartsSection({ pillars, initiatives, allProjects, allKPIs, isRTL }: Props) {
  const { t } = useLanguage();
  const [selectedPillarProjects, setSelectedPillarProjects] = useState<string>('');
  const [selectedPillarKPIs, setSelectedPillarKPIs] = useState<string>('');

  // Pillar-level data
  const pillarProjectCounts = pillars?.map(p => ({
    name: t(p.name_ar, p.name_en),
    count: allProjects?.filter((proj: any) => proj.initiatives?.pillar_id === p.id).length || 0,
    color: p.color,
    total: allProjects?.length || 1,
  })) || [];

  const pillarKPICounts = pillars?.map(p => ({
    name: t(p.name_ar, p.name_en),
    count: allKPIs?.filter((k: any) => k.initiatives?.pillar_id === p.id).length || 0,
    color: p.color,
    total: allKPIs?.length || 1,
  })) || [];

  const totalProjects = allProjects?.length || 0;
  const totalKPIs = allKPIs?.length || 0;

  // Initiative-level data with pillar filter
  const projectByInitData = useMemo(() => {
    const pillarId = selectedPillarProjects || pillars?.[0]?.id;
    if (!pillarId) return [];
    const pillarInits = initiatives?.filter((ini: any) => ini.pillar_id === pillarId) || [];
    return pillarInits.map((ini: any) => ({
      name: t(ini.name_ar, ini.name_en),
      count: allProjects?.filter((p: any) => p.initiative_id === ini.id).length || 0,
    })).sort((a, b) => b.count - a.count);
  }, [selectedPillarProjects, pillars, initiatives, allProjects, t]);

  const kpiByInitData = useMemo(() => {
    const pillarId = selectedPillarKPIs || pillars?.[0]?.id;
    if (!pillarId) return [];
    const pillarInits = initiatives?.filter((ini: any) => ini.pillar_id === pillarId) || [];
    return pillarInits.map((ini: any) => ({
      name: t(ini.name_ar, ini.name_en),
      count: allKPIs?.filter((k: any) => k.initiative_id === ini.id).length || 0,
    })).sort((a, b) => b.count - a.count);
  }, [selectedPillarKPIs, pillars, initiatives, allKPIs, t]);

  const activePillarProjects = selectedPillarProjects || pillars?.[0]?.id || '';
  const activePillarKPIs = selectedPillarKPIs || pillars?.[0]?.id || '';
  const projectPillarColor = pillars?.find(p => p.id === activePillarProjects)?.color || 'hsl(174,42%,33%)';
  const kpiPillarColor = pillars?.find(p => p.id === activePillarKPIs)?.color || 'hsl(174,42%,33%)';

  const maxProjectByInit = Math.max(...projectByInitData.map(d => d.count), 1);
  const maxKpiByInit = Math.max(...kpiByInitData.map(d => d.count), 1);

  const PillarFilter = ({ active, onChange }: { active: string; onChange: (id: string) => void }) => (
    <div className="flex gap-1.5 flex-wrap">
      {pillars?.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
          style={{
            backgroundColor: active === p.id ? p.color : 'transparent',
            color: active === p.id ? 'white' : 'hsl(180,12%,45%)',
            borderColor: active === p.id ? p.color : 'hsl(180,10%,88%)',
          }}
        >
          {t(p.name_ar, p.name_en)}
        </button>
      ))}
    </div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
      {/* Row 1: Pillar-level — innovative visual cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Projects by Pillar */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="card-premium p-6 flex flex-col">
          <div className="section-header">
            <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-primary" />
              {t('المشاريع حسب الركيزة', 'Projects by Pillar')}
            </h2>
          </div>
          <div className="relative flex-1 flex items-center justify-center mt-2">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pillarProjectCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={145}
                    dataKey="count"
                    nameKey="name"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const item = pillarProjectCounts[index];
                      if (!item || item.count === 0) return <text></text>;
                      const pct = totalProjects > 0 ? Math.round((item.count / totalProjects) * 100) : 0;
                      return (
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="white">
                          <tspan x={x} dy="-0.4em" fontSize="16" fontWeight="800">{item.count}</tspan>
                          <tspan x={x} dy="1.3em" fontSize="10" fontWeight="600" opacity={0.85}>{pct}%</tspan>
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {pillarProjectCounts.map((item, i) => (
                      <Cell key={i} fill={item.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${value}`, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-extrabold text-primary">{totalProjects}</span>
              <span className="text-xs text-muted-foreground font-medium">{t('مشروع', 'Projects')}</span>
            </div>
          </div>
        </motion.div>

        {/* KPIs by Pillar — Proportional blocks */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="card-premium p-6 flex flex-col">
          <div className="section-header">
            <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {t('المؤشرات حسب الركيزة', 'KPIs by Pillar')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2 flex-1 content-center">
            {pillarKPICounts.map((item, i) => {
              const pct = totalKPIs > 0 ? Math.round((item.count / totalKPIs) * 100) : 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="relative rounded-xl p-5 overflow-hidden text-white flex flex-col items-center justify-center min-h-[130px]"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="absolute -top-4 -end-4 w-16 h-16 rounded-full bg-white/10" />
                  <div className="absolute -bottom-3 -start-3 w-12 h-12 rounded-full bg-white/5" />
                  
                  <p className="text-4xl font-extrabold leading-none relative z-10">{item.count}</p>
                  <p className="text-[11px] font-medium mt-1 opacity-80 relative z-10">{t('مؤشر', 'KPIs')}</p>
                  <p className="text-xs font-bold mt-2 text-center leading-tight relative z-10 opacity-90">{item.name}</p>
                  <p className="text-[10px] font-medium mt-0.5 opacity-60 relative z-10">{pct}% {t('من الإجمالي', 'of total')}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{t('الإجمالي', 'Total')}</span>
            <span className="text-xl font-extrabold text-primary">{totalKPIs}</span>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Initiative-level with pillar filter — emphasis on numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Projects by Initiative */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="card-premium p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="section-header mb-0 pb-0 after:hidden">
              <h2 className="font-bold text-foreground text-sm">{t('المشاريع حسب المبادرة', 'Projects by Initiative')}</h2>
            </div>
            <PillarFilter active={activePillarProjects} onChange={setSelectedPillarProjects} />
          </div>
          <div className="space-y-3">
            {projectByInitData.length > 0 ? projectByInitData.map((item, i) => {
              const pct = maxProjectByInit > 0 ? Math.round((item.count / maxProjectByInit) * 100) : 0;
              return (
                <div key={i} className="group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0"
                      style={{ backgroundColor: projectPillarColor }}
                    >
                      {item.count}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-1">{item.name}</p>
                      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden mt-1.5">
                        <motion.div
                          className="h-full rounded-full opacity-60"
                          style={{ backgroundColor: projectPillarColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                      {item.count} {t('مشروع', 'proj.')}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">{t('لا توجد بيانات', 'No data')}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* KPIs by Initiative */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="card-premium p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="section-header mb-0 pb-0 after:hidden">
              <h2 className="font-bold text-foreground text-sm">{t('المؤشرات حسب المبادرة', 'KPIs by Initiative')}</h2>
            </div>
            <PillarFilter active={activePillarKPIs} onChange={setSelectedPillarKPIs} />
          </div>
          <div className="space-y-3">
            {kpiByInitData.length > 0 ? kpiByInitData.map((item, i) => {
              const pct = maxKpiByInit > 0 ? Math.round((item.count / maxKpiByInit) * 100) : 0;
              return (
                <div key={i} className="group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0"
                      style={{ backgroundColor: kpiPillarColor }}
                    >
                      {item.count}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-1">{item.name}</p>
                      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden mt-1.5">
                        <motion.div
                          className="h-full rounded-full opacity-60"
                          style={{ backgroundColor: kpiPillarColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                      {item.count} {t('مؤشر', 'KPIs')}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">{t('لا توجد بيانات', 'No data')}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
