import { useLanguage } from '@/contexts/LanguageContext';
import { useUniversityInfo, usePillars, useStats, useAllProjects, useInitiatives } from '@/hooks/useStrategyData';
import { useAllKPIs, useAllStrategicGoals } from '@/hooks/useAllKPIs';
import { useSectionVisibility } from '@/hooks/usePageSections';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { VisionMissionValues } from '@/components/dashboard/VisionMissionValues';
import { StatCards } from '@/components/dashboard/StatCards';
import { StrategicMap } from '@/components/dashboard/StrategicMap';
import { PillarOverview } from '@/components/dashboard/PillarOverview';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ProjectTimeline } from '@/components/dashboard/ProjectTimeline';
import { AchievementDistribution } from '@/components/dashboard/AchievementDistribution';
import { useMemo } from 'react';

export default function Dashboard() {
  const { t, isRTL } = useLanguage();
  const { data: uniInfo } = useUniversityInfo();
  const { data: pillars } = usePillars();
  const { data: stats } = useStats();
  const { data: allProjects } = useAllProjects();
  const { data: allKPIs } = useAllKPIs();
  const { data: allGoals } = useAllStrategicGoals();
  const { data: initiatives } = useInitiatives();
  const { isVisible, getSection, getSortedKeys } = useSectionVisibility('dashboard');

  const heroSection = getSection('hero_banner');

  const sectionComponents: Record<string, React.ReactNode> = {
    hero_banner: isVisible('hero_banner') && (
      <HeroBanner content={heroSection?.content as Record<string, string> | undefined} />
    ),
    vision_mission_values: isVisible('vision_mission_values') && uniInfo && (
      <VisionMissionValues uniInfo={uniInfo} />
    ),
    stat_cards: isVisible('stat_cards') && stats && (
      <StatCards stats={stats} goalsCount={allGoals?.length || 0} />
    ),
    strategic_map: isVisible('strategic_map') && pillars && allGoals && initiatives && (
      <StrategicMap pillars={pillars} goals={allGoals} initiatives={initiatives} />
    ),
    pillar_overview: isVisible('pillar_overview') && pillars && allProjects && initiatives && (
      <PillarOverview
        pillars={pillars}
        allProjects={allProjects}
        initiatives={initiatives}
        kpisCount={pillars.reduce((acc, p) => {
          acc[p.id] = allKPIs?.filter((k: any) => k.initiatives?.pillar_id === p.id).length || 0;
          return acc;
        }, {} as Record<string, number>)}
      />
    ),
    charts: isVisible('charts') && pillars && initiatives && allProjects && allKPIs && (
      <ChartsSection
        pillars={pillars}
        initiatives={initiatives}
        allProjects={allProjects}
        allKPIs={allKPIs}
        isRTL={isRTL}
      />
    ),
    project_timeline: isVisible('project_timeline') && allProjects && pillars && (
      <ProjectTimeline allProjects={allProjects} pillars={pillars} />
    ),
    achievement_distribution: pillars && allKPIs && (
      <AchievementDistribution pillars={pillars} allKPIs={allKPIs} />
    ),
  };

  const sortedKeys = getSortedKeys();
  const displayKeys = sortedKeys.length > 0 
    ? [...sortedKeys, ...(!sortedKeys.includes('achievement_distribution') ? ['achievement_distribution'] : [])]
    : [
      'hero_banner', 'vision_mission_values', 'stat_cards', 'strategic_map',
      'pillar_overview', 'charts', 'project_timeline', 'achievement_distribution'
    ];

  return (
    <div className="space-y-8 w-full">
      {displayKeys.map(key => (
        <div key={key}>{sectionComponents[key]}</div>
      ))}
    </div>
  );
}
