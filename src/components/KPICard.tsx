import { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, BarChart3, X, Download, FileText, Calculator, BookOpen, Clock, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface KPIData {
  id: string;
  name_ar: string;
  name_en: string;
  baseline: string;
  target_2025: string;
  target_2026: string;
  target_2027: string;
  target_2028: string;
  target_2029: string;
  final_target: string;
  unit: string;
  description_ar?: string;
  description_en?: string;
  data_source_ar?: string;
  data_source_en?: string;
  calculation_method_ar?: string;
  calculation_method_en?: string;
  supporting_references_ar?: string;
  supporting_references_en?: string;
  measurement_frequency?: string;
}

interface KPICardProps {
  kpi: KPIData;
  pillarName?: string;
  pillarColor?: string;
  goalName?: string;
  initiativeName?: string;
  onClose: () => void;
}

export default function KPICard({ kpi, pillarName, pillarColor = 'hsl(var(--primary))', goalName, initiativeName, onClose }: KPICardProps) {
  const { t, isRTL } = useLanguage();
  const [showDetails, setShowDetails] = useState(true);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    setExporting(true);

    try {
      await document.fonts.ready;

      // Clone element off-screen with fixed width for consistent rendering
      const clone = cardRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-10000px';
      clone.style.top = '0';
      clone.style.width = cardRef.current.offsetWidth + 'px';
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#000000';
      clone.style.fontFamily = "'Tajawal', 'Inter', sans-serif";
      clone.style.direction = isRTL ? 'rtl' : 'ltr';
      clone.style.textAlign = isRTL ? 'right' : 'left';

      // Force all text elements to use proper font and fix RTL
      clone.querySelectorAll('*').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.fontFamily = "'Tajawal', 'Inter', sans-serif";
        htmlEl.style.letterSpacing = 'normal';
        htmlEl.style.textTransform = 'none';
      });

      document.body.appendChild(clone);

      // Wait for layout
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 190;
      const pdfPageHeight = 277;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight <= pdfPageHeight) {
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let sourceY = 0;
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(remainingHeight, pdfPageHeight);
          const sliceCanvasHeight = (sliceHeight / pdfWidth) * canvas.width;
          pageCanvas.height = sliceCanvasHeight;

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceCanvasHeight, 0, 0, canvas.width, sliceCanvasHeight);
          }

          const pageImgData = pageCanvas.toDataURL('image/png');
          if (sourceY > 0) pdf.addPage();
          pdf.addImage(pageImgData, 'PNG', 10, 10, pdfWidth, sliceHeight);

          sourceY += sliceCanvasHeight;
          remainingHeight -= sliceHeight;
        }
      }

      const fileName = `KPI-${t(kpi.name_ar, kpi.name_en).slice(0, 30)}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
    }
  };

  const targets = [
    { label: t('خط الأساس', 'Baseline'), value: kpi.baseline, highlight: true },
    { label: '2025', value: kpi.target_2025 },
    { label: '2026', value: kpi.target_2026 },
    { label: '2027', value: kpi.target_2027 },
    { label: '2028', value: kpi.target_2028 },
    { label: '2029', value: kpi.target_2029 },
    { label: t('المستهدف الكلي', 'Final Target'), value: kpi.final_target, highlight: true },
  ];

  const detailSections = [
    {
      icon: <FileText className="h-4 w-4" />,
      title: t('وصف المؤشر', 'Description'),
      content: t(kpi.description_ar, kpi.description_en),
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: t('مصدر البيانات', 'Data Source'),
      content: t(kpi.data_source_ar, kpi.data_source_en),
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      title: t('طريقة الحساب', 'Calculation Method'),
      content: t(kpi.calculation_method_ar, kpi.calculation_method_en),
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: t('المراجع الداعمة', 'Supporting References'),
      content: t(kpi.supporting_references_ar, kpi.supporting_references_en),
    },
  ];

  const metaLabelClassName = isRTL
    ? 'text-[10px] font-bold text-muted-foreground block'
    : 'text-[10px] font-bold text-muted-foreground uppercase tracking-wider block';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-2 px-5 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={exporting}
            className="rounded-lg gap-2 text-xs"
          >
            <Download className="h-4 w-4" />
            {exporting ? t('جاري التصدير...', 'Exporting...') : t('تصدير PDF', 'Export PDF')}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div
          ref={cardRef}
          data-kpi-export-root="true"
          lang={isRTL ? 'ar' : 'en'}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="bg-background p-6 space-y-5"
          style={{
            fontFamily: "'Tajawal', 'Inter', sans-serif",
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${pillarColor}, ${pillarColor}cc)` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-extrabold leading-snug">
                {t('بطاقة وصف مؤشر الأداء', 'KPI Description Card')}
              </h2>
            </div>
            {pillarName && <p className="text-white/80 text-sm">{pillarName}</p>}
          </div>

          {(goalName || initiativeName) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalName && (
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <span data-pdf-rtl-fix="true" className={metaLabelClassName}>
                    {t('الهدف الاستراتيجي', 'Strategic Goal')}
                  </span>
                  <p className="text-foreground font-semibold text-sm mt-1 leading-relaxed">{goalName}</p>
                </div>
              )}
              {initiativeName && (
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <span data-pdf-rtl-fix="true" className={metaLabelClassName}>
                    {t('المبادرة', 'Initiative')}
                  </span>
                  <p className="text-foreground font-semibold text-sm mt-1 leading-relaxed">{initiativeName}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg border-2 p-4" style={{ borderColor: pillarColor + '60' }}>
            <span data-pdf-rtl-fix="true" className={metaLabelClassName}>
              {t('اسم المؤشر', 'Indicator Name')}
            </span>
            <p className="text-foreground font-bold text-base mt-1">{t(kpi.name_ar, kpi.name_en)}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Ruler className="h-4 w-4" style={{ color: pillarColor }} />
              {t('المستهدفات السنوية', 'Annual Targets')}
            </h3>
            <div className="grid grid-cols-7 gap-1.5">
              {targets.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg border text-center p-2.5 ${
                    item.highlight
                      ? 'border-2'
                      : 'border-border bg-muted/10'
                  }`}
                  style={item.highlight ? { borderColor: pillarColor + '80', backgroundColor: pillarColor + '15' } : undefined}
                >
                  <span className="text-[10px] font-bold text-muted-foreground block mb-1">{item.label}</span>
                  <span className="text-sm font-bold text-foreground block">{item.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-muted/10">
              <Ruler className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <span data-pdf-rtl-fix="true" className={metaLabelClassName}>{t('نوع المؤشر', 'Type')}</span>
                <span className="text-sm font-semibold text-foreground">{kpi.unit || '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3 bg-muted/10">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <span data-pdf-rtl-fix="true" className={metaLabelClassName}>{t('دورية القياس', 'Frequency')}</span>
                <span className="text-sm font-semibold text-foreground">{kpi.measurement_frequency || '—'}</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 w-full rounded-lg px-4 py-2.5 font-bold text-white text-sm mb-3"
              style={{ backgroundColor: pillarColor }}
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {t('تفاصيل المؤشر', 'Indicator Details')}
            </button>

            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {detailSections.map((section, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 bg-muted/10 min-h-[100px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 rounded-md text-white" style={{ backgroundColor: pillarColor }}>
                        {section.icon}
                      </span>
                      <span className="text-xs font-bold text-foreground">{section.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
