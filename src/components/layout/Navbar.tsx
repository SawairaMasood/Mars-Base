import React from 'react';
import { useMission } from '../../context/MissionContext';
import {
  Activity,
  AlertTriangle,
  Bot,
  Compass,
  Cpu,
  FileText,
  LineChart,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenGlossary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGlossary }) => {
  const {
    activeMission,
    activeTab,
    setActiveTab,
    unresolvedCount,
    isMuted,
    toggleMute,
    pauseMission,
    resumeMission,
    restartMission,
  } = useMission();

  const getStatusBadge = () => {
    if (!activeMission) return null;
    switch (activeMission.status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hud-green/20 text-hud-green border border-hud-green/40">
            <span className="w-1.5 h-1.5 rounded-full bg-hud-green animate-pulse" />
            TELEMETRY LIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hud-amber/20 text-hud-amber border border-hud-amber/40">
            <span className="w-1.5 h-1.5 rounded-full bg-hud-amber" />
            PAUSED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40">
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-hud-red/20 text-hud-red border border-hud-red/40 animate-pulse">
            HABITAT LOST
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-space-950/80 backdrop-blur-md border-b border-hud-cyan/20 shadow-hud-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mars to-mars-dark flex items-center justify-center shadow-mars-glow border border-mars-light/40">
              <Compass className="w-6 h-6 text-space-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-wider text-hud-text glow-mars">
                  MARSBASE
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.2 bg-mars/20 text-mars border border-mars/40 rounded">
                  EXPEDITION
                </span>
              </div>
              <p className="text-[10px] text-hud-muted tracking-widest font-mono">
                BEYOND EARTH // NASA TRAINER
              </p>
            </div>
          </div>

          {/* Active Mission Telemetry Pill */}
          {activeMission && (
            <div className="hidden md:flex items-center gap-4 bg-space-800/80 border border-hud-cyan/20 px-4 py-1.5 rounded-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-hud-muted">Mission Sol</span>
                <span className="text-sm font-display font-bold text-hud-cyan">
                  SOL {activeMission.currentDay} <span className="text-xs text-hud-muted">/ {activeMission.duration}</span>
                </span>
              </div>
              <div className="h-6 w-px bg-hud-cyan/20" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-hud-muted">Commander</span>
                <span className="text-sm font-display font-bold text-hud-text">
                  {activeMission.commanderName}
                </span>
              </div>
              <div className="h-6 w-px bg-hud-cyan/20" />
              <div>{getStatusBadge()}</div>
            </div>
          )}

          {/* Navigation Tabs */}
          {activeMission ? (
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50 shadow-hud-glow'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="Mission Control HUD"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Mission Control</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'resources'
                    ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50 shadow-hud-glow'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="Life Support & Subsystems"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Life Support</span>
              </button>

              <button
                onClick={() => setActiveTab('emergencies')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'emergencies'
                    ? 'bg-hud-red/20 text-hud-red border border-hud-red/50 shadow-danger-glow'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="Emergency Incidents"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Crisis Desk</span>
                {unresolvedCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-hud-red text-white animate-bounce">
                    {unresolvedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('advisor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'advisor'
                    ? 'bg-mars/20 text-mars border border-mars/50 shadow-mars-glow'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="ARES AI Mission Advisor"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">ARES AI</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50 shadow-hud-glow'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="Flight Telemetry & Snapshots"
              >
                <LineChart className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Telemetry</span>
              </button>

              <button
                onClick={() => setActiveTab('debrief')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'debrief'
                    ? 'bg-hud-amber/20 text-hud-amber border border-hud-amber/50'
                    : 'text-hud-muted hover:text-hud-text hover:bg-space-800'
                }`}
                title="Debrief & Mission Score"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Debrief</span>
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('briefing')}
                className="px-4 py-1.5 rounded-md text-xs font-mono font-bold tracking-wider uppercase bg-mars hover:bg-mars-dark text-space-950 transition-all shadow-mars-glow"
              >
                Initialize Mission
              </button>
            </div>
          )}

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGlossary}
              className="p-2 rounded-md text-hud-muted hover:text-hud-cyan hover:bg-space-800 transition-colors"
              title="Science Guide & Glossary"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {activeMission && (
              <>
                {activeMission.status === 'ACTIVE' ? (
                  <button
                    onClick={pauseMission}
                    className="p-2 rounded-md text-hud-muted hover:text-hud-amber hover:bg-space-800 transition-colors"
                    title="Pause Mission Clock"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : activeMission.status === 'PAUSED' ? (
                  <button
                    onClick={resumeMission}
                    className="p-2 rounded-md text-hud-green hover:bg-space-800 transition-colors"
                    title="Resume Mission Clock"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  onClick={restartMission}
                  className="p-2 rounded-md text-hud-muted hover:text-hud-red hover:bg-space-800 transition-colors"
                  title="Restart Mission to Sol 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={toggleMute}
              className={`p-2 rounded-md transition-colors ${
                isMuted
                  ? 'text-hud-muted hover:text-hud-text'
                  : 'text-hud-cyan hover:bg-space-800'
              }`}
              title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
