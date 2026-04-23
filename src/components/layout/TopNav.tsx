import { LayoutDashboard, Menu, X, Trophy, Target, Settings2, ChevronDown, Building2, Sparkles, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAchievementSettings } from '@/hooks/useAchievementSettings';
import { useTargetSettings } from '@/hooks/useTargetSettings';
import { usePillars } from '@/hooks/useStrategyData';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import naussLogo from '@/assets/nauss-logo.png';
import anjezLogo from '@/assets/anjez-logo.png';

function DropdownMenu({ label, icon: Icon, items, isRTL, t, onNavigate }: {
  label: string;
  icon: any;
  items: { title_ar: string; title_en: string; url: string }[];
  isRTL: boolean;
  t: (ar: string, en: string) => string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isActive = items.some(i => location.pathname === i.url);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200",
          isActive
            ? "bg-white/15 text-white font-semibold"
            : "text-white/65 hover:text-white hover:bg-white/10"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 min-w-[180px] rounded-xl overflow-hidden shadow-xl border border-white/10 z-50",
            "bg-[hsl(174,42%,28%)] backdrop-blur-lg"
          )}
          style={{ [isRTL ? 'right' : 'left']: 0 }}
        >
          {items.map(item => (
            <NavLink
              key={item.url}
              to={item.url}
              end
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all"
              activeClassName="bg-white/15 text-white font-semibold"
            >
              <span>{t(item.title_ar, item.title_en)}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopNav() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: achievementSettings } = useAchievementSettings();
  const { data: targetSettings } = useTargetSettings();
  const { data: pillarsData } = usePillars();

  const pillarItems = (pillarsData || []).map(p => ({
    title_ar: p.name_ar, title_en: p.name_en, url: `/pillar/${p.id}`,
  }));

  const targetItems = [2025, 2026, 2027, 2028, 2029]
    .filter(year => targetSettings?.find(s => s.year === year)?.is_visible)
    .map(year => ({
      title_ar: `مستهدفات ${year}`, title_en: `Targets ${year}`, url: `/targets-${year}`,
    }));

  const achievementItems = [2025, 2026, 2027, 2028, 2029]
    .filter(year => {
      const setting = achievementSettings?.find(s => s.year === year);
      return !setting || setting.is_visible;
    })
    .map(year => ({
      title_ar: `منجزات ${year}`, title_en: `Achievements ${year}`, url: `/achievements-${year}`,
    }));

  // Mobile: flatten all items
  const [mobileTargetsOpen, setMobileTargetsOpen] = useState(false);
  const [mobileAchievementsOpen, setMobileAchievementsOpen] = useState(false);
  const [mobilePillarsOpen, setMobilePillarsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full">
        {/* Top utility bar */}
        <div className="nauss-topbar h-8 flex items-center justify-between px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/60 font-medium tracking-wide">
              {t('الخطة التنفيذية لاستراتيجية الجامعة NAUSS 2029', 'University Strategy Executive Plan NAUSS 2029')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-md overflow-hidden">
              <button
                onClick={() => setLanguage('ar')}
                className={cn(
                  "px-2 py-0.5 text-[10px] transition-all duration-200 font-medium",
                  language === 'ar' ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                عربي
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-2 py-0.5 text-[10px] transition-all duration-200 font-medium",
                  language === 'en' ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="nauss-navbar border-b border-white/10" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between h-14">
              {/* Logo area */}
              <div className="flex items-center gap-4 shrink-0">
                <img src={naussLogo} alt="NAUSS" className="h-10 object-contain opacity-90" />
                <div className="hidden sm:block h-8 w-px bg-white/20" />
                <img src={anjezLogo} alt="Anjez" className="hidden sm:block h-9 object-contain opacity-85" />
              </div>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center gap-0.5">
                  {/* Dashboard */}
                  <NavLink
                    to="/"
                    end
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                    activeClassName="bg-white/15 text-white font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t('لوحة المعلومات', 'Dashboard')}</span>
                  </NavLink>

                  {/* Strategy Background */}
                  <NavLink
                    to="/strategy-background"
                    end
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                    activeClassName="bg-white/15 text-white font-semibold"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{t('خلفية الخطة', 'Plan Background')}</span>
                  </NavLink>

                  {/* Targets Dropdown - hidden temporarily */}
                  {false && targetItems.length > 0 && (
                    <DropdownMenu
                      label={t('المستهدفات', 'Targets')}
                      icon={Target}
                      items={targetItems}
                      isRTL={isRTL}
                      t={t}
                    />
                  )}

                  {/* Achievements Dropdown */}
                  {achievementItems.length > 0 && (
                    achievementItems.length === 1 ? (
                      <NavLink
                        to={achievementItems[0].url}
                        end
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                        activeClassName="bg-white/15 text-white font-semibold"
                      >
                        <Trophy className="h-4 w-4" />
                        <span>{t(achievementItems[0].title_ar, achievementItems[0].title_en)}</span>
                      </NavLink>
                    ) : (
                      <DropdownMenu
                        label={t('المنجزات', 'Achievements')}
                        icon={Trophy}
                        items={achievementItems}
                        isRTL={isRTL}
                        t={t}
                      />
                    )
                  )}

                  {/* Pillars Dropdown */}
                  {pillarItems.length > 0 && (
                    <DropdownMenu
                      label={t('المرتكزات', 'Pillars')}
                      icon={Building2}
                      items={pillarItems}
                      isRTL={isRTL}
                      t={t}
                    />
                  )}

                  {/* Enablers */}
                  <NavLink
                    to="/enablers"
                    end
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                    activeClassName="bg-white/15 text-white font-semibold"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t('الممكنات', 'Enablers')}</span>
                  </NavLink>

                  {/* Control Panel */}
                  <NavLink
                    to="/admin"
                    end
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                    activeClassName="bg-white/15 text-white font-semibold"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span>{t('لوحة التحكم', 'Control Panel')}</span>
                  </NavLink>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[hsl(174,42%,28%)] border-b border-white/10 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 space-y-1">
              {/* Dashboard */}
              <NavLink
                to="/"
                end
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                activeClassName="bg-white/15 text-white font-semibold"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t('لوحة المعلومات', 'Dashboard')}</span>
              </NavLink>

              {/* Mobile Strategy Background */}
              <NavLink
                to="/strategy-background"
                end
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                activeClassName="bg-white/15 text-white font-semibold"
              >
                <BookOpen className="h-4 w-4" />
                <span>{t('خلفية الخطة', 'Plan Background')}</span>
              </NavLink>

              {/* Mobile Targets - hidden temporarily */}
              {false && targetItems.length > 0 && (
                <>
                  <button
                    onClick={() => setMobileTargetsOpen(!mobileTargetsOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Target className="h-4 w-4" />
                      {t('المستهدفات', 'Targets')}
                    </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", mobileTargetsOpen && "rotate-180")} />
                  </button>
                  {mobileTargetsOpen && (
                    <div className="space-y-0.5" style={{ paddingInlineStart: '1.5rem' }}>
                      {targetItems.map(item => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          end
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/10 transition-all"
                          activeClassName="bg-white/15 text-white font-semibold"
                        >
                          <span>{t(item.title_ar, item.title_en)}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
              {achievementItems.length > 0 && (
                <>
                  <button
                    onClick={() => setMobileAchievementsOpen(!mobileAchievementsOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Trophy className="h-4 w-4" />
                      {t('المنجزات', 'Achievements')}
                    </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", mobileAchievementsOpen && "rotate-180")} />
                  </button>
                  {mobileAchievementsOpen && (
                    <div className="space-y-0.5" style={{ paddingInlineStart: '1.5rem' }}>
                      {achievementItems.map(item => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          end
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/10 transition-all"
                          activeClassName="bg-white/15 text-white font-semibold"
                        >
                          <span>{t(item.title_ar, item.title_en)}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Mobile Pillars */}
              {pillarItems.length > 0 && (
                <>
                  <button
                    onClick={() => setMobilePillarsOpen(!mobilePillarsOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Building2 className="h-4 w-4" />
                      {t('المرتكزات', 'Pillars')}
                    </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", mobilePillarsOpen && "rotate-180")} />
                  </button>
                  {mobilePillarsOpen && (
                    <div className="space-y-0.5" style={{ paddingInlineStart: '1.5rem' }}>
                      {pillarItems.map(item => (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          end
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/10 transition-all"
                          activeClassName="bg-white/15 text-white font-semibold"
                        >
                          <span>{t(item.title_ar, item.title_en)}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Mobile Enablers */}
              <NavLink
                to="/enablers"
                end
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                activeClassName="bg-white/15 text-white font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t('الممكنات', 'Enablers')}</span>
              </NavLink>

              {/* Control Panel */}
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
                activeClassName="bg-white/15 text-white font-semibold"
              >
                <Settings2 className="h-4 w-4" />
                <span>{t('لوحة التحكم', 'Control Panel')}</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
