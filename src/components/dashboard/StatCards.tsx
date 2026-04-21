import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Target, FolderKanban, BarChart3, BookOpen, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } }
};

function AnimatedCounter({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count}</>;
}

interface Props {
  stats: {
    pillarsCount: number;
    initiativesCount: number;
    projectsCount: number;
    kpisCount: number;
  };
  goalsCount: number;
}

export function StatCards({ stats, goalsCount }: Props) {
  const { t } = useLanguage();

  const statCards = [
    { key: 'pillars', label_ar: 'الركائز والممكنات', label_en: 'Pillars & Enablers', value: stats.pillarsCount, icon: Building2, color: 'hsl(174,42%,33%)' },
    { key: 'goals', label_ar: 'الأهداف الاستراتيجية', label_en: 'Strategic Goals', value: goalsCount, icon: Award, color: 'hsl(195,35%,35%)' },
    { key: 'initiatives', label_ar: 'المبادرات', label_en: 'Initiatives', value: stats.initiativesCount, icon: Target, color: 'hsl(37,35%,63%)' },
    { key: 'projects', label_ar: 'المشاريع', label_en: 'Projects', value: stats.projectsCount, icon: FolderKanban, color: 'hsl(213,40%,30%)' },
    { key: 'kpis', label_ar: 'مؤشرات الأداء', label_en: 'KPIs', value: stats.kpisCount, icon: BarChart3, color: 'hsl(152,55%,40%)' },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.key} variants={fadeInUp} transition={{ duration: 0.4, delay: i * 0.05 }} className="stat-card group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: stat.color }}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              <AnimatedCounter target={stat.value} />
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{t(stat.label_ar, stat.label_en)}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
