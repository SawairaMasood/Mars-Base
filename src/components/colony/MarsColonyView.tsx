import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import {
  Sun,
  Droplets,
  Wind,
  Radio,
  Home,
  ShieldAlert,
  Sprout,
  Activity,
  Layers,
  Wrench,
} from 'lucide-react';

export interface ColonyStructure {
  id: string;
  name: string;
  category: string;
  icon: any;
  purpose: string;
  status: 'OPTIMAL' | 'DEGRADED' | 'ALERT';
  conditionPercent: number;
  consumptionInfo: string;
  scienceNote: string;
  actionType?: string;
  actionLabel?: string;
  x: number; // percentage on map
  y: number; // percentage on map
}

interface MarsColonyViewProps {
  onSelectStructure: (structure: ColonyStructure) => void;
}

export const MarsColonyView: React.FC<MarsColonyViewProps> = ({ onSelectStructure }) => {
  const { resources } = useMission();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Derive dynamic building health from real colony resources
  const structures: ColonyStructure[] = [
    {
      id: 'central_dome',
      name: 'Main Inflatable Habitat Dome',
      category: 'Command & Life Support Hub',
      icon: Home,
      purpose: 'Primary pressurized living quarters and command nerve center for the 4 astronauts.',
      status: (resources?.integrity || 90) > 60 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.round(resources?.integrity || 90),
      consumptionInfo: 'Draws 6 kW continuous life-support power; retains 101.3 kPa earth-equivalent atmosphere.',
      scienceNote: 'TransHab-style multi-layer Kevlar and Nextel fabric envelopes provide puncture resistance against Martian micrometeorites.',
      actionType: 'HABITAT_STRUCTURAL_PATCH',
      actionLabel: 'Inspect & Patch Hull Integrity',
      x: 50,
      y: 48,
    },
    {
      id: 'moxie_plant',
      name: 'MOXIE Oxygen Generator',
      category: 'Atmospheric Processing',
      icon: Wind,
      purpose: 'Electrolyzes Martian carbon dioxide (CO2) into breathable diatomic oxygen (O2) and carbon monoxide exhaust.',
      status: (resources?.oxygen || 100) > 50 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.round(resources?.oxygen || 100),
      consumptionInfo: 'Consumes 18 Power per cycle; produces +14 Oxygen.',
      scienceNote: 'Based on the real instrument aboard NASA Perseverance. Operates at 800°C using solid oxide electrolysis cells.',
      actionType: 'OXYGEN_SURGE',
      actionLabel: 'Initiate MOXIE Oxygen Cycle',
      x: 32,
      y: 38,
    },
    {
      id: 'water_recycler',
      name: 'ECLSS Hydrological Plant',
      category: 'Closed-Loop Hydrology',
      icon: Droplets,
      purpose: 'Recycles habitat greywater, shower runoff, and humidity condensate through catalytic distillation.',
      status: (resources?.water || 100) > 50 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.round(resources?.water || 100),
      consumptionInfo: 'Consumes 14 Power per cycle; generates +15 Potable Water.',
      scienceNote: 'NASA’s ISS ECLSS achieves 98% water reclamation efficiency, without which continuous resupply from Earth is impossible.',
      actionType: 'WATER_RECYCLING_PURGE',
      actionLabel: 'Run Distillation & Filter Purge',
      x: 68,
      y: 38,
    },
    {
      id: 'greenhouse',
      name: 'Hydroponic Bio-Greenhouse',
      category: 'Food Production & Botany',
      icon: Sprout,
      purpose: 'High-density vertical aeroponic and LED farming producing dwarf wheat, microgreens, and sweet potatoes.',
      status: (resources?.food || 100) > 50 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.round(resources?.food || 100),
      consumptionInfo: 'Consumes 12 Power & 10 Water; yields +16 Caloric Food & +2 Oxygen.',
      scienceNote: 'Plants on Mars absorb astronaut-exhaled CO2 while providing fresh phytonutrients crucial for long-duration crew cognitive health.',
      actionType: 'GREENHOUSE_HARVEST_CYCLE',
      actionLabel: 'Harvest Crops & Flush Nutrients',
      x: 72,
      y: 65,
    },
    {
      id: 'solar_farm',
      name: 'Photovoltaic Solar Farm & Batteries',
      category: 'Power Grid',
      icon: Sun,
      purpose: 'Bifacial solar arrays coupled to lithium-sulfur deep storage battery banks.',
      status: (resources?.power || 100) > 40 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.round(resources?.power || 100),
      consumptionInfo: 'Generates ~18 Power daily. Susceptible to electrostatic fine dust coverage.',
      scienceNote: 'Martian dust settlement can degrade panel output by 70%+. Pneumatic puffs or mechanical wipers are required.',
      actionType: 'SOLAR_ARRAY_DUSTING',
      actionLabel: 'Pneumatic Dust Clearance',
      x: 26,
      y: 65,
    },
    {
      id: 'comms_antenna',
      name: 'Deep Space Network Antenna',
      category: 'Communications & Earth Telemetry',
      icon: Radio,
      purpose: 'High-gain X-band parabolic dish maintaining telemetry link with NASA Earth Mission Control (3-22 min light-lag).',
      status: 'OPTIMAL',
      conditionPercent: 98,
      consumptionInfo: 'Continuous low-power beacon; direct uplink to Deep Space Network.',
      scienceNote: 'Due to orbital mechanics, radio signals between Mars and Earth experience a one-way delay of between 3 and 22 minutes.',
      actionType: 'CREW_REST_AND_THERAPY',
      actionLabel: 'Open Earth Video Uplink for Crew',
      x: 50,
      y: 18,
    },
    {
      id: 'rad_shelter',
      name: 'Sub-Regolith Radiation Bunker',
      category: 'Hazard Mitigation',
      icon: ShieldAlert,
      purpose: 'Subterranean crew bunker covered with 4 meters of packed basalt regolith for protection against Solar Particle Events.',
      status: (resources?.radiation || 20) < 50 ? 'OPTIMAL' : 'ALERT',
      conditionPercent: Math.max(0, 100 - Math.round(resources?.radiation || 20)),
      consumptionInfo: 'Draws 22 Power to charge superconducting magnetic deflector coils.',
      scienceNote: 'Martian soil (regolith) acts as an excellent radiation shield against lethal galactic cosmic rays (GCRs) and solar proton flares.',
      actionType: 'RADIATION_MAGNETIC_DEFLECTION',
      actionLabel: 'Discharge Superconducting Shield',
      x: 50,
      y: 78,
    },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden hud-panel border border-hud-cyan/20 p-4 shadow-panel select-none">
      {/* Top Map Bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-hud-cyan/15">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-hud-cyan" />
          <span className="font-display text-xs font-bold tracking-widest text-hud-text uppercase">
            Colony Topography & Subsystem Matrix // Chryse Planitia Base
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-hud-green">
            <span className="w-2 h-2 rounded-full bg-hud-green" />
            ONLINE
          </span>
          <span className="flex items-center gap-1.5 text-hud-red">
            <span className="w-2 h-2 rounded-full bg-hud-red animate-pulse" />
            ATTENTION REQUIRED
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-space-950 rounded-xl overflow-hidden border border-space-700/60">
        {/* Martian Landscape Background with Animated Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#211210] to-[#3A1710] opacity-90" />
        
        {/* Distant Martian Crater Ridge */}
        <svg
          className="absolute bottom-0 w-full h-44 text-[#2C100D] opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 1000 200"
        >
          <path
            d="M0,200 L0,120 Q120,70 250,110 T500,80 T750,120 T1000,90 L1000,200 Z"
            fill="currentColor"
          />
        </svg>

        {/* Foreground terrain ridge */}
        <svg
          className="absolute bottom-0 w-full h-28 text-[#1E0907] opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 1000 150"
        >
          <path
            d="M0,150 L0,80 Q200,40 400,70 T800,50 T1000,75 L1000,150 Z"
            fill="currentColor"
          />
        </svg>

        {/* Starfield & Mars Sky Grid */}
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

        {/* Radiating Radar pulse rings from Antenna at 50%, 18% */}
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-hud-cyan/20 animate-ping opacity-40" />
          <div className="w-48 h-48 rounded-full border border-hud-cyan/10 animate-pulse opacity-20 -mt-36 -ml-12" />
        </div>

        {/* Connecting pressurized utility tunnels */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Main Dome (50, 48) to Comms (50, 18) */}
          <line x1="50%" y1="48%" x2="50%" y2="20%" stroke="rgba(80, 217, 234, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
          {/* Main Dome to Moxie (32, 38) */}
          <line x1="50%" y1="48%" x2="32%" y2="38%" stroke="rgba(80, 217, 234, 0.5)" strokeWidth="3" />
          {/* Main Dome to Water (68, 38) */}
          <line x1="50%" y1="48%" x2="68%" y2="38%" stroke="rgba(80, 217, 234, 0.5)" strokeWidth="3" />
          {/* Main Dome to Solar (26, 65) */}
          <line x1="50%" y1="48%" x2="26%" y2="65%" stroke="rgba(241, 197, 107, 0.5)" strokeWidth="2.5" />
          {/* Main Dome to Greenhouse (72, 65) */}
          <line x1="50%" y1="48%" x2="72%" y2="65%" stroke="rgba(97, 214, 154, 0.5)" strokeWidth="3" />
          {/* Main Dome to Rad Shelter (50, 78) */}
          <line x1="50%" y1="48%" x2="50%" y2="78%" stroke="rgba(255, 117, 79, 0.5)" strokeWidth="4" strokeDasharray="6 3" />
        </svg>

        {/* Colony Interactive Hotspots */}
        {structures.map((s) => {
          const isHovered = hoveredId === s.id;
          const isAlert = s.status === 'ALERT';
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectStructure(s)}
            >
              {/* Outer pulsing ring for alerts */}
              {isAlert && (
                <div className="absolute inset-0 w-14 h-14 -top-2 -left-2 rounded-full border-2 border-hud-red animate-ping opacity-60" />
              )}

              {/* Structure Icon Button */}
              <div
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                  isAlert
                    ? 'bg-hud-red/20 border-hud-red text-hud-red shadow-danger-glow animate-pulse'
                    : isHovered
                    ? 'bg-hud-cyan/30 border-hud-cyan text-hud-cyan shadow-hud-glow scale-110'
                    : 'bg-space-800/90 border-hud-cyan/40 text-hud-text hover:border-hud-cyan'
                }`}
              >
                <Icon className="w-5 h-5" />

                {/* Condition badge */}
                <span
                  className={`absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1 rounded ${
                    isAlert ? 'bg-hud-red text-white' : 'bg-space-950 text-hud-cyan border border-hud-cyan/40'
                  }`}
                >
                  {s.conditionPercent}%
                </span>
              </div>

              {/* Building Label */}
              <div
                className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-center whitespace-nowrap transition-all ${
                  isHovered
                    ? 'bg-space-950/90 text-hud-cyan border border-hud-cyan/50 shadow-hud-glow'
                    : 'bg-space-900/70 text-hud-muted'
                }`}
              >
                {s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
              </div>
            </div>
          );
        })}

        {/* Hover Information Overlay card */}
        {hoveredId && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 p-3 rounded-xl bg-space-950/95 border border-hud-cyan/40 shadow-hud-glow backdrop-blur-md pointer-events-none transition-all">
            {(() => {
              const activeS = structures.find((s) => s.id === hoveredId);
              if (!activeS) return null;
              return (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-xs text-hud-cyan">
                      {activeS.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        activeS.status === 'ALERT'
                          ? 'bg-hud-red/20 text-hud-red'
                          : 'bg-hud-green/20 text-hud-green'
                      }`}
                    >
                      {activeS.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-hud-text line-clamp-2 mb-1.5 font-sans">
                    {activeS.purpose}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-hud-muted pt-1 border-t border-space-700">
                    <span>STATUS: {activeS.conditionPercent}%</span>
                    <span className="text-hud-cyan">CLICK FOR SYSTEM CONTROLS</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-hud-muted font-mono px-1">
        <span>Click any facility on the topography to inspect telemetry and trigger life-support cycles.</span>
        <span className="text-hud-cyan font-semibold">SECTOR: MARS EQUATORIAL BASIN</span>
      </div>
    </div>
  );
};
