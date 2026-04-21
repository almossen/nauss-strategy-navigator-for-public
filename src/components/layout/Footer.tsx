import { useLanguage } from '@/contexts/LanguageContext';
import naussLogo from '@/assets/nauss-logo.png';
import anjezLogo from '@/assets/anjez-logo.png';

export function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="w-full mt-12">
      {/* Gold accent line */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, hsl(37,38%,58%), hsl(37,48%,70%), hsl(37,38%,58%))' }} />

      {/* Main footer */}
      <div className="bg-primary text-white">
        <div className="w-full px-4 md:px-8 lg:px-12 py-10">
          <div className="flex flex-col items-center text-center space-y-5">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <img src={naussLogo} alt="NAUSS" className="h-12 object-contain opacity-75" />
              <div className="h-10 w-px bg-white/15" />
              <img src={anjezLogo} alt="Anjez" className="h-10 object-contain opacity-70" />
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-lg">
              {t(
                'تعد جامعة نايف العربية للعلوم الأمنية الجهاز العلمي لمجلس وزراء الداخلية العرب، وتسعى لتحقيق التميز في التعليم والبحث العلمي والتدريب في المجالات الأمنية.',
                'Naif Arab University for Security Sciences is the academic arm of the Council of Arab Interior Ministers, striving for excellence in education, research, and training in security fields.'
              )}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-[hsl(186,37%,22%)] px-4 md:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-white/70">
            © {new Date().getFullYear()} {t('جامعة نايف العربية للعلوم الأمنية. جميع الحقوق محفوظة.', 'Naif Arab University for Security Sciences. All rights reserved.')}
          </p>
          <p className="text-[10px] text-white/50">
            {t('الخطة التنفيذية لاستراتيجية الجامعة NAUSS 2029', 'University Strategy Executive Plan NAUSS 2029')}
          </p>
        </div>
      </div>
    </footer>
  );
}
