import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import PillarPage from "./pages/PillarPage";
import HierarchyView from "./pages/HierarchyView";
import TimelineView from "./pages/TimelineView";
import ControlPanel from "./pages/ControlPanel";
import Achievements2025 from "./pages/Achievements2025";
import Achievements2026 from "./pages/Achievements2026";
import Achievements2027 from "./pages/Achievements2027";
import Achievements2028 from "./pages/Achievements2028";
import Achievements2029 from "./pages/Achievements2029";
import TargetsPage from "./pages/TargetsPage";
import Enablers from "./pages/Enablers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <EditModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/hierarchy" element={<HierarchyView />} />
                <Route path="/timeline" element={<TimelineView />} />
                <Route path="/admin" element={<ControlPanel />} />
                <Route path="/targets-2025" element={<TargetsPage year={2025} />} />
                <Route path="/targets-2026" element={<TargetsPage year={2026} />} />
                <Route path="/targets-2027" element={<TargetsPage year={2027} />} />
                <Route path="/targets-2028" element={<TargetsPage year={2028} />} />
                <Route path="/targets-2029" element={<TargetsPage year={2029} />} />
                <Route path="/achievements-2025" element={<Achievements2025 />} />
                <Route path="/achievements-2026" element={<Achievements2026 />} />
                <Route path="/achievements-2027" element={<Achievements2027 />} />
                <Route path="/achievements-2028" element={<Achievements2028 />} />
                <Route path="/achievements-2029" element={<Achievements2029 />} />
                <Route path="/pillar/:pillarId" element={<PillarPage />} />
                <Route path="/enablers" element={<Enablers />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </EditModeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
