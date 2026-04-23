import { LayoutDashboard, Network, Calendar, Globe, ChevronLeft, ChevronRight, Sparkles, Trophy, Target, Settings2, Building2, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAchievementSettings } from '@/hooks/useAchievementSettings';
import { useTargetSettings } from '@/hooks/useTargetSettings';
import { usePillars } from '@/hooks/useStrategyData';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { data: achievementSettings } = useAchievementSettings();
  const { data: targetSettings } = useTargetSettings();
  const { data: pillarsData } = usePillars();

  const staticItems = [
    { title_ar: 'خلفية الخطة', title_en: 'Plan Background', url: '/strategy-background', icon: BookOpen },
    { title_ar: 'لوحة المعلومات', title_en: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title_ar: 'الهيكل التنظيمي', title_en: 'Hierarchy', url: '/hierarchy', icon: Network },
    { title_ar: 'الجدول الزمني', title_en: 'Timeline', url: '/timeline', icon: Calendar },
    { title_ar: 'لوحة التحكم', title_en: 'Control Panel', url: '/admin', icon: Settings2 },
  ];

  const targetItems = [2025, 2026, 2027, 2028, 2029]
    .filter(year => {
      const setting = targetSettings?.find(s => s.year === year);
      return setting?.is_visible;
    })
    .map(year => ({
      title_ar: `مستهدفات ${year}`, title_en: `Targets ${year}`, url: `/targets-${year}`, icon: Target,
    }));

  const achievementItems = [2025, 2026, 2027, 2028, 2029]
    .filter(year => {
      const setting = achievementSettings?.find(s => s.year === year);
      return !setting || setting.is_visible;
    })
    .map(year => ({
      title_ar: `منجزات ${year}`, title_en: `Achievements ${year}`, url: `/achievements-${year}`, icon: Trophy,
    }));

  const pillarItems = (pillarsData || []).map(p => ({
    title_ar: p.name_ar, title_en: p.name_en, url: `/pillar/${p.id}`, icon: Building2,
  }));

  const navItems = [...staticItems, ...pillarItems, ...targetItems, ...achievementItems];

  return (
    <Sidebar collapsible="icon" side={isRTL ? 'right' : 'left'} className="border-sidebar-border">
      {/* Logo Area */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, hsl(var(--sidebar-primary)), hsl(40, 50%, 72%))' }}>
                <Sparkles className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-sidebar-foreground truncate leading-tight">
                  {t('جامعة نايف العربية', 'NAUSS')}
                </h1>
                <p className="text-[10px] text-sidebar-foreground/50 truncate">
                  {t('الخطة الاستراتيجية 2029', 'Strategy 2029')}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0 h-8 w-8"
          >
            {(collapsed ? !isRTL : isRTL) ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg transition-all duration-200 py-2.5"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold shadow-sm"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{t(item.title_ar, item.title_en)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <>

            {/* Language */}
            <div className="flex items-center justify-between p-2.5 rounded-lg">
              <Globe className="h-3.5 w-3.5 text-sidebar-foreground/60" />
              <div className="flex gap-1 bg-sidebar-accent/50 rounded-md p-0.5">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 text-xs rounded transition-all duration-200 ${language === 'ar' ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'}`}
                >
                  عربي
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs rounded transition-all duration-200 ${language === 'en' ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
