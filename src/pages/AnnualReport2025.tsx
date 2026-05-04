import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePillars, useAllProjects, useUniversityInfo, useInitiatives } from '@/hooks/useStrategyData';
import { useAllKPIs, useAllStrategicGoals } from '@/hooks/useAllKPIs';
import { useAchievementSettingByYear, useKpiActuals } from '@/hooks/useAchievementSettings';
import { DISTRIBUTION_DATA, OVERALL_DISTRIBUTION } from '@/constants/distributionData';
import { Button } from '@/components/ui/button';
import { StrategicMap } from '@/components/dashboard/StrategicMap';
import {
  Printer, CheckCircle2, Clock, AlertTriangle, Target, TrendingUp, TrendingDown,
  Trophy, Sparkles, BarChart3, Building2, Eye, Compass, Heart, FileText, BookOpen, Map
} from 'lucide-react';

const YEAR = 2025;

export default function AnnualReport2025() {
  const { t, isRTL, language } = useLanguage();
  const { data: pillars } = usePillars();
  const { data: projects } = useAllProjects();
  const { data: kpis } = useAllKPIs();
  const { data: goals } = useAllStrategicGoals();
  const { data: initiatives } = useInitiatives();
  const { data: settings } = useAchievementSettingByYear(YEAR);
  const { data: kpiActuals } = useKpiActuals(YEAR);
  const { data: uni } = useUniversityInfo();

  // Hide layout chrome for print mode
  useEffect(() => {
    document.body.classList.add('report-print-mode');
    return () => document.body.classList.remove('report-print-mode');
  }, []);

  const normalize = (s?: string) => (s === 'in_progress' || s === 'planned' ? 'launched' : s || 'launched');

  const projectsForYear = useMemo(() => (
    projects?.filter(p => (p.end_date && p.end_date.startsWith('2025')) || (p.start_date && p.start_date.startsWith('2025'))) || []
  ), [projects]);

  const completed = projectsForYear.filter(p => normalize(p.status) === 'completed');
  const launched = projectsForYear.filter(p => normalize(p.status) === 'launched');
  const delayed = projectsForYear.filter(p => normalize(p.status) === 'delayed');
  const kpis2025 = kpis?.filter(k => k.target_2025 && !['', '0', '-'].includes(k.target_2025)) || [];

  const actualsMap = useMemo(() => {
    const m: Record<string, string> = {};
    kpiActuals?.forEach(a => { m[a.kpi_id] = a.actual_value; });
    return m;
  }, [kpiActuals]);

  const kpiAchievementPct = (kpi: any) => {
    const a = parseFloat(actualsMap[kpi.id] || '0');
    const tgt = parseFloat(kpi.target_2025 || '0');
    if (!tgt || isNaN(a) || isNaN(tgt)) return 0;
    return Math.min((a / tgt) * 100, 200);
  };
  const isKpiAchieved = (kpi: any) => kpiAchievementPct(kpi) >= 100;

  const pillarStats = (pillars || []).map(pillar => {
    const pComp = completed.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pLaun = launched.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pDel = delayed.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pAll = projectsForYear.filter(p => (p as any).initiatives?.pillar_id === pillar.id);
    const pKPIs = kpis2025.filter(k => (k as any).initiatives?.pillar_id === pillar.id);
    const achieved = pKPIs.filter(isKpiAchieved);

    const yearIdx = 0;
    const annualTarget = DISTRIBUTION_DATA[pillar.name_ar]?.[yearIdx] ?? 0;
    const completedWeightPct = pComp.reduce((s: number, p: any) => s + (parseFloat(p.weight) || 0), 0);
    const projectsAchievement = annualTarget > 0
      ? Math.min((completedWeightPct / (annualTarget * 100)) * 100, 100)
      : 0;

    let kpiScore = 0;
    if (pKPIs.length > 0) {
      const w = 100 / pKPIs.length;
      pKPIs.forEach((k: any) => {
        const a = parseFloat(actualsMap[k.id] || '0');
        const tgt = parseFloat(k.target_2025 || '0');
        if (tgt > 0) kpiScore += Math.min(a / tgt, 1) * w;
      });
    }

    return {
      pillar, completed: pComp, launched: pLaun, delayed: pDel, all: pAll,
      kpis: pKPIs, achievedKPIs: achieved,
      projectsAchievement: Math.round(projectsAchievement),
      kpiScore: Math.round(kpiScore),
    };
  }).filter(s => s.all.length > 0 || s.kpis.length > 0);

  const totalKPIsAchieved = pillarStats.reduce((s, ps) => s + ps.achievedKPIs.length, 0);
  const totalKPIsNotAchieved = kpis2025.length - totalKPIsAchieved;

  const pillarsWithProjects = pillarStats.filter(ps => ps.all.length > 0);
  const baseline2025Pct = OVERALL_DISTRIBUTION[0] * 100;
  const avgCompletedWeights = pillarsWithProjects.length > 0
    ? pillarsWithProjects.reduce((sum, ps) => sum + ps.completed.reduce((s: number, p: any) => s + (parseFloat(p.weight) || 0), 0), 0) / pillarsWithProjects.length
    : 0;
  const overallAchievement = baseline2025Pct > 0
    ? Math.round(Math.min((avgCompletedWeights / baseline2025Pct) * 100, 100))
    : 0;

  const today = new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        body.report-print-mode > div > header,
        body.report-print-mode > div > footer { display: none !important; }
        body.report-print-mode > div > main { padding: 0 !important; }
        @page { size: A4; margin: 0; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .report-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; }
          .report-page:last-child { page-break-after: auto; }
        }
        .report-page {
          width: 210mm; min-height: 297mm; margin: 0 auto 1rem;
          background: white; box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          padding: 16mm 14mm; box-sizing: border-box;
          position: relative; overflow: hidden;
        }
        .report-cover {
          color: white;
          background: linear-gradient(135deg, hsl(212 36% 12%) 0%, hsl(186 37% 22%) 55%, hsl(186 37% 29%) 100%);
        }
        .gold-line { height: 3px; background: linear-gradient(90deg, transparent, hsl(37 38% 63%), transparent); }
        .section-title-bar {
          display: flex; align-items: center; gap: 0.75rem;
          padding-bottom: 0.6rem; margin-bottom: 1rem;
          border-bottom: 2px solid hsl(186 37% 29%);
        }
      `}</style>

      <div className="bg-muted/30 min-h-screen py-6 px-4" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? 'Tajawal, sans-serif' : 'Inter, sans-serif' }}>
        {/* Print toolbar */}
        <div className="no-print max-w-[210mm] mx-auto mb-4 flex items-center justify-between gap-3 bg-white rounded-xl shadow p-3">
          <div className="text-sm text-muted-foreground">
            {t('تقرير منجزات الخطة الاستراتيجية', 'Strategic Plan Annual Report')} — {YEAR}
          </div>
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            {t('طباعة / حفظ PDF', 'Print / Save PDF')}
          </Button>
        </div>

        {/* ===== PAGE 1: COVER ===== */}
        <section className="report-page report-cover flex flex-col">
          <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full" style={{ background: 'hsla(37,38%,63%,0.15)' }} />
          <div className="absolute -bottom-40 -start-40 w-[28rem] h-[28rem] rounded-full" style={{ background: 'hsla(186,40%,40%,0.25)' }} />

          <div className="relative z-10 flex items-center justify-between text-xs opacity-80">
            <div>{t('جامعة نايف العربية للعلوم الأمنية', 'Naif Arab University for Security Sciences')}</div>
            <div>{today}</div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center text-center">
            <div className="inline-flex mx-auto items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ background: 'hsla(37,38%,63%,0.2)', border: '1px solid hsla(37,38%,63%,0.4)' }}>
              <Trophy className="h-4 w-4" style={{ color: 'hsl(37,38%,75%)' }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: 'hsl(37,38%,80%)' }}>
                {t('التقرير السنوي', 'Annual Report')} · {YEAR}
              </span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-5">
              {t('تقرير منجزات', 'Achievements Report')}
            </h1>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(37,38%,75%)' }}>
              {t('الخطة الاستراتيجية 2025-2029', 'Strategic Plan 2025-2029')}
            </h2>

            <div className="gold-line w-48 mx-auto mb-6" />

            <p className="text-base opacity-85 max-w-xl mx-auto leading-relaxed">
              {t(
                'تقرير شامل لإنجازات السنة الأولى من الخطة الاستراتيجية، يستعرض المؤشرات والمشاريع والإنجازات الرئيسية لعام 2025.',
                'A comprehensive report on Year 1 achievements of the Strategic Plan, showcasing KPIs, projects, and key milestones for 2025.'
              )}
            </p>

            <div className="mt-12 inline-block mx-auto px-8 py-4 rounded-2xl" style={{ background: 'hsla(0,0%,100%,0.08)', border: '1px solid hsla(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <div className="text-xs opacity-70 mb-1">{t('مُقدَّم إلى', 'Presented to')}</div>
              <div className="text-lg font-bold" style={{ color: 'hsl(37,38%,80%)' }}>
                {t('قيادات الجامعة', 'University Leadership')}
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center text-xs opacity-60 mt-8">
            {t('وثيقة داخلية — للاستخدام التنفيذي', 'Internal Document — For Executive Use')}
          </div>
        </section>

        {/* ===== PAGE 2: INTRODUCTION ===== */}
        <section className="report-page">
          <ReportHeader title={t('المقدمة', 'Introduction')} subtitle={t('كلمة افتتاحية وتمهيد للتقرير', 'Opening Statement and Report Preface')} />

          <div className="rounded-2xl p-6 mb-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(212 36% 18%), hsl(186 37% 28%))' }}>
            <div className="absolute -end-12 -top-12 w-44 h-44 rounded-full opacity-20" style={{ background: 'hsl(37,38%,63%)' }} />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'hsla(37,38%,63%,0.25)', border: '1px solid hsla(37,38%,63%,0.4)' }}>
                <BookOpen className="h-6 w-6" style={{ color: 'hsl(37,38%,80%)' }} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider opacity-80 mb-1">{t('تقديم', 'Foreword')}</div>
                <h3 className="text-2xl font-bold mb-2">
                  {t('عام من التحول والإنجاز', 'A Year of Transformation and Achievement')}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {t(
                    'يأتي هذا التقرير ليُلقي الضوء على ما تحقق خلال السنة الأولى من الخطة الاستراتيجية 2025-2029، مُترجِماً الرؤية إلى مبادرات ومشاريع ومؤشرات أداء قابلة للقياس.',
                    'This report highlights what has been achieved during the first year of the 2025-2029 Strategic Plan, translating vision into measurable initiatives, projects, and performance indicators.'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-loose text-foreground">
            <p>
              {t(
                'تُمثل الخطة الاستراتيجية 2025-2029 خارطة طريق طموحة تُجسّد تطلعات جامعة نايف العربية للعلوم الأمنية نحو الريادة الأكاديمية والبحثية في مجالات الأمن والعدالة الجنائية على المستويين العربي والدولي. وتنبثق هذه الخطة من رؤية ورسالة وقيم الجامعة، وتستند إلى أُطر علمية ومنهجية تضمن التحول من الطموح إلى الإنجاز.',
                'The 2025-2029 Strategic Plan represents an ambitious roadmap that embodies Naif Arab University’s aspirations toward academic and research leadership in the fields of security and criminal justice at both the Arab and international levels. The plan stems from the university’s vision, mission, and values, and is grounded in scientific and methodological frameworks that ensure the shift from ambition to achievement.'
              )}
            </p>
            <p>
              {t(
                'يُقدّم هذا التقرير قراءةً تحليليةً وموضوعيةً لمستوى الإنجاز السنوي، من خلال استعراض المؤشرات الرئيسية، ونسب تحقق المستهدفات، وأبرز المشاريع المنفّذة والمنطلقة، وأهم الإنجازات النوعية التي شكّلت ملامح عام 2025.',
                'This report provides an analytical and objective reading of the annual achievement level by reviewing key performance indicators, target accomplishment rates, the most important launched and completed projects, and the qualitative milestones that shaped 2025.'
              )}
            </p>
            <p>
              {t(
                'كما يهدف التقرير إلى تمكين القيادات من اتخاذ قرارات مستنيرة مبنية على البيانات، ورصد الفجوات، وتوجيه الموارد نحو الأولويات، تحقيقًا للتكامل بين المرتكزات الاستراتيجية والممكّنات التنفيذية في مسيرة الجامعة نحو 2029.',
                'It also aims to empower leadership to make informed, data-driven decisions, identify gaps, and direct resources toward priorities — fostering integration between strategic pillars and executive enablers as the university progresses toward 2029.'
              )}
            </p>
          </div>

          <ReportFooter pageNum={2} />
        </section>

        {/* ===== PAGE 2: EXECUTIVE SUMMARY ===== */}
        <section className="report-page">
          <ReportHeader title={t('الملخص التنفيذي', 'Executive Summary')} subtitle={t('نظرة شاملة على الأداء السنوي', 'A complete view of annual performance')} />

          {/* Hero stat */}
          <div className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(186 37% 22%), hsl(186 37% 32%))' }}>
            <div className="absolute -end-10 -top-10 w-44 h-44 rounded-full opacity-25" style={{ background: 'hsl(37,38%,63%)' }} />
            <div className="relative grid grid-cols-3 gap-6 items-center">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-80 mb-2">{t('التحقق العام', 'Overall Achievement')}</div>
                <div className="text-6xl font-black leading-none">{overallAchievement}<span className="text-3xl">%</span></div>
                <div className="text-xs mt-2 opacity-80">
                  {t('من المستهدف الأساسي للسنة الأولى', 'of Year 1 baseline target')}
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-3 gap-3">
                <MiniStat label={t('تحقق المشاريع', 'Projects Progress')} value={`${Math.round(pillarsWithProjects.reduce((s, p) => s + p.projectsAchievement, 0) / Math.max(pillarsWithProjects.length, 1))}%`} />
                <MiniStat label={t('أداء المؤشرات', 'KPI Performance')} value={`${Math.round(pillarStats.filter(p => p.kpis.length).reduce((s, p) => s + p.kpiScore, 0) / Math.max(pillarStats.filter(p => p.kpis.length).length, 1))}%`} />
                <MiniStat label={t('عدد المرتكزات', 'Number of Pillars')} value={`${pillarStats.length}`} />
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <StatCard icon={CheckCircle2} color="hsl(152 55% 40%)" value={completed.length} label={t('مشاريع مكتملة', 'Completed')} />
            <StatCard icon={Clock} color="hsl(212 50% 45%)" value={launched.length} label={t('مشاريع منطلقة', 'In Progress')} />
            <StatCard icon={AlertTriangle} color="hsl(0 70% 55%)" value={delayed.length} label={t('مشاريع متأخرة', 'Delayed')} />
            <StatCard icon={TrendingUp} color="hsl(152 55% 40%)" value={totalKPIsAchieved} label={t('مؤشرات محققة', 'KPIs Achieved')} />
            <StatCard icon={TrendingDown} color="hsl(20 7% 55%)" value={totalKPIsNotAchieved} label={t('قيد التحقق', 'In Progress KPIs')} />
          </div>

          {/* Highlights */}
          {settings?.highlights && settings.highlights.length > 0 && (
            <div className="mb-6">
              <div className="section-title-bar">
                <Sparkles className="h-5 w-5" style={{ color: 'hsl(186 37% 29%)' }} />
                <h3 className="text-lg font-bold">{t('أبرز الإنجازات', 'Key Highlights')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {settings.highlights.slice(0, 6).map((h: any, i: number) => (
                  <div key={i} className="rounded-xl p-3.5 border border-border bg-muted/20">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: 'hsl(186 37% 29%)' }}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-tight mb-1">{t(h.title_ar || h.title, h.title_en || h.title)}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{t(h.description_ar || h.desc, h.description_en || h.desc)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReportFooter pageNum={3} />
        </section>

        {/* ===== PAGE 4: VISION & STRATEGIC CONTEXT ===== */}
        <section className="report-page">
          <ReportHeader title={t('السياق الاستراتيجي', 'Strategic Context')} subtitle={t('الرؤية والرسالة وأبعاد الخطة', 'Vision, Mission, and Plan Dimensions')} />

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Eye, title: t('الرؤية', 'Vision'), text: t(uni?.vision_ar || '', uni?.vision_en || ''), color: 'hsl(186 37% 29%)' },
              { icon: Compass, title: t('الرسالة', 'Mission'), text: t(uni?.mission_ar || '', uni?.mission_en || ''), color: 'hsl(212 36% 34%)' },
              { icon: Heart, title: t('القيم', 'Values'), text: t(uni?.values_ar || '', uni?.values_en || ''), color: 'hsl(37 38% 53%)' },
            ].map((it, i) => (
              <div key={i} className="rounded-xl p-4 border border-border" style={{ background: 'white' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: it.color }}>
                    <it.icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">{it.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-[10]">{it.text || '—'}</p>
              </div>
            ))}
          </div>

          {pillars && goals && initiatives && (
            <div className="mb-6">
              <div className="section-title-bar">
                <Map className="h-5 w-5" style={{ color: 'hsl(186 37% 29%)' }} />
                <h3 className="text-lg font-bold">{t('الخريطة الاستراتيجية', 'Strategic Map')}</h3>
              </div>
              <div className="rounded-xl border border-border bg-white p-2">
                <div className="strategic-map-print w-full">
                  <StrategicMap pillars={pillars as any} goals={goals as any} initiatives={initiatives as any} />
                </div>
              </div>
            </div>
          )}

          <div className="section-title-bar">
            <BarChart3 className="h-5 w-5" style={{ color: 'hsl(186 37% 29%)' }} />
            <h3 className="text-lg font-bold">{t('أداء المرتكزات الاستراتيجية', 'Strategic Pillars Performance')}</h3>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'hsl(186 37% 29%)', color: 'white' }}>
                <th className="p-2.5 text-start font-bold text-xs">{t('المرتكز', 'Pillar')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('المشاريع', 'Projects')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('مكتملة', 'Completed')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('مؤشرات', 'KPIs')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('محققة', 'Achieved')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('تحقق المشاريع', 'Project %')}</th>
                <th className="p-2.5 text-center font-bold text-xs">{t('أداء المؤشرات', 'KPI %')}</th>
              </tr>
            </thead>
            <tbody>
              {pillarStats.map((ps, i) => (
                <tr key={ps.pillar.id} className={i % 2 ? 'bg-muted/30' : ''}>
                  <td className="p-2.5 font-bold border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-6 rounded-sm" style={{ background: ps.pillar.color || 'hsl(186 37% 29%)' }} />
                      <span>{t(ps.pillar.name_ar, ps.pillar.name_en)}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-center border-b border-border">{ps.all.length}</td>
                  <td className="p-2.5 text-center border-b border-border text-green-700 font-bold">{ps.completed.length}</td>
                  <td className="p-2.5 text-center border-b border-border">{ps.kpis.length}</td>
                  <td className="p-2.5 text-center border-b border-border text-green-700 font-bold">{ps.achievedKPIs.length}</td>
                  <td className="p-2.5 text-center border-b border-border">
                    <PctBar pct={ps.projectsAchievement} color={ps.pillar.color || 'hsl(186 37% 29%)'} />
                  </td>
                  <td className="p-2.5 text-center border-b border-border">
                    <PctBar pct={ps.kpiScore} color="hsl(37 38% 53%)" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReportFooter pageNum={4} />
        </section>

        {/* ===== PAGES 4+: ONE PAGE PER PILLAR ===== */}
        {pillarStats.map((ps, idx) => (
          <section key={ps.pillar.id} className="report-page">
            <ReportHeader
              title={t(ps.pillar.name_ar, ps.pillar.name_en)}
              subtitle={t('تفاصيل أداء المرتكز خلال 2025', 'Pillar performance details for 2025')}
              accent={ps.pillar.color || 'hsl(186 37% 29%)'}
            />

            {/* Pillar header card */}
            <div className="rounded-xl p-4 mb-4 text-white" style={{ background: ps.pillar.color || 'hsl(186 37% 29%)' }}>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-xs opacity-80">{t('المشاريع', 'Projects')}</div>
                  <div className="text-3xl font-black">{ps.all.length}</div>
                </div>
                <div>
                  <div className="text-xs opacity-80">{t('مكتملة', 'Completed')}</div>
                  <div className="text-3xl font-black">{ps.completed.length}</div>
                </div>
                <div>
                  <div className="text-xs opacity-80">{t('تحقق المشاريع', 'Projects Achievement')}</div>
                  <div className="text-3xl font-black">{ps.projectsAchievement}%</div>
                </div>
                <div>
                  <div className="text-xs opacity-80">{t('أداء المؤشرات', 'KPI Performance')}</div>
                  <div className="text-3xl font-black">{ps.kpiScore}%</div>
                </div>
              </div>
              {ps.pillar.general_goal_ar && (
                <div className="mt-3 pt-3 border-t border-white/20 text-xs leading-relaxed opacity-90">
                  <strong>{t('الهدف العام:', 'General Goal:')}</strong> {t(ps.pillar.general_goal_ar, ps.pillar.general_goal_en)}
                </div>
              )}
            </div>

            {/* Group projects & KPIs by initiative */}
            {(() => {
              const pillarInitiatives = (initiatives || []).filter((it: any) => it.pillar_id === ps.pillar.id);
              const groups = pillarInitiatives.map((init: any) => ({
                init,
                projects: ps.all.filter((p: any) => p.initiative_id === init.id),
                kpis: ps.kpis.filter((k: any) => k.initiative_id === init.id),
              })).filter(g => g.projects.length > 0 || g.kpis.length > 0);

              if (groups.length === 0) {
                return (
                  <div className="text-xs text-muted-foreground italic text-center py-6">
                    {t('لا توجد مبادرات لعرضها', 'No initiatives to display')}
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {groups.map(({ init, projects: gProjects, kpis: gKpis }) => (
                    <div key={init.id} className="rounded-xl border border-border overflow-hidden">
                      {/* Initiative header */}
                      <div className="px-3 py-2 flex items-center gap-2" style={{ background: 'hsl(186 20% 94%)', borderInlineStart: `4px solid ${ps.pillar.color || 'hsl(186 37% 29%)'}` }}>
                        <Sparkles className="h-3.5 w-3.5" style={{ color: ps.pillar.color || 'hsl(186 37% 29%)' }} />
                        <div className="font-bold text-xs flex-1">{t(init.name_ar, init.name_en)}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {gProjects.length} {t('مشروع', 'proj')} · {gKpis.length} {t('مؤشر', 'KPI')}
                        </div>
                      </div>

                      {/* Projects under initiative */}
                      {gProjects.length > 0 && (
                        <div className="px-3 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                            <Building2 className="h-3 w-3" />
                            {t('المشاريع', 'Projects')}
                          </div>
                          <table className="w-full text-[11px] border-collapse">
                            <tbody>
                              {gProjects.map((p: any) => (
                                <tr key={p.id} className="border-b border-border last:border-0">
                                  <td className="py-1.5">{t(p.name_ar, p.name_en)}</td>
                                  <td className="py-1.5 text-center w-20"><StatusBadge status={normalize(p.status)} t={t} /></td>
                                  <td className="py-1.5 text-center w-12 font-bold">{p.weight || 0}%</td>
                                  <td className="py-1.5 text-center w-20 text-muted-foreground">{p.end_date?.slice(0, 7) || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* KPIs under initiative */}
                      {gKpis.length > 0 && (
                        <div className="px-3 pt-2 pb-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                            <Target className="h-3 w-3" />
                            {t('مؤشرات الأداء', 'KPIs')}
                          </div>
                          <table className="w-full text-[11px] border-collapse">
                            <tbody>
                              {gKpis.map((k: any) => {
                                const pct = Math.round(kpiAchievementPct(k));
                                const achieved = pct >= 100;
                                return (
                                  <tr key={k.id} className="border-b border-border last:border-0">
                                    <td className="py-1.5">{t(k.name_ar, k.name_en)}</td>
                                    <td className="py-1.5 text-center w-14 font-bold">{k.target_2025 || '—'}</td>
                                    <td className="py-1.5 text-center w-14 font-bold">{actualsMap[k.id] || '—'}</td>
                                    <td className="py-1.5 text-center w-16">
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${achieved ? 'bg-green-100 text-green-800' : pct >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                        {pct}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            <ReportFooter pageNum={5 + idx} />
          </section>
        ))}

        {/* ===== FINAL PAGE: CONCLUSION ===== */}
        <section className="report-page">
          <ReportHeader title={t('الخلاصة والتطلعات', 'Conclusion & Outlook')} subtitle={t('نتائج عام 2025 ومحاور التركيز للعام القادم', '2025 Outcomes and Focus Areas for Next Year')} />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-5 border-2" style={{ borderColor: 'hsl(152 55% 40%)', background: 'hsl(152 50% 96%)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5" style={{ color: 'hsl(152 55% 40%)' }} />
                <h4 className="font-bold">{t('ما تم إنجازه', 'What was Achieved')}</h4>
              </div>
              <ul className="space-y-1.5 text-sm">
                <li>• {t(`اكتمال ${completed.length} مشروعاً ضمن مرتكزات الخطة`, `${completed.length} projects completed across pillars`)}</li>
                <li>• {t(`إطلاق ${launched.length} مشروعاً قيد التنفيذ`, `${launched.length} projects in progress`)}</li>
                <li>• {t(`تحقق ${totalKPIsAchieved} من أصل ${kpis2025.length} مؤشر`, `${totalKPIsAchieved} of ${kpis2025.length} KPIs achieved`)}</li>
                <li>• {t(`متوسط التحقق العام: ${overallAchievement}%`, `Overall achievement average: ${overallAchievement}%`)}</li>
              </ul>
            </div>

            <div className="rounded-xl p-5 border-2" style={{ borderColor: 'hsl(37 38% 53%)', background: 'hsl(37 50% 96%)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5" style={{ color: 'hsl(37 38% 43%)' }} />
                <h4 className="font-bold">{t('محاور التركيز للعام 2026', '2026 Focus Areas')}</h4>
              </div>
              <ul className="space-y-1.5 text-sm">
                <li>• {t('تسريع وتيرة المشاريع المتأخرة وضمان مساراتها', 'Accelerate delayed projects and ensure recovery paths')}</li>
                <li>• {t('رفع أداء المؤشرات التي لم تبلغ المستهدف', 'Boost performance of KPIs below target')}</li>
                <li>• {t('تعزيز الحوكمة وآليات المتابعة الدورية', 'Strengthen governance and periodic monitoring')}</li>
                <li>• {t('توسيع الشراكات الداعمة للأهداف الاستراتيجية', 'Expand strategic partnerships')}</li>
              </ul>
            </div>
          </div>

          {/* Bottom signature card */}
          <div className="rounded-2xl p-6 text-white text-center" style={{ background: 'linear-gradient(135deg, hsl(212 36% 14%), hsl(186 37% 29%))' }}>
            <FileText className="h-10 w-10 mx-auto mb-3" style={{ color: 'hsl(37 38% 75%)' }} />
            <h3 className="text-xl font-bold mb-2">
              {t(settings?.footer_title_ar || 'نحو تنفيذ متميز للخطة الاستراتيجية', settings?.footer_title_en || 'Towards Excellence in Strategic Execution')}
            </h3>
            <p className="text-sm opacity-85 max-w-xl mx-auto leading-relaxed">
              {t(
                settings?.footer_subtitle_ar || 'يعكس هذا التقرير التزام الجامعة بتحقيق رؤيتها الطموحة عبر تنفيذ منظم ومتكامل لأهدافها الاستراتيجية.',
                settings?.footer_subtitle_en || 'This report reflects the University\'s commitment to achieving its vision through organized and integrated execution of its strategic objectives.'
              )}
            </p>
            <div className="gold-line w-32 mx-auto mt-5 mb-3" />
            <div className="text-xs opacity-70">
              {t('جامعة نايف العربية للعلوم الأمنية', 'Naif Arab University for Security Sciences')} · {today}
            </div>
          </div>

          <ReportFooter pageNum={5 + pillarStats.length} />
        </section>
      </div>
    </>
  );
}

function ReportHeader({ title, subtitle, accent }: { title: string; subtitle?: string; accent?: string }) {
  const { t } = useLanguage();
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3 pb-2 border-b border-border">
        <span className="font-bold tracking-wide" style={{ color: accent || 'hsl(186 37% 29%)' }}>
          {t('تقرير منجزات الخطة الاستراتيجية', 'Strategic Plan Achievements Report')} · 2025
        </span>
        <span>{t('جامعة نايف العربية للعلوم الأمنية', 'NAUSS')}</span>
      </div>
      <div className="flex items-end gap-3">
        <div className="w-1.5 h-12 rounded-sm" style={{ background: accent || 'hsl(186 37% 29%)' }} />
        <div>
          <h2 className="text-2xl font-extrabold leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ReportFooter({ pageNum }: { pageNum: number }) {
  const { t } = useLanguage();
  return (
    <div className="absolute bottom-6 left-14 right-14 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-2">
      <span>{t('وثيقة داخلية — قيادات الجامعة', 'Internal Document — University Leadership')}</span>
      <span className="font-bold">{pageNum}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: 'hsla(255,255,255,0.12)', border: '1px solid hsla(255,255,255,0.18)' }}>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-[10px] opacity-80 mt-1">{label}</div>
    </div>
  );
}

function StatCard({ icon: Icon, color, value, label }: { icon: any; color: string; value: number; label: string }) {
  return (
    <div className="rounded-xl p-3 border border-border bg-white text-center">
      <Icon className="h-5 w-5 mx-auto mb-1" style={{ color }} />
      <div className="text-2xl font-black" style={{ color }}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

function PctBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-9 text-end">{pct}%</span>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: (a: string, e: string) => string }) {
  const map: Record<string, { label: [string, string]; cls: string }> = {
    completed: { label: ['مكتمل', 'Completed'], cls: 'bg-green-100 text-green-800' },
    launched: { label: ['منطلق', 'In Progress'], cls: 'bg-blue-100 text-blue-800' },
    delayed: { label: ['متأخر', 'Delayed'], cls: 'bg-red-100 text-red-800' },
  };
  const v = map[status] || map.launched;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.cls}`}>{t(v.label[0], v.label[1])}</span>;
}