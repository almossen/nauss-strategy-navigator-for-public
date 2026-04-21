import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Target, FolderKanban, BarChart3 } from 'lucide-react';

import pillarEducation from '@/assets/pillar-education.jpg';
import pillarResearch from '@/assets/pillar-research.jpg';
import pillarTraining from '@/assets/pillar-training.jpg';
import pillarExternal from '@/assets/pillar-external.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const pillarImages: Record<number, string> = {
  0: pillarEducation,
  1: pillarResearch,
  2: pillarTraining,
  3: pillarExternal,
};

interface Pillar {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  color: string;
  icon: string;
  type: string;
  sort_order: number;
}

interface Props {
  pillars: Pillar[];
  allProjects: any[];
  initiatives: any[];
  kpisCount?: Record<string, number>;
}

export function PillarOverview({ pillars, allProjects, initiatives, kpisCount }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <div className="section-header">
        <h2 className="font-bold text-lg text-foreground">{t('الركائز الاستراتيجية', 'Strategic Pillars')}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, i) => {
          const pillarInitiatives = initiatives?.filter((ini: any) => ini.pillar_id === pillar.id) || [];
          const pillarProjects = allProjects?.filter((p: any) => p.initiatives?.pillar_id === pillar.id) || [];
          const pillarKpis = kpisCount?.[pillar.id] || 0;
          const img = pillarImages[i] || pillarImages[0];

          return (
             <motion.div
              key={pillar.id}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl overflow-hidden border border-border/40 bg-card flex flex-col cursor-pointer"
              style={{ boxShadow: 'var(--shadow-card)' }}
              onClick={() => navigate(`/hierarchy?pillar=${pillar.id}`)}
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={img}
                  alt={t(pillar.name_ar, pillar.name_en)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${pillar.color}cc, transparent)` }} />
                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-sm bg-white/15"
                    >
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-white text-xs leading-tight drop-shadow-md line-clamp-2">
                      {t(pillar.name_ar, pillar.name_en)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
                  {t(pillar.description_ar, pillar.description_en)}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { icon: Target, value: pillarInitiatives.length, label: t('مبادرة', 'Init.') },
                    { icon: FolderKanban, value: pillarProjects.length, label: t('مشروع', 'Proj.') },
                    { icon: BarChart3, value: pillarKpis, label: t('مؤشر', 'KPIs') },
                  ].map((stat, si) => (
                    <div key={si} className="text-center bg-muted/50 rounded-lg py-2 px-1">
                      <stat.icon className="h-3 w-3 mx-auto mb-1" style={{ color: pillar.color }} />
                      <p className="text-sm font-extrabold text-foreground leading-none">{stat.value}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
