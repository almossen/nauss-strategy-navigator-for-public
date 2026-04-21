import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Compass, Star } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

interface Props {
  uniInfo: {
    vision_ar: string;
    vision_en: string;
    mission_ar: string;
    mission_en: string;
    values_ar: string;
    values_en: string;
  };
}

export function VisionMissionValues({ uniInfo }: Props) {
  const { t } = useLanguage();

  const items = [
    { icon: Eye, title_ar: 'الرؤية', title_en: 'Vision', text_ar: uniInfo.vision_ar, text_en: uniInfo.vision_en },
    { icon: Compass, title_ar: 'الرسالة', title_en: 'Mission', text_ar: uniInfo.mission_ar, text_en: uniInfo.mission_en },
    { icon: Star, title_ar: 'القيم', title_en: 'Values', text_ar: uniInfo.values_ar, text_en: uniInfo.values_en },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((item, i) => (
        <motion.div key={i} variants={fadeInUp} transition={{ duration: 0.4 }} className="card-premium gold-accent p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-sm text-foreground">{t(item.title_ar, item.title_en)}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{t(item.text_ar, item.text_en)}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
