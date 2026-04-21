import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroCampus from '@/assets/hero-campus.jpg';
import naussIcon from '@/assets/nauss-icon.png';

interface HeroBannerProps {
  content?: Record<string, string>;
}

export function HeroBanner({ content }: HeroBannerProps) {
  const { t, isRTL } = useLanguage();

  const title = content?.title_ar && content?.title_en ?
  t(content.title_ar, content.title_en) :
  t('الخطة التنفيذية لاستراتيجية الجامعة ', 'University Strategy Executive Plan');

  const subtitle = content?.subtitle_ar && content?.subtitle_en ?
  t(content.subtitle_ar, content.subtitle_en) :
  t(
    'جامعة نايف العربية للعلوم الأمنية — بناء مستقبل أمني متميز',
    'Naif Arab University for Security Sciences — Building a distinguished security future'
  );

  const yearRange = content?.year_range || 'NAUSS 2029';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="hero-banner h-52 md:h-64 relative rounded-2xl">
      
      <img src={heroCampus} alt="NAUSS Campus" className="w-full h-full object-cover" />
      <div className="absolute inset-0 z-10 flex items-center justify-between px-8 md:px-14" style={{ background: 'linear-gradient(135deg, hsla(174,50%,12%,0.92), hsla(174,42%,33%,0.8))' }}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl">
          
          <h1 className="text-2xl font-extrabold text-white leading-tight mb-2 md:text-3xl">
            {title}
          </h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-[60px] bg-secondary" />
            <span className="text-secondary text-lg md:text-xl font-bold tracking-wide">
              {yearRange}
            </span>
          </div>
        </motion.div>
        <motion.img
          src={naussIcon}
          alt="NAUSS"
          className="hidden md:block w-32 h-32 object-contain opacity-60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }} />
        
      </div>
    </motion.div>);

}