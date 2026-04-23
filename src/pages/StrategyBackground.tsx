import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BookOpen, Globe2, AlertTriangle,
  Shield, Brain, Users, FileText, TrendingUp, Zap, Search,
  Building2, GraduationCap, Map, BarChart3
} from 'lucide-react';

// ─── Slide data ───────────────────────────────────────────────────────────────

const slides = [
  // Slide 1 — المصادر الأساسية والثانوية
  {
    id: 'sources',
    icon: BookOpen,
    color: '#2e6066',
    gradient: 'linear-gradient(135deg, #1a3d42 0%, #2e6066 60%, #3d7f87 100%)',
    title_ar: 'المصادر الأساسية والثانوية',
    subtitle_ar: 'لبناء إستراتيجية الجامعة 2025 – 2029',
    title_en: 'Primary & Secondary Sources',
    subtitle_en: 'For Building the University Strategy 2025 – 2029',
    intro_ar: 'في إطار إعداد خطة الجامعة 2025–2029، أجرينا تقييماً شاملاً للوضع الراهن عبر منهجية متكاملة تضمّنت:',
    intro_en: 'In preparing the 2025–2029 university plan, we conducted a comprehensive assessment of the current situation through an integrated methodology that included:',
    items: [
      {
        icon: Users,
        ar: 'اجتماعات داخلية للاطلاع على رؤى مختلف فئات منسوبي الجامعة',
        en: 'Internal meetings to gather insights from various university staff categories',
      },
      {
        icon: Building2,
        ar: 'التعرف على آراء أهم فئات المستفيدين من الجهات ذات العلاقة بالمجال الأمني',
        en: 'Identifying views of key beneficiary groups from security-related entities',
      },
      {
        icon: Globe2,
        ar: 'التواصل مع القطاع الخاص ومناقشة شخصيات بارزة في العلوم الأمنية',
        en: 'Engaging with the private sector and discussing prominent security science figures',
      },
      {
        icon: Shield,
        ar: 'الحصول على متطلبات الجهات التنظيمية والإشرافية لتطبيق أفضل المعايير المحلية والدولية',
        en: 'Obtaining requirements of regulatory and supervisory bodies for best local and international standards',
      },
      {
        icon: Search,
        ar: 'استخلاص الدروس المستفادة من المؤسسات النظيرة في الشرق الأوسط وأوروبا والولايات المتحدة',
        en: 'Extracting lessons from peer institutions in the Middle East, Europe and the United States',
      },
      {
        icon: BarChart3,
        ar: 'تحليل أهم التقارير الصادرة على المستوى الدولي لبناء الاستراتيجية بشكل مدروس ومنهجي',
        en: 'Analyzing major international reports to build the strategy in a studied and systematic manner',
      },
    ],
  },

  // Slide 2 — المقارنات المرجعية
  {
    id: 'benchmarks',
    icon: Globe2,
    color: '#c9a96e',
    gradient: 'linear-gradient(135deg, #3d2e0a 0%, #6b4f1a 50%, #9a7232 100%)',
    title_ar: 'المقارنات المرجعية',
    subtitle_ar: 'مؤسسات رائدة من مجموعة العشرين وأوروبا وآسيا',
    title_en: 'Benchmarking',
    subtitle_en: 'Leading institutions from G20, Europe and Asia',
    intro_ar: 'تمت مراجعة ودراسة عدد من الجهات النظيرة والجامعات حول العالم، بما في ذلك المؤسسات الرائدة في دول مجموعة العشرين وأوروبا وآسيا.',
    intro_en: 'A number of peer institutions and universities around the world were reviewed and studied, including leading institutions in G20 countries, Europe and Asia.',
    regions: [
      {
        label_ar: 'المملكة العربية السعودية',
        label_en: 'Saudi Arabia',
        color: '#2e6066',
        institutions: ['كلية الملك فهد الأمنية'],
        institutions_en: ['King Fahd Security College'],
      },
      {
        label_ar: 'الولايات المتحدة الأمريكية',
        label_en: 'United States',
        color: '#3b6bbf',
        institutions: ['كلية هنري لي', 'كلية جون جاي', 'جورج سي مارشال'],
        institutions_en: ['Henry Lee College', 'John Jay College', 'George C. Marshall'],
      },
      {
        label_ar: 'أوروبا',
        label_en: 'Europe',
        color: '#7c3d9e',
        institutions: ['CEPOL', "King's College", 'جامعة ساسكس'],
        institutions_en: ['CEPOL', "King's College", 'University of Sussex'],
      },
      {
        label_ar: 'آسيا',
        label_en: 'Asia',
        color: '#c0392b',
        institutions: ['NFSU – الهند', 'جامعة الشعب الصيني للأمن العام', 'جامعة الشرطة الكورية'],
        institutions_en: ['NFSU – India', 'Chinese People\'s Public Security University', 'Korean National Police University'],
      },
      {
        label_ar: 'الشرق الأوسط',
        label_en: 'Middle East',
        color: '#16a085',
        institutions: ['الجامعة الوطنية للعلوم الأمنية اللبنانية', 'معهد دراسات الدفاع الوطني'],
        institutions_en: ['Lebanese National University of Security Sciences', 'National Defense Studies Institute'],
      },
    ],
  },

  // Slide 3 — أهم التهديدات الأمنية
  {
    id: 'threats',
    icon: AlertTriangle,
    color: '#e74c3c',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #4a1010 50%, #6b1a1a 100%)',
    title_ar: 'أهم التهديدات الأمنية',
    subtitle_ar: 'وموجهات الخطة الاستراتيجية',
    title_en: 'Key Security Threats',
    subtitle_en: 'And Strategic Plan Drivers',
    intro_ar: 'استناداً إلى تحليل أبرز التقارير الدولية من جهات مرموقة، حُددت مجالات التهديد الرئيسية التي وجّهت بناء الخطة الاستراتيجية:',
    intro_en: 'Based on analysis of major international reports from prestigious organizations, key threat areas were identified that guided the strategic plan:',
    reports: [
      { org_ar: 'مجموعة العشرين', org_en: 'G20', topic_ar: 'جدول أعمال 2030 ومكافحة الفساد', topic_en: '2030 Agenda & Anti-corruption', icon: Globe2 },
      { org_ar: 'الإنتربول', org_en: 'Interpol', topic_ar: 'تقرير الجريمة العالمية 2022', topic_en: 'Global Crime Report 2022', icon: Shield },
      { org_ar: 'الأمم المتحدة', org_en: 'United Nations', topic_ar: 'التوجهات الأمنية العالمية', topic_en: 'Global Security Trends', icon: Globe2 },
      { org_ar: 'المنتدى الاقتصادي العالمي', org_en: 'World Economic Forum', topic_ar: 'التقنيات الناشئة والأمن السيبراني', topic_en: 'Emerging Technologies & Cybersecurity', icon: Brain },
      { org_ar: 'مكتب الأمم المتحدة للمخدرات والجريمة', org_en: 'UNODC', topic_ar: 'المخدرات والجريمة المنظمة', topic_en: 'Drugs & Organized Crime', icon: AlertTriangle },
    ],
    threats: [
      { icon: Shield, ar: 'مهددات الأمن الوطني', en: 'National Security Threats', color: '#e74c3c' },
      { icon: Globe2, ar: 'الجريمة المنظمة والعابرة للحدود', en: 'Organized & Transnational Crime', color: '#e67e22' },
      { icon: FileText, ar: 'الجرائم الاقتصادية', en: 'Economic Crimes', color: '#f39c12' },
      { icon: Brain, ar: 'الجرائم السيبرانية', en: 'Cybercrime', color: '#3498db' },
      { icon: Zap, ar: 'المخدرات', en: 'Narcotics', color: '#9b59b6' },
    ],
  },

  // Slide 4 — الموجهات الاستراتيجية
  {
    id: 'drivers',
    icon: TrendingUp,
    color: '#27ae60',
    gradient: 'linear-gradient(135deg, #0a2010 0%, #144d2a 50%, #1a6b38 100%)',
    title_ar: 'الموجهات الاستراتيجية',
    subtitle_ar: 'التوجهات الحديثة في العلوم الأمنية',
    title_en: 'Strategic Drivers',
    subtitle_en: 'Modern Trends in Security Sciences',
    drivers: [
      {
        icon: Shield,
        color: '#27ae60',
        title_ar: 'الوقاية بدلاً من الاستجابة',
        title_en: 'Prevention Over Response',
        desc_ar: 'منع الجريمة قبل وقوعها يمثّل تحولاً في استراتيجيات الأمن للمساهمة في رفع مستوى جودة الحياة وتحقيق أهداف التنمية المستدامة، من خلال دعم اتخاذ القرار الأمني المبني على البيانات وتوظيف التطورات التقنية.',
        desc_en: 'Preventing crime before it occurs represents a shift in security strategies to improve quality of life and achieve sustainable development goals, through data-driven security decision-making and leveraging technological advances.',
        stats: [
          { label_ar: 'تخفيض التكلفة', label_en: 'Cost Reduction', value: '60%' },
          { label_ar: 'فعالية أعلى', label_en: 'Higher Effectiveness', value: '3×' },
        ],
      },
      {
        icon: Brain,
        color: '#3498db',
        title_ar: 'التقنيات الناشئة والذكاء الاصطناعي',
        title_en: 'Emerging Technologies & AI',
        desc_ar: 'سيكون للتطورات التقنية تأثير عظيم على شكل الأمن في المستقبل، حيث توفر فرصاً كبيرة للحد من الجريمة. سنركّز على التقنيات الناشئة والذكاء الاصطناعي في كافة أعمالنا الأكاديمية والتدريبية والبحثية، وسننشئ لهذا الغرض مركزاً متخصصاً.',
        desc_en: 'Technological advances will have a tremendous impact on the future of security, providing great opportunities to reduce crime. We will focus on emerging technologies and AI across all our academic, training and research work, establishing a specialized center for this purpose.',
        stats: [
          { label_ar: 'تقنيات ناشئة', label_en: 'Emerging Tech', value: 'AI+' },
          { label_ar: 'مركز متخصص', label_en: 'Specialized Center', value: '1' },
        ],
      },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StrategyBackground() {
  const { t, isRTL } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Page header */}
      <div className="px-6 py-6 border-b border-border/60 bg-card/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: slides[0].gradient }}>
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-foreground text-xl leading-tight">
                {t('خلفية الخطة الاستراتيجية', 'Strategic Plan Background')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('2025 – 2029', '2025 – 2029')}</p>
            </div>
          </div>

          {/* Section quick-nav */}
          <div className="flex flex-wrap gap-2">
            {slides.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm"
                style={{ borderColor: `${s.color}40`, background: `${s.color}10`, color: s.color }}
              >
                <s.icon className="h-3.5 w-3.5" />
                {t(s.title_ar, s.title_en)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All sections rendered sequentially */}
      <div className="flex-1">
        {slides.map((slide) => (
          <section key={slide.id} id={`section-${slide.id}`} className="scroll-mt-20">
            {/* Hero banner */}
            <div className="relative overflow-hidden py-12 px-6" style={{ background: slide.gradient }}>
              {/* subtle pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

              <div className="relative max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                  style={{ background: 'hsla(0,0%,100%,0.15)', border: '1px solid hsla(0,0%,100%,0.25)' }}
                >
                  <slide.icon className="h-8 w-8 text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  {t(slide.title_ar, slide.title_en)}
                </h2>
                <p className="text-white/70 text-base">
                  {t(slide.subtitle_ar, slide.subtitle_en)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
              {/* Slide 1 — Sources */}
              {slide.id === 'sources' && (
                <>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-2xl mx-auto">
                    {t(slide.intro_ar!, slide.intro_en!)}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(slide as any).items.map((item: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                        style={{ borderColor: `${slide.color}30` }}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${slide.color}15` }}>
                          <item.icon className="h-4 w-4" style={{ color: slide.color }} />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{t(item.ar, item.en)}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Slide 2 — Benchmarks */}
              {slide.id === 'benchmarks' && (
                <>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-2xl mx-auto">
                    {t(slide.intro_ar!, slide.intro_en!)}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(slide as any).regions.map((region: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border bg-card overflow-hidden"
                        style={{ borderColor: `${region.color}40` }}
                      >
                        <div className="px-4 py-2.5 flex items-center gap-2"
                          style={{ background: `${region.color}12` }}>
                          <Map className="h-4 w-4" style={{ color: region.color }} />
                          <span className="text-sm font-bold" style={{ color: region.color }}>
                            {t(region.label_ar, region.label_en)}
                          </span>
                        </div>
                        <ul className="px-4 py-3 space-y-2">
                          {region.institutions.map((inst: string, j: number) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                              <GraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {isRTL ? inst : region.institutions_en[j]}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Slide 3 — Threats */}
              {slide.id === 'threats' && (
                <>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-2xl mx-auto">
                    {t(slide.intro_ar!, slide.intro_en!)}
                  </p>

                  {/* Reports */}
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('التقارير الدولية المحللة', 'Analyzed International Reports')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(slide as any).reports.map((rep: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                          style={{ borderColor: `${slide.color}25` }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${slide.color}15` }}>
                            <rep.icon className="h-4 w-4" style={{ color: slide.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">{t(rep.org_ar, rep.org_en)}</p>
                            <p className="text-sm text-foreground">{t(rep.topic_ar, rep.topic_en)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Threat areas */}
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {t('مجالات التهديد الرئيسية', 'Key Threat Areas')}
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {(slide as any).threats.map((threat: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full border font-medium text-sm"
                          style={{ borderColor: `${threat.color}50`, background: `${threat.color}10`, color: threat.color }}
                        >
                          <threat.icon className="h-4 w-4" />
                          {t(threat.ar, threat.en)}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Slide 4 — Drivers */}
              {slide.id === 'drivers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(slide as any).drivers.map((driver: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="rounded-2xl border bg-card overflow-hidden"
                      style={{ borderColor: `${driver.color}35` }}
                    >
                      {/* Header */}
                      <div className="p-5 flex items-center gap-3" style={{ background: `${driver.color}10` }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ background: driver.color }}>
                          <driver.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-foreground text-base leading-tight">
                          {t(driver.title_ar, driver.title_en)}
                        </h3>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(driver.desc_ar, driver.desc_en)}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-3">
                          {driver.stats.map((stat: any, j: number) => (
                            <div key={j} className="flex-1 text-center rounded-xl py-3"
                              style={{ background: `${driver.color}12`, border: `1px solid ${driver.color}30` }}>
                              <div className="text-2xl font-extrabold" style={{ color: driver.color }}>{stat.value}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {t(stat.label_ar, stat.label_en)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
