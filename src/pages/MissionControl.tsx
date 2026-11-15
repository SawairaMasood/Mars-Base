import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { ResourceGauge } from '../components/hud/ResourceGauge';
import { MarsColonyView, ColonyStructure } from '../components/colony/MarsColonyView';
import { StructureModal } from '../components/colony/StructureModal';
import { ScienceExplainerModal } from '../components/modals/ScienceExplainerModal';
import {
  Wind,
  Droplets,
  Sprout,
  Zap,
  ShieldAlert,
  Heart,
  Home,
  AlertTriangle,
  FastForward,
  Wrench,
  Bot,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface MissionControlProps {
  onOpenGlossary: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({ onOpenGlossary }) => {
  const {
    activeMission,
    resources,
    recentDeltas,
    advancingDay,
    solTransition,
    advanceSol,
    activeEvents,
    setActiveTab,
    runAction,
  } = useMission();

  const [selectedStructure, setSelectedStructure] = useState<ColonyStructure | null>(null);
  const [scienceModalData, setScienceModalData] = useState<{ title: string; note: string } | null>(null);

  if (!activeMission || !resources) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <Activity className="w-12 h-12 text-hud-muted animate-spin mb-4" />
        <h2 className="text-xl font-display font-bold text-hud-text">
          No Active Mission Found
        </h2>
        <p className="text-xs font-mono text-hud-muted mt-2 mb-6">
          Initialize a new mission in the flight briefing room to take command.
        </p>
        <button
          onClick={() => setActiveTab('briefing')}
          className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-mars text-space-950 hover:bg-mars-dark transition-all shadow-mars-glow"
        >
          Open Mission Briefing
        </button>
      </div>
    );
  }

  const handleOpenScience = (title: string, note: string) => {
    setScienceModalData({ title, note });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Sol Transition Cinematic Overlay */}
      {solTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-950/90 backdrop-blur-lg animate-fade-in pointer-events-none">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono tracking-widest text-mars uppercase animate-pulse">
              Orbital Dawn Sequence // Chryse Planitia
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-hud-text tracking-wider glow-mars">
              SOL {activeMission.currentDay} ADVANCING
            </h2>
            <p className="text-sm font-mono text-hud-cyan">
              Processing diurnal life-support consumption & PV regeneration...
            </p>
          </div>
        </div>
      )}

      {/* Top Banner: Active Emergency Incidents */}
      {activeEvents.length > 0 && (
        <div className="p-4 rounded-2xl bg-hud-panel-alert border border-hud-red/50 shadow-danger-glow flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-hud-red/20 border border-hud-red text-hud-red">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-hud-red tracking-widest">
                CRITICAL SYSTEM ALERT // {activeEvents.length} INCIDENT(S) REQUIRE COMMAND RESOLUTION
              </span>
              <h3 className="text-sm sm:text-base font-display font-bold text-white">
                {activeEvents[0].title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('emergencies')}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-hud-red text-white hover:bg-hud-red/80 transition-all shadow-danger-glow shrink-0"
          >
            <span>Open Crisis Desk</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mission Quick Actions & Sol Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl hud-panel border border-hud-cyan/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-hud-muted">CURRENT OPERATION:</span>
            <span className="font-display font-bold text-sm text-hud-cyan">
              {activeMission.name}
            </span>
          </div>
          <p className="text-xs text-hud-muted font-sans mt-0.5">
            Difficulty: <span className="font-mono text-hud-text font-bold">{activeMission.difficulty}</span> // Status: <span className="font-mono text-hud-green font-bold">{activeMission.status}</span>
          </p>
        </div>

        {/* Big ADVANCE SOL Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('advisor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase border border-mars/40 text-mars bg-mars/10 hover:bg-mars/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Consult ARES</span>
          </button>

          <button
            onClick={advanceSol}
            disabled={advancingDay || activeMission.status !== 'ACTIVE'}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-hud-cyan to-hud-teal text-space-950 hover:brightness-110 transition-all shadow-hud-glow disabled:opacity-50"
          >
            <FastForward className="w-4 h-4" />
            <span>{advancingDay ? 'Advancing Sol...' : `Advance to Sol ${activeMission.currentDay + 1}`}</span>
          </button>
        </div>
      </div>

      {/* Main 7 Resource Meters Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-hud-muted flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-hud-cyan" />
            Life-Support Telemetry Array (NASA HUD)
          </span>
          <button
            onClick={() => setActiveTab('resources')}
            className="text-xs font-mono text-hud-cyan hover:underline"
          >
            Subsystem Control Center &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <ResourceGauge
            label="Oxygen"
            value={resources.oxygen}
            icon={Wind}
            delta={recentDeltas?.oxygen}
            tooltip="MOXIE & Electrolysis Reserves (Min > 20%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Water"
            value={resources.water}
            icon={Droplets}
            delta={recentDeltas?.water}
            tooltip="ECLSS Closed-Loop Potable H2O (Min > 20%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Food"
            value={resources.food}
            icon={Sprout}
            delta={recentDeltas?.food}
            tooltip="Hydroponic Caloric Rations (Min > 20%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Power"
            value={resources.power}
            icon={Zap}
            delta={recentDeltas?.power}
            tooltip="Photovoltaic Microgrid & Batteries (Min > 25%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Radiation"
            value={resources.radiation}
            icon={ShieldAlert}
            delta={recentDeltas?.radiation}
            isInvertedRisk={true}
            tooltip="Cumulative Cosmic Flux Index (Keep < 60%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Morale"
            value={resources.morale}
            icon={Heart}
            delta={recentDeltas?.morale}
            tooltip="Astronaut Psychological Wellbeing (Min > 30%)"
            onClick={() => setActiveTab('resources')}
          />
          <ResourceGauge
            label="Integrity"
            value={resources.integrity}
            icon={Home}
            delta={recentDeltas?.integrity}
            tooltip="Inflatable Dome & Regolith Shell Hull (Min > 30%)"
            onClick={() => setActiveTab('resources')}
          />
        </div>
      </div>

      {/* Interactive Mars Colony Map */}
      <MarsColonyView onSelectStructure={(s) => setSelectedStructure(s)} />

      {/* Structure Diagnostics Modal */}
      <StructureModal
        structure={selectedStructure}
        onClose={() => setSelectedStructure(null)}
        onOpenScience={handleOpenScience}
      />

      {/* Science Explainer Modal */}
      <ScienceExplainerModal
        title={scienceModalData?.title || null}
        scienceNote={scienceModalData?.note || null}
        onClose={() => setScienceModalData(null)}
      />
    </div>
  );
};
