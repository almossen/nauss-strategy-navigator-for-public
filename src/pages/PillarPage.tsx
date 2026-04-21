import { useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects, useInitiatives } from '@/hooks/useStrategyData';
import { useAllKPIs, useAllStrategicGoals } from '@/hooks/useAllKPIs';
import { useKpiActuals, useAchievementSettings } from '@/hooks/useAchievementSettings';
import KeyTargetsSection from '@/components/achievements/KeyTargetsSection';
import { useTargetSettings } from '@/hooks/useTargetSettings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Rocket, CheckCircle2, TrendingUp, Calendar, Zap, Award,
  Trophy, ArrowUp, ArrowDown, AlertTriangle, BarChart3, Flag, Ruler, Download
} from 'lucide-react';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import naussLogo from '@/assets/nauss-logo.png';
import { DISTRIBUTION_DATA } from '@/constants/distributionData';

export default function PillarPage() {
  const { pillarId } = useParams<{ pillarId: string }>();
  const { t, isRTL } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: projects } = useAllProjects();
  const { data: kpis } = useAllKPIs();
  const { data: goals } = useAllStrategicGoals();
  const { data: initiatives } = useInitiatives();
  const { data: targetSettings } = useTargetSettings();
  const { data: achievementSettings } = useAchievementSettings();

  const pillar = pillars?.find(p => p.id === pillarId);

  // Filter years based on visibility settings from control panel
  const allYears = [2025, 2026, 2027, 2028, 2029];
  const targetYears = allYears.filter(year => targetSettings?.find(s => s.year === year)?.is_visible);
  const achievementYears = allYears.filter(year => {
    const setting = achievementSettings?.find(s => s.year === year);
    return !setting || setting.is_visible;
  });

  // Filter projects and KPIs for this pillar
  const pillarProjects = useMemo(() =>
    projects?.filter(p => (p as any).initiatives?.pillar_id === pillarId) || [],
    [projects, pillarId]
  );

  const pillarKPIs = useMemo(() =>
    kpis?.filter((k: any) => k.initiatives?.pillar_id === pillarId) || [],
    [kpis, pillarId]
  );

  const pillarInitiatives = useMemo(() =>
    initiatives?.filter(i => i.pillar_id === pillarId) || [],
    [initiatives, pillarId]
  );

  const pillarGoals = useMemo(() =>
    goals?.filter(g => g.pillar_id === pillarId) || [],
    [goals, pillarId]
  );

  // KPI actuals for all years
  const { data: actuals2025 } = useKpiActuals(2025);
  const { data: actuals2026 } = useKpiActuals(2026);
  const { data: actuals2027 } = useKpiActuals(2027);
  const { data: actuals2028 } = useKpiActuals(2028);
  const { data: actuals2029 } = useKpiActuals(2029);

  const allActuals = useMemo(() => {
    const map: Record<number, Record<string, string>> = {};
    [
      { year: 2025, data: actuals2025 },
      { year: 2026, data: actuals2026 },
      { year: 2027, data: actuals2027 },
      { year: 2028, data: actuals2028 },
      { year: 2029, data: actuals2029 },
    ].forEach(({ year, data }) => {
      map[year] = {};
      data?.forEach(a => { map[year][a.kpi_id] = a.actual_value; });
    });
    return map;
  }, [actuals2025, actuals2026, actuals2027, actuals2028, actuals2029]);

  if (!pillar) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-lg">{t('جارٍ التحميل...', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 px-6" style={{
        background: `linear-gradient(135deg, ${pillar.color} 0%, ${pillar.color}dd 50%, ${pillar.color}bb 100%)`
      }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `hsla(0, 0%, 100%, ${Math.random() * 0.2 + 0.05})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ background: 'hsla(0,0%,100%,0.15)', border: '1px solid hsla(0,0%,100%,0.2)' }}
          >
            <Target className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-3"
          >
            {t(pillar.name_ar, pillar.name_en)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/70 max-w-2xl mx-auto mb-8"
          >
            {t(pillar.description_ar, pillar.description_en)}
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: t('الأهداف الاستراتيجية', 'Strategic Goals'), value: pillarGoals.length, icon: Flag },
              { label: t('المبادرات', 'Initiatives'), value: pillarInitiatives.length, icon: Zap },
              { label: t('المشاريع', 'Projects'), value: pillarProjects.length, icon: Rocket },
              { label: t('مؤشرات الأداء', 'KPIs'), value: pillarKPIs.length, icon: Target },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-xl text-center"
                style={{ background: 'hsla(0,0%,100%,0.1)', border: '1px solid hsla(0,0%,100%,0.15)' }}
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-10 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="targets" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <TabsTrigger value="targets" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('المستهدفات', 'Targets')}
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {t('المنجزات', 'Achievements')}
              </TabsTrigger>
            </TabsList>

            {/* Targets Tab */}
            <TabsContent value="targets">
              <TargetsTab
                pillar={pillar}
                projects={pillarProjects}
                kpis={pillarKPIs}
                years={targetYears}
                isRTL={isRTL}
                t={t}
              />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <AchievementsTab
                pillar={pillar}
                projects={pillarProjects}
                kpis={pillarKPIs}
                allActuals={allActuals}
                years={achievementYears}
                achievementSettings={achievementSettings}
                isRTL={isRTL}
                t={t}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

// ---- Targets Tab ----
function TargetsTab({ pillar, projects, kpis, years, isRTL, t }: any) {
  const [activeYear, setActiveYear] = useState(2025);
  const targetField = `target_${activeYear}`;
  const targetsRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    if (!targetsRef.current || exporting) return;
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    try {
      const clone = targetsRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '1100px';
      clone.style.direction = 'rtl';
      clone.style.unicodeBidi = 'plaintext';
      clone.style.background = 'white';
      clone.style.padding = '24px';
      clone.style.color = '#1a1a1a';

      const header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 0 20px;border-bottom:2px solid #2e6066;margin-bottom:24px;direction:rtl;';
      header.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;">
          <img src="${naussLogo}" style="height:50px;object-fit:contain;" />
          <div>
            <div style="font-size:20px;font-weight:800;color:#2e6066;font-family:Tajawal,sans-serif;">${t(pillar.name_ar, pillar.name_en)}</div>
            <div style="font-size:12px;color:#666;font-family:Tajawal,sans-serif;">${t('تقرير المستهدفات', 'Targets Report')} - ${activeYear}</div>
          </div>
        </div>
        <div style="text-align:left;font-size:10px;color:#999;font-family:Tajawal,sans-serif;">
          ${t('مكتب الاستراتيجية والتحول', 'Office of Strategy & Transformation')}
        </div>
      `;
      clone.insertBefore(header, clone.firstChild);

      clone.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.animation = 'none';
        htmlEl.style.transition = 'none';
        if (htmlEl.style.opacity === '0') htmlEl.style.opacity = '1';
        if (htmlEl.style.transform) htmlEl.style.transform = 'none';
      });

      clone.querySelectorAll('.grid').forEach(el => {
        (el as HTMLElement).style.gridTemplateColumns = '1fr';
        (el as HTMLElement).style.display = 'grid';
        (el as HTMLElement).style.gap = '12px';
      });

      clone.querySelectorAll('[style*="height: 0"], .overflow-hidden').forEach(el => {
        (el as HTMLElement).style.height = 'auto';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.overflow = 'visible';
      });

      const footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 0 0;border-top:2px solid #2e6066;margin-top:32px;direction:rtl;';
      footer.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${naussLogo}" style="height:36px;object-fit:contain;" />
          <div style="font-size:11px;color:#2e6066;font-weight:700;font-family:Tajawal,sans-serif;">
            مكتب الاستراتيجية والتحول
          </div>
        </div>
        <div style="font-size:14px;font-weight:800;color:#2e6066;font-family:Inter,sans-serif;letter-spacing:2px;">
          NAUSS2029
        </div>
      `;
      clone.appendChild(footer);

      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 600));

      const sections = Array.from(clone.children) as HTMLElement[];
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 190;
      const pdfPageHeight = 277;
      let currentY = 10;
      let firstPage = true;

      for (const section of sections) {
        const sectionCanvas = await html2canvas(section, {
          scale: 2, useCORS: true, allowTaint: true,
          backgroundColor: '#ffffff', width: 1100, windowWidth: 1100,
        });
        const sectionImgData = sectionCanvas.toDataURL('image/png');
        const sectionHeight = (sectionCanvas.height * pdfWidth) / sectionCanvas.width;

        if (!firstPage && currentY + sectionHeight > pdfPageHeight) {
          pdf.addPage();
          currentY = 10;
        }

        if (sectionHeight > pdfPageHeight - 10) {
          if (currentY > 10) { pdf.addPage(); currentY = 10; }
          let remainingHeight = sectionHeight;
          let sourceY = 0;
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = sectionCanvas.width;
          const ctx = pageCanvas.getContext('2d')!;
          while (remainingHeight > 0) {
            const sliceHeight = Math.min(remainingHeight, pdfPageHeight - 10);
            const sliceCanvasHeight = (sliceHeight / pdfWidth) * sectionCanvas.width;
            pageCanvas.height = sliceCanvasHeight;
            ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(sectionCanvas, 0, sourceY, sectionCanvas.width, sliceCanvasHeight, 0, 0, sectionCanvas.width, sliceCanvasHeight);
            const pageImgData = pageCanvas.toDataURL('image/png');
            if (sourceY > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'PNG', 10, 10, pdfWidth, sliceHeight);
            sourceY += sliceCanvasHeight;
            remainingHeight -= sliceHeight;
          }
          currentY = pdfPageHeight;
        } else {
          pdf.addImage(sectionImgData, 'PNG', 10, currentY, pdfWidth, sectionHeight);
          currentY += sectionHeight + 4;
        }
        firstPage = false;
      }

      document.body.removeChild(clone);
      const pillarName = t(pillar.name_ar, pillar.name_en).slice(0, 20);
      pdf.save(`${pillarName}-${t('مستهدفات', 'Targets')}-${activeYear}.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
    }
  }, [exporting, pillar, activeYear, t]);

  const projectsForYear = useMemo(() => projects.filter((p: any) => {
    const sy = p.start_date ? parseInt(p.start_date.substring(0, 4)) : null;
    const ey = p.end_date ? parseInt(p.end_date.substring(0, 4)) : null;
    if (sy && ey) return sy <= activeYear && ey >= activeYear;
    if (sy) return sy <= activeYear;
    if (ey) return ey >= activeYear;
    return false;
  }), [projects, activeYear]);

  const kpisForYear = useMemo(() => kpis.filter((k: any) => {
    const val = k[targetField];
    return val && val !== '' && val !== '0' && val !== '-';
  }), [kpis, targetField]);

  return (
    <div className="space-y-8">
      {/* PDF Export Button - outside ref so it's NOT captured */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-wait border"
          style={{
            borderColor: `${pillar.color}40`,
            color: pillar.color,
            background: `${pillar.color}08`,
          }}
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? t('جاري التصدير...', 'Exporting...') : t('طباعة PDF', 'Print PDF')}
        </button>
      </div>

      <div ref={targetsRef} className="space-y-8">
      {/* Year Selector */}
      <div className="flex flex-wrap justify-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
        {years.map((year: number) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2"
            style={{
              borderColor: activeYear === year ? pillar.color : 'transparent',
              background: activeYear === year ? `${pillar.color}15` : 'hsl(var(--muted))',
              color: activeYear === year ? pillar.color : 'hsl(var(--muted-foreground))',
            }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="p-4 rounded-xl border text-center" style={{ borderColor: `${pillar.color}30` }}>
          <Rocket className="h-6 w-6 mx-auto mb-2" style={{ color: pillar.color }} />
          <div className="text-2xl font-bold" style={{ color: pillar.color }}>{projectsForYear.length}</div>
          <p className="text-xs text-muted-foreground">{t('مشروع نشط', 'Active Projects')}</p>
        </div>
        <div className="p-4 rounded-xl border text-center" style={{ borderColor: `${pillar.color}30` }}>
          <Target className="h-6 w-6 mx-auto mb-2" style={{ color: pillar.color }} />
          <div className="text-2xl font-bold" style={{ color: pillar.color }}>{kpisForYear.length}</div>
          <p className="text-xs text-muted-foreground">{t('مؤشر مستهدف', 'Target KPIs')}</p>
        </div>
      </div>

      {/* Projects */}
      {projectsForYear.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <Rocket className="h-5 w-5" style={{ color: pillar.color }} />
            {t('المشاريع المستهدفة', 'Target Projects')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectsForYear.map((proj: any, i: number) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-3 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow ${isRTL ? 'flex-row' : 'flex-row'}`}
              >
                <Zap className="h-5 w-5 mt-0.5 shrink-0" style={{ color: pillar.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t(proj.name_ar, proj.name_en)}</p>
                  {proj.outputs_ar && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t(proj.outputs_ar, proj.outputs_en)}</p>
                  )}
                  {proj.start_date && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-2">
                      <Calendar className="h-3 w-3" />
                      {proj.start_date} → {proj.end_date || '...'}
                    </span>
                  )}
                </div>
                {proj.weight > 0 && (
                  <span className="text-[10px] px-2 py-1 rounded-full font-bold shrink-0" style={{ background: `${pillar.color}15`, color: pillar.color }}>
                    {Number(proj.weight).toFixed(1)}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs */}
      {kpisForYear.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <Target className="h-5 w-5" style={{ color: pillar.color }} />
            {t('مؤشرات الأداء المستهدفة', 'Target KPIs')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {kpisForYear.map((kpi: any, i: number) => (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 rounded-xl border"
                style={{ borderColor: `${pillar.color}30`, background: `${pillar.color}05` }}
              >
                <p className="text-sm font-medium text-foreground mb-3">{t(kpi.name_ar, kpi.name_en)}</p>
                <div className="text-center p-3 rounded-lg" style={{ background: `${pillar.color}10` }}>
                  <p className="text-[10px] text-muted-foreground mb-0.5">{t('المستهدف', 'Target')}</p>
                  <p className="text-2xl font-bold" style={{ color: pillar.color }}>{(() => {
                    const v = kpi[targetField];
                    const isPct = (kpi.unit || '').includes('نسبة') || (kpi.unit || '').toLowerCase().includes('percent') || (kpi.unit || '').includes('%');
                    const n = parseFloat(String(v ?? '').replace(/[^\d.,-]/g, ''));
                    if (isPct && !isNaN(n)) return `${(n <= 1 ? n * 100 : n).toFixed(1)}%`;
                    return v;
                  })()}</p>
                </div>
                {kpi.unit && <p className="text-[10px] text-muted-foreground mt-2 text-center">{kpi.unit}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {projectsForYear.length === 0 && kpisForYear.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          {t('لا توجد مستهدفات لهذا العام', 'No targets for this year')}
        </div>
      )}
      </div>
    </div>
  );
}

// ---- Achievements Tab ----
function AchievementsTab({ pillar, projects, kpis, allActuals, years, achievementSettings, isRTL, t }: any) {
  const [activeYear, setActiveYear] = useState(2025);
  const targetField = `target_${activeYear}`;
  const actualsMap = allActuals[activeYear] || {};
  const achRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);

  const normalizeStatus = (status?: string) => {
    if (status === 'in_progress' || status === 'planned') return 'launched';
    return status || 'launched';
  };

  const projectsForYear = useMemo(() => projects.filter((p: any) =>
    (p.end_date && p.end_date.startsWith(String(activeYear))) ||
    (p.start_date && p.start_date.startsWith(String(activeYear)))
  ), [projects, activeYear]);

  const completed = projectsForYear.filter((p: any) => normalizeStatus(p.status) === 'completed');
  const launched = projectsForYear.filter((p: any) => normalizeStatus(p.status) === 'launched');
  const delayed = projectsForYear.filter((p: any) => normalizeStatus(p.status) === 'delayed');

  const kpisForYear = useMemo(() => kpis.filter((k: any) => {
    const val = k[targetField];
    return val && val !== '' && val !== '0' && val !== '-';
  }), [kpis, targetField]);

  const isKpiAchieved = (kpi: any) => {
    const actual = actualsMap[kpi.id] || '';
    if (!actual) return false;
    const numTarget = parseFloat(kpi[targetField]);
    const numActual = parseFloat(actual);
    return !isNaN(numActual) && !isNaN(numTarget) && numActual >= numTarget;
  };

  const achievedKPIs = kpisForYear.filter(isKpiAchieved);
  const notAchievedKPIs = kpisForYear.filter((k: any) => !isKpiAchieved(k));

  const handleExportPDF = useCallback(async () => {
    if (!achRef.current || exporting) return;
    setExporting(true);
    setPdfMode(true);
    // Wait for React to re-render with forceExpanded
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
      // Clone the content area (excluding the button which is outside achRef)
      const clone = achRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '1100px';
      clone.style.direction = 'rtl';
      clone.style.unicodeBidi = 'plaintext';
      clone.style.background = 'white';
      clone.style.padding = '24px';
      clone.style.color = '#1a1a1a';

      // Inject PDF header with logo + pillar name
      const header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 0 20px;border-bottom:2px solid #2e6066;margin-bottom:24px;direction:rtl;';
      header.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;">
          <img src="${naussLogo}" style="height:50px;object-fit:contain;" />
          <div>
            <div style="font-size:20px;font-weight:800;color:#2e6066;font-family:Tajawal,sans-serif;">${t(pillar.name_ar, pillar.name_en)}</div>
            <div style="font-size:12px;color:#666;font-family:Tajawal,sans-serif;">${t('تقرير المنجزات', 'Achievements Report')} - ${activeYear}</div>
          </div>
        </div>
        <div style="text-align:left;font-size:10px;color:#999;font-family:Tajawal,sans-serif;">
          ${t('مكتب الاستراتيجية والتحول', 'Office of Strategy & Transformation')}
        </div>
      `;
      clone.insertBefore(header, clone.firstChild);

      // Remove animations, make all visible
      clone.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.animation = 'none';
        htmlEl.style.transition = 'none';
        if (htmlEl.style.opacity === '0') htmlEl.style.opacity = '1';
        if (htmlEl.style.transform) htmlEl.style.transform = 'none';
      });

      // Force grid to single column for better PDF layout
      clone.querySelectorAll('.grid').forEach(el => {
        (el as HTMLElement).style.gridTemplateColumns = '1fr';
        (el as HTMLElement).style.display = 'grid';
        (el as HTMLElement).style.gap = '12px';
      });

      // Force all collapsed accordion/expandable sections open for PDF
      clone.querySelectorAll('[style*="height: 0"], .overflow-hidden').forEach(el => {
        (el as HTMLElement).style.height = 'auto';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.overflow = 'visible';
      });

      // Inject PDF footer with logo + office name + NAUSS2029
      const footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 0 0;border-top:2px solid #2e6066;margin-top:32px;direction:rtl;';
      footer.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${naussLogo}" style="height:36px;object-fit:contain;" />
          <div style="font-size:11px;color:#2e6066;font-weight:700;font-family:Tajawal,sans-serif;">
            مكتب الاستراتيجية والتحول
          </div>
        </div>
        <div style="font-size:14px;font-weight:800;color:#2e6066;font-family:Inter,sans-serif;letter-spacing:2px;">
          NAUSS2029
        </div>
      `;
      clone.appendChild(footer);

      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Capture individual sections to avoid card splitting
      const sections = Array.from(clone.children) as HTMLElement[];
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 190;
      const pdfPageHeight = 277;
      let currentY = 10;
      let firstPage = true;

      for (const section of sections) {
        const sectionCanvas = await html2canvas(section, {
          scale: 2, useCORS: true, allowTaint: true,
          backgroundColor: '#ffffff', width: 1100, windowWidth: 1100,
        });

        const sectionImgData = sectionCanvas.toDataURL('image/png');
        const sectionHeight = (sectionCanvas.height * pdfWidth) / sectionCanvas.width;

        // If this section won't fit on current page, start a new page
        if (!firstPage && currentY + sectionHeight > pdfPageHeight) {
          pdf.addPage();
          currentY = 10;
        }

        // If section itself is taller than a page, fall back to slicing
        if (sectionHeight > pdfPageHeight - 10) {
          if (currentY > 10) { pdf.addPage(); currentY = 10; }
          let remainingHeight = sectionHeight;
          let sourceY = 0;
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = sectionCanvas.width;
          const ctx = pageCanvas.getContext('2d')!;
          while (remainingHeight > 0) {
            const sliceHeight = Math.min(remainingHeight, pdfPageHeight - 10);
            const sliceCanvasHeight = (sliceHeight / pdfWidth) * sectionCanvas.width;
            pageCanvas.height = sliceCanvasHeight;
            ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(sectionCanvas, 0, sourceY, sectionCanvas.width, sliceCanvasHeight, 0, 0, sectionCanvas.width, sliceCanvasHeight);
            const pageImgData = pageCanvas.toDataURL('image/png');
            if (sourceY > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'PNG', 10, 10, pdfWidth, sliceHeight);
            sourceY += sliceCanvasHeight;
            remainingHeight -= sliceHeight;
          }
          currentY = pdfPageHeight; // Force new page for next section
        } else {
          pdf.addImage(sectionImgData, 'PNG', 10, currentY, pdfWidth, sectionHeight);
          currentY += sectionHeight + 4;
        }
        firstPage = false;
      }

      document.body.removeChild(clone);

      const pillarName = t(pillar.name_ar, pillar.name_en).slice(0, 20);
      pdf.save(`${pillarName}-${t('منجزات', 'Achievements')}-${activeYear}.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
      setPdfMode(false);
    }
  }, [achRef, exporting, pillar, activeYear, t]);

  return (
    <div className="space-y-8">
      {/* PDF Export Button - outside achRef so it's NOT captured */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-wait border"
          style={{
            borderColor: `${pillar.color}40`,
            color: pillar.color,
            background: `${pillar.color}08`,
          }}
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? t('جاري التصدير...', 'Exporting...') : t('طباعة PDF', 'Print PDF')}
        </button>
      </div>

      {/* Content area captured for PDF */}
      <div ref={achRef} className="space-y-8">
      {/* Year Selector */}
      <div className="flex flex-wrap justify-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
        {years.map((year: number) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2"
            style={{
              borderColor: activeYear === year ? pillar.color : 'transparent',
              background: activeYear === year ? `${pillar.color}15` : 'hsl(var(--muted))',
              color: activeYear === year ? pillar.color : 'hsl(var(--muted-foreground))',
            }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Achievement Progress */}
      {(() => {
        // Data imported from shared constants
        const yearIdx = activeYear - 2025;
        const annualTarget = DISTRIBUTION_DATA[pillar.name_ar]?.[yearIdx] ?? 0;
        const completedWeightPct = completed.reduce((sum: number, p: any) => sum + (parseFloat(p.weight) || 0), 0);
        const isAchieved = annualTarget > 0 && completedWeightPct >= annualTarget * 100;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-5 rounded-2xl border bg-card"
            style={{ borderColor: `${pillar.color}30` }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <Trophy className="h-5 w-5" style={{ color: pillar.color }} />
              <h3 className="text-sm font-bold text-foreground">
                {t('نسبة الإنجاز', 'Achievement Rate')} - {activeYear}
              </h3>
            </div>

            <div className="flex items-stretch gap-4">
              {/* المستهدف السنوي - Annual Target */}
              <div className="flex-1 p-4 rounded-xl text-center border-2 border-dashed" style={{ borderColor: `${pillar.color}40`, background: `${pillar.color}05` }}>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Target className="h-4 w-4" style={{ color: pillar.color }} />
                  <span className="text-xs font-semibold text-muted-foreground">{t('المستهدف السنوي', 'Annual Target')}</span>
                </div>
                <span className="text-3xl font-extrabold" style={{ color: pillar.color }}>{(annualTarget * 100).toFixed(1)}%</span>
              </div>

              {/* المتحقق - Achieved */}
              <div className="flex-1 p-4 rounded-xl text-center" style={{ background: `${pillar.color}08` }}>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: pillar.color }} />
                  <span className="text-xs font-semibold text-muted-foreground">{t('المتحقق (أوزان المشاريع المكتملة)', 'Achieved (Completed Projects Weight)')}</span>
                </div>
                <span className="text-3xl font-extrabold" style={{ color: pillar.color }}>{completedWeightPct.toFixed(1)}%</span>
              </div>

              {/* نسبة المتحقق من المستهدف */}
              {(() => {
                const achievementOfTarget = annualTarget > 0 ? Math.min((completedWeightPct / (annualTarget * 100)) * 100, 100) : 0;
                const achColor = isAchieved ? '#4ade80' : pillar.color;
                return (
                  <div className="flex-1 p-4 rounded-xl text-center border-2" style={{ borderColor: `${achColor}40`, background: `${achColor}10` }}>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Trophy className="h-4 w-4" style={{ color: achColor }} />
                      <span className="text-xs font-semibold text-muted-foreground">{t('نسبة المتحقق من المستهدف', '% of Target Achieved')}</span>
                    </div>
                    <span className="text-3xl font-extrabold" style={{ color: achColor }}>{achievementOfTarget.toFixed(1)}%</span>
                  </div>
                );
              })()}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: `${pillar.color}15` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: isAchieved ? '#4ade80' : pillar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${annualTarget > 0 ? Math.min((completedWeightPct / (annualTarget * 100)) * 100, 100) : 0}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-[10px] text-center mt-1.5 font-semibold" style={{ color: isAchieved ? '#4ade80' : 'hsl(var(--muted-foreground))' }}>
                {isAchieved ? t('✓ تم تحقيق المستهدف', '✓ Target Achieved') : t(`متبقي ${((annualTarget * 100) - completedWeightPct).toFixed(1)}% لتحقيق المستهدف`, `${((annualTarget * 100) - completedWeightPct).toFixed(1)}% remaining to reach target`)}
              </p>
            </div>

            {/* Project status breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl text-center" style={{ background: '#4ade8015', border: '1px solid #4ade8030' }}>
                <CheckCircle2 className="h-4 w-4 mx-auto mb-1" style={{ color: '#4ade80' }} />
                <span className="text-xl font-bold" style={{ color: '#4ade80' }}>{completed.length}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('مشروع مكتمل', 'Completed')}</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b30' }}>
                <TrendingUp className="h-4 w-4 mx-auto mb-1" style={{ color: '#f59e0b' }} />
                <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>{launched.length}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('مشروع منطلق', 'In Progress')}</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444430' }}>
                <AlertTriangle className="h-4 w-4 mx-auto mb-1" style={{ color: '#ef4444' }} />
                <span className="text-xl font-bold" style={{ color: '#ef4444' }}>{delayed.length}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('مشروع متأخر', 'Delayed')}</p>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* KPI Performance Box */}
      {(() => {
        const totalKPIs = kpisForYear.length;
        if (totalKPIs === 0) return null;
        const weightPerKPI = 100 / totalKPIs;
        let totalScore = 0;
        kpisForYear.forEach((kpi: any) => {
          const actual = parseFloat(actualsMap[kpi.id] || '0');
          const target = parseFloat(kpi[targetField] || '0');
          if (target > 0) {
            const ratio = Math.min(actual / target, 1);
            totalScore += ratio * weightPerKPI;
          }
        });
        const kpiPerformance = totalScore;
        
        // Classify KPIs into 3 categories
        const fullyAchieved = kpisForYear.filter((k: any) => {
          const actual = parseFloat(actualsMap[k.id] || '0');
          const target = parseFloat(k[targetField] || '0');
          return target > 0 && actual >= target;
        }).length;
        const partiallyAchieved = kpisForYear.filter((k: any) => {
          const actual = parseFloat(actualsMap[k.id] || '0');
          const target = parseFloat(k[targetField] || '0');
          return actual > 0 && target > 0 && actual < target;
        }).length;
        const notStarted = totalKPIs - fullyAchieved - partiallyAchieved;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-5 rounded-2xl border bg-card"
            style={{ borderColor: `${pillar.color}30` }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5" style={{ color: pillar.color }} />
              <h3 className="text-sm font-bold text-foreground">
                {t('أداء مؤشرات الأداء', 'KPI Performance')} - {activeYear}
              </h3>
            </div>

            <div className="flex items-stretch gap-4">
              {/* عدد المؤشرات */}
              <div className="flex-1 p-4 rounded-xl text-center border-2 border-dashed" style={{ borderColor: `${pillar.color}40`, background: `${pillar.color}05` }}>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Ruler className="h-4 w-4" style={{ color: pillar.color }} />
                  <span className="text-xs font-semibold text-muted-foreground">{t('عدد المؤشرات', 'Total KPIs')}</span>
                </div>
                <span className="text-3xl font-extrabold" style={{ color: pillar.color }}>{totalKPIs}</span>
                <p className="text-[10px] text-muted-foreground mt-1">{t(`وزن كل مؤشر: ${weightPerKPI.toFixed(1)}%`, `Each KPI weight: ${weightPerKPI.toFixed(1)}%`)}</p>
              </div>

              {/* نسبة الأداء */}
              <div className="flex-1 p-4 rounded-xl text-center" style={{ background: `${pillar.color}08` }}>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4" style={{ color: pillar.color }} />
                  <span className="text-xs font-semibold text-muted-foreground">{t('نسبة أداء المؤشرات', 'KPI Performance Rate')}</span>
                </div>
                <span className="text-3xl font-extrabold" style={{ color: kpiPerformance >= 100 ? '#4ade80' : pillar.color }}>{kpiPerformance.toFixed(1)}%</span>
              </div>
            </div>

            {/* Three categories */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl text-center" style={{ background: '#4ade8015', border: '1px solid #4ade8030' }}>
                <CheckCircle2 className="h-4 w-4 mx-auto mb-1" style={{ color: '#4ade80' }} />
                <span className="text-xl font-bold" style={{ color: '#4ade80' }}>{fullyAchieved}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('محقق بالكامل', 'Fully Achieved')}</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b30' }}>
                <TrendingUp className="h-4 w-4 mx-auto mb-1" style={{ color: '#f59e0b' }} />
                <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>{partiallyAchieved}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('محقق جزئياً', 'Partially Achieved')}</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444430' }}>
                <AlertTriangle className="h-4 w-4 mx-auto mb-1" style={{ color: '#ef4444' }} />
                <span className="text-xl font-bold" style={{ color: '#ef4444' }}>{notStarted}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t('لم يبدأ بعد', 'Not Started')}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: `${pillar.color}15` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: kpiPerformance >= 100 ? '#4ade80' : pillar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(kpiPerformance, 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-[10px] text-center mt-1.5 font-semibold" style={{ color: kpiPerformance >= 100 ? '#4ade80' : 'hsl(var(--muted-foreground))' }}>
                {kpiPerformance >= 100 ? t('✓ تم تحقيق جميع المؤشرات', '✓ All KPIs Achieved') : t(`متبقي ${(100 - kpiPerformance).toFixed(1)}% لتحقيق كامل المؤشرات`, `${(100 - kpiPerformance).toFixed(1)}% remaining`)}
              </p>
            </div>
          </motion.div>
        );
      })()}

      {/* Key Targets Section */}
      <KeyTargetsSection
        kpis={kpisForYear}
        actualsMap={actualsMap}
        activeYear={activeYear}
        pillarColor={pillar.color}
        forceExpanded={pdfMode}
      />

      {/* Projects by Status */}
      {[
        { title: t('المشاريع المكتملة', 'Completed Projects'), items: completed, icon: CheckCircle2, color: '#4ade80' },
        { title: t('المشاريع المنطلقة', 'Launched Projects'), items: launched, icon: Rocket, color: '#60a5fa' },
        { title: t('المشاريع المتأخرة', 'Delayed Projects'), items: delayed, icon: AlertTriangle, color: '#ef4444' },
      ].filter(g => g.items.length > 0).map((group, gi) => (
        <div key={gi}>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <group.icon className="h-5 w-5" style={{ color: group.color }} />
            {group.title}
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${group.color}15`, color: group.color }}>
              {group.items.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.items.map((proj: any, i: number) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 p-4 rounded-xl border bg-card"
              >
                <group.icon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: group.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t(proj.name_ar, proj.name_en)}</p>
                  {(proj.start_date || proj.end_date) && (
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1" dir={isRTL ? 'rtl' : 'ltr'}>
                      <Calendar className="h-3 w-3" />
                      {proj.start_date && new Date(proj.start_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short' })}
                      {proj.start_date && proj.end_date && ' - '}
                      {proj.end_date && new Date(proj.end_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  {proj.outputs_ar && (
                    <p className="text-xs text-muted-foreground mt-1">{t(proj.outputs_ar, proj.outputs_en)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* KPIs */}
      {kpisForYear.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <BarChart3 className="h-5 w-5" style={{ color: pillar.color }} />
            {t('مؤشرات الأداء', 'KPIs')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {kpisForYear.map((kpi: any, i: number) => {
              const target = kpi[targetField];
              const actual = actualsMap[kpi.id] || '';
              const achieved = isKpiAchieved(kpi);
              const unitStr = (kpi.unit || '').toString();
              const isPct = unitStr.includes('نسبة') || unitStr.includes('%') || unitStr.toLowerCase().includes('percent');
              const fmtVal = (v: string) => {
                if (!v) return v;
                const n = parseFloat(String(v).replace(/[^\d.,-]/g, ''));
                if (isNaN(n)) return v;
                if (isPct) return `${(n <= 1 ? n * 100 : n).toFixed(1)}%`;
                return v.toString().includes(' ') || /[a-zA-Z]/.test(v.toString()) ? v : String(n);
              };
              return (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border flex flex-col"
                  style={{ borderColor: achieved ? '#4ade8030' : `${pillar.color}30` }}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t(kpi.name_ar, kpi.name_en)}</p>
                    {kpi.unit && (
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        {t('وحدة القياس:', 'Unit:')} {kpi.unit}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-center px-3 py-2 rounded-lg bg-muted flex-1">
                        <p className="text-[10px] text-muted-foreground">{t('المستهدف', 'Target')}</p>
                        <p className="text-lg font-bold" style={{ color: pillar.color }}>{fmtVal(target)}</p>
                      </div>
                      <div className="text-center px-3 py-2 rounded-lg flex-1" style={{ background: achieved ? '#4ade8015' : '#ef444415' }}>
                        <p className="text-[10px] text-muted-foreground">{t('المتحقق', 'Actual')}</p>
                        <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: achieved ? '#4ade80' : '#ef4444' }}>
                          {fmtVal(actual) || '-'}
                          {actual && target && parseFloat(String(actual)) > parseFloat(String(target)) && (
                            <ArrowUp className="h-4 w-4" style={{ color: '#4ade80' }} />
                          )}
                          {actual && target && parseFloat(String(actual)) < parseFloat(String(target)) && (
                            <ArrowDown className="h-4 w-4" style={{ color: '#ef4444' }} />
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-center px-3 py-2 rounded-lg bg-muted/50 border border-border/50 mt-2">
                      <p className="text-[10px] text-muted-foreground">{t('المستهدف النهائي 2029', 'Final Target 2029')}</p>
                      <p className="text-sm font-bold text-foreground">{fmtVal((kpi.target_2029 && kpi.target_2029 !== '-') ? kpi.target_2029 : (kpi.final_target && kpi.final_target !== '-' ? kpi.final_target : '100%'))}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {projectsForYear.length === 0 && kpisForYear.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          {t('لا توجد منجزات لهذا العام', 'No achievements for this year')}
        </div>
      )}
      </div>{/* close achRef */}
    </div>
  );
}
