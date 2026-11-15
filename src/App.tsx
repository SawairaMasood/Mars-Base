import React, { useState } from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/notifications/ToastContainer';
import { GlossaryModal } from './components/modals/GlossaryModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BriefingPage } from './pages/BriefingPage';
import { MissionControl } from './pages/MissionControl';
import { ResourceCenter } from './pages/ResourceCenter';
import { EmergencyCenter } from './pages/EmergencyCenter';
import { AdvisorPage } from './pages/AdvisorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MissionDebrief } from './pages/MissionDebrief';

const AppContent: React.FC = () => {
  const { activeTab } = useMission();
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onOpenGlossary={() => setIsGlossaryOpen(true)} />;
      case 'briefing':
        return <BriefingPage />;
      case 'dashboard':
        return <MissionControl onOpenGlossary={() => setIsGlossaryOpen(true)} />;
      case 'resources':
        return <ResourceCenter />;
      case 'emergencies':
        return <EmergencyCenter />;
      case 'advisor':
        return <AdvisorPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'debrief':
        return <MissionDebrief />;
      default:
        return <LandingPage onOpenGlossary={() => setIsGlossaryOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-hud-text font-display flex flex-col selection:bg-mars selection:text-space-950">
      <Navbar onOpenGlossary={() => setIsGlossaryOpen(true)} />
      
      <main className="flex-1 pb-12">
        {renderPage()}
      </main>

      <ToastContainer />
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MissionProvider>
      <AppContent />
    </MissionProvider>
  );
};

export default App;
