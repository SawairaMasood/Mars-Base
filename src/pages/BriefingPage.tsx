import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  Compass,
  Users,
  Shield,
  Layers,
  Zap,
  Droplets,
  Wind,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { DifficultyLevel } from '../types';

export const BriefingPage: React.FC = () => {
  const { startMission, loading } = useMission();

  const [commanderName, setCommanderName] = useState('Commander Alex Shepard');
  const [missionName, setMissionName] = useState('Ares Alpha IV');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('STANDARD');

  const crewMembers = [
    {
      role: 'Mission Commander',
      name: commanderName,
      specialty: 'Orbital Dynamics & Emergency Protocols',
      bio: 'Former test pilot with 1,200 hours in lunar analog simulation habitats.',
    },
    {
      role: 'Life Support Specialist',
      name: 'Dr. Sarah Vance',
      specialty: 'ECLSS Closed-Loop Chemical Engineering',
      bio: 'Chemical engineer specialized in catalytic water recovery and MOXIE reactors.',
    },
    {
      role: 'Botanist & Agronomist',
      name: 'Dr. Hiroshi Chen',
      specialty: 'Controlled Environment Hydroponics',
      bio: 'Pioneered micro-gravity aeroponic potato and dwarf wheat nutrient delivery.',
    },
    {
      role: 'Flight Systems Engineer',
      name: 'Elena Okafor',
      specialty: 'Nuclear Microgrid & Basalt Regolith Shielding',
      bio: 'Robotics expert tasked with solar array maintenance and structural hull repairs.',
    },
  ];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startMission(missionName, commanderName, difficulty);
    } catch (err) {
      console.error('Launch failed', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Title Header */}
      <div className="mb-8 border-b border-hud-cyan/20 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-mars uppercase tracking-widest font-bold mb-1">
          <Compass className="w-4 h-4" />
          Pre-Flight Mission Authorization Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-wider text-hud-text">
          OPERATION RED PLANET // FLIGHT BRIEFING
        </h1>
        <p className="text-sm text-hud-muted mt-1 font-mono">
          Outpost: Chryse Planitia Base // Primary Objective: 30 Sols Outpost Sustainability
        </p>
      </div>

      <form onSubmit={handleLaunch} className="space-y-8">
        {/* Mission Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl hud-panel border border-hud-cyan/30 space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-hud-cyan flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Mission Dossier & Commander Log
            </h2>

            <div>
              <label className="block text-xs font-mono text-hud-muted uppercase mb-1">
                Mission Name / Call-Sign
              </label>
              <input
                type="text"
                required
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-xl px-4 py-2.5 text-sm font-mono text-hud-text focus:outline-none focus:border-hud-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-hud-muted uppercase mb-1">
                Commander Name
              </label>
              <input
                type="text"
                required
                value={commanderName}
                onChange={(e) => setCommanderName(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-xl px-4 py-2.5 text-sm font-mono text-hud-text focus:outline-none focus:border-hud-cyan"
              />
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="p-6 rounded-2xl hud-panel border border-hud-cyan/30 space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-hud-cyan flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Simulation Difficulty Setting
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'BEGINNER',
                  label: 'Beginner',
                  desc: 'Forgiving consumption rates, low incident frequency. Ideal for first-time cadet commanders.',
                  color: 'text-hud-green border-hud-green',
                },
                {
                  id: 'STANDARD',
                  label: 'Standard',
                  desc: 'Realistic balance of daily life-support load, power generation, and environmental dust storms.',
                  color: 'text-hud-cyan border-hud-cyan',
                },
                {
                  id: 'EXPERT',
                  label: 'Expert',
                  desc: 'Punishing consumption, frequent dust storms & CME radiation events. Zero margin for tactical error.',
                  color: 'text-hud-red border-hud-red',
                },
              ].map((lvl) => {
                const isSelected = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id as DifficultyLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `bg-space-800 ${lvl.color} shadow-hud-glow`
                        : 'border-space-700 bg-space-900/60 text-hud-muted hover:border-space-600'
                    }`}
                  >
                    <div className="font-display font-bold text-xs uppercase mb-1">
                      {lvl.label}
                    </div>
                    <p className="text-[10px] font-sans text-hud-muted line-clamp-3">
                      {lvl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Crew Manifest */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-hud-cyan" />
            <h2 className="font-display font-bold text-lg text-hud-text">
              Assigned Crew Manifest (4 Astronauts)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crewMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl hud-panel border border-space-700 hover:border-hud-cyan/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-hud-muted">
                      Specialist #{idx + 1}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-hud-green" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-hud-text">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-hud-cyan mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] font-sans text-hud-muted mt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-space-800 text-[10px] font-mono text-mars">
                  FOCUS: {member.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Initial Inventory & Environmental Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initial Inventory */}
          <div className="p-6 rounded-2xl hud-panel border border-space-700 space-y-3">
            <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-hud-green" />
              Initial Life-Support Manifest (Day 1 Baseline)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">OXYGEN BUFFER</span>
                <span className="text-hud-cyan font-bold text-sm">100.0 Units (100%)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">POTABLE WATER</span>
                <span className="text-hud-cyan font-bold text-sm">100.0 Units (100%)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">CALORIC FOOD</span>
                <span className="text-hud-cyan font-bold text-sm">100.0 Units (100%)</span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">ELECTRICAL GRID</span>
                <span className="text-hud-cyan font-bold text-sm">100.0 kWh (100%)</span>
              </div>
            </div>
          </div>

          {/* Environmental Hazards */}
          <div className="p-6 rounded-2xl hud-panel border border-space-700 space-y-3">
            <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-hud-amber" />
              Martian Environmental Hazards
            </h3>
            <div className="space-y-2 text-xs font-sans text-hud-muted">
              <p className="flex items-start gap-2">
                <span className="text-mars font-bold shrink-0">• Atmospheric Thinness:</span>
                Surface pressure is ~0.6 kPa (less than 1% of Earth). Habitat integrity breaches mean immediate explosive decompression.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-mars font-bold shrink-0">• Cosmic Radiation:</span>
                Absence of a geomagnetic field exposes astronauts to galactic cosmic rays and Coronal Mass Ejections.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-mars font-bold shrink-0">• Dust Storms:</span>
                Fine iron-oxide dust coats photovoltaic glass, dropping electrical generation by up to 75%.
              </p>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-mono text-base font-bold uppercase tracking-wider bg-gradient-to-r from-mars to-mars-dark text-space-950 hover:brightness-110 transition-all shadow-mars-glow disabled:opacity-50"
          >
            <span>{loading ? 'Initializing Habitat...' : 'Initialize Mission & Take Command'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
