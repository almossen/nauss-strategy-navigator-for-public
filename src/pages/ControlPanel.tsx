import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Database, LayoutDashboard, Trophy, Target } from 'lucide-react';
import DashboardAdmin from './DashboardAdmin';
import AdminPage from './AdminPage';
import AchievementsAdmin from './AchievementsAdmin';
import TargetsAdmin from './TargetsAdmin';

export default function ControlPanel() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}>
          <Settings2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('لوحة التحكم', 'Control Panel')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('إدارة محتوى الموقع والبيانات بالكامل', 'Manage all website content and data')}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t('إدارة لوحة المعلومات', 'Dashboard Management')}
          </TabsTrigger>
          <TabsTrigger value="targets" className="gap-2">
            <Target className="h-4 w-4" />
            {t('إدارة المستهدفات', 'Targets Management')}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="h-4 w-4" />
            {t('إدارة المنجزات', 'Achievements Management')}
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="h-4 w-4" />
            {t('إدارة البيانات', 'Data Management')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardAdmin embedded />
        </TabsContent>

        <TabsContent value="targets" className="mt-6">
          <TargetsAdmin embedded />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <AchievementsAdmin embedded />
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <AdminPage embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
