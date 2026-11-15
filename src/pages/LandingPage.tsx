import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  Compass,
  Shield,
  Activity,
  Bot,
  Flame,
  ArrowRight,
  Globe2,
  Users,
  Award,
  Sparkles,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';

interface LandingPageProps {
  onOpenGlossary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenGlossary }) => {
  const { setActiveTab, activeMission } = useMission();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background Starfield and Mars Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-mars/20 blur-[120px]" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-hud-cyan/15 blur-[100px]" />
        <div className="absolute inset-0 hud-grid opacity-25" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission Callout */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mars/15 border border-mars/40 text-mars text-xs font-mono font-bold tracking-widest uppercase shadow-mars-glow">
              <Sparkles className="w-4 h-4" />
              NASA Space Apps Challenge 2026 // Junior Astronaut Mission Trainer
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-wider text-hud-text leading-none">
                MARSBASE
              </h1>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-mars tracking-widest glow-mars">
                BEYOND EARTH
              </h2>
            </div>

            <blockquote className="text-lg sm:text-xl font-display text-hud-cyan/90 border-l-2 border-hud-cyan/50 pl-4 italic">
              "Humanity's next home is not a destination. It's a responsibility."
            </blockquote>

            <p className="text-base text-hud-text/80 leading-relaxed font-sans max-w-2xl">
              Take command of a Martian outpost. Manage closed-loop life-support systems, balance critical power trade-offs, shield your 4-astronaut crew from cosmic radiation, and make the engineering decisions that determine human survival on the Red Planet for 30 Sols.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => setActiveTab('briefing')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-mars to-mars-dark text-space-950 hover:brightness-110 transition-all shadow-mars-glow group"
              >
                <span>Start Your Mission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {activeMission && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-hud-cyan/20 border border-hud-cyan/60 text-hud-cyan hover:bg-hud-cyan/30 transition-all shadow-hud-glow"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Sol {activeMission.currentDay}</span>
                </button>
              )}

              <button
                onClick={() => setShowHowToPlay(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-space-800/80 border border-space-700 text-hud-muted hover:text-hud-text hover:border-hud-cyan/40 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>How to Play</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-space-700/60 max-w-lg">
              <div className="p-2.5 rounded-lg bg-space-850/60 border border-space-700">
                <span className="text-[10px] font-mono text-hud-muted block uppercase">Duration</span>
                <span className="font-display font-bold text-sm text-hud-cyan">30 Martian Sols</span>
              </div>
              <div className="p-2.5 rounded-lg bg-space-850/60 border border-space-700">
                <span className="text-[10px] font-mono text-hud-muted block uppercase">Crew Size</span>
                <span className="font-display font-bold text-sm text-hud-text">4 Specialists</span>
              </div>
              <div className="p-2.5 rounded-lg bg-space-850/60 border border-space-700">
                <span className="text-[10px] font-mono text-hud-muted block uppercase">AI Advisor</span>
                <span className="font-display font-bold text-sm text-mars">ARES Neural Core</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Mars Interactive Orb & Telemetry */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Mars Outer Orbital Ring */}
              <div className="absolute inset-0 rounded-full border border-mars/30 border-dashed animate-spin duration-[40000ms] pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border border-hud-cyan/20 animate-spin duration-[60000ms] pointer-events-none" />

              {/* Mars Surface Planet Sphere */}
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 rounded-full shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(255,117,79,0.45)] bg-gradient-to-tr from-[#3b120c] via-[#b54425] to-[#f47c54] overflow-hidden flex items-center justify-center">
                {/* Surface texture swirls */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,180,0.5),transparent_50%)]" />
                <div className="absolute top-1/3 left-10 w-24 h-12 bg-black/25 rounded-full blur-md" />
                <div className="absolute bottom-1/4 right-8 w-32 h-16 bg-black/35 rounded-full blur-md" />
                
                {/* Polar Ice Cap */}
                <div className="absolute top-2 w-20 h-6 bg-white/70 rounded-full blur-sm" />

                {/* Colony Beacon Ping */}
                <div className="absolute top-[45%] left-[55%] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-hud-cyan animate-ping" />
                  <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#50D9EA]" />
                </div>
              </div>

              {/* Floating Telemetry Tags */}
              <div className="absolute -top-2 left-0 p-2 rounded-lg bg-space-950/90 border border-hud-cyan/30 text-[10px] font-mono text-hud-cyan shadow-hud-glow">
                LAT: 22.4° N // LON: 49.9° W
              </div>

              <div className="absolute -bottom-2 right-0 p-2 rounded-lg bg-space-950/90 border border-mars/30 text-[10px] font-mono text-mars shadow-mars-glow">
                ATMOS: 0.6 kPa (95% CO2)
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-space-700/60">
          <div className="p-6 rounded-2xl hud-panel border border-hud-cyan/20 hover:border-hud-cyan/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-hud-cyan/15 border border-hud-cyan/40 flex items-center justify-center text-hud-cyan mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-hud-text mb-2">
              Live Life-Support Simulation
            </h3>
            <p className="text-xs text-hud-muted leading-relaxed font-sans">
              Operate genuine engineering loops: balance MOXIE oxygen electrolysis against photovoltaic kilowatt-hours, recycle greywater, and sustain pressurized hydroponics.
            </p>
          </div>

          <div className="p-6 rounded-2xl hud-panel border border-mars/20 hover:border-mars/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-mars/15 border border-mars/40 flex items-center justify-center text-mars mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-hud-text mb-2">
              Unpredictable Martian Crises
            </h3>
            <p className="text-xs text-hud-muted leading-relaxed font-sans">
              Face global dust storms, coronal mass ejections, airlock seal breaches, and crop fungal blights. Every tactical decision exerts actual physical resource trade-offs.
            </p>
          </div>

          <div className="p-6 rounded-2xl hud-panel border border-hud-green/20 hover:border-hud-green/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-hud-green/15 border border-hud-green/40 flex items-center justify-center text-hud-green mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-hud-text mb-2">
              ARES AI Mission Advisor
            </h3>
            <p className="text-xs text-hud-muted leading-relaxed font-sans">
              Consult your onboard Astronaut Resource Evaluation System powered by Google Gemini with deterministic aerospace rule fallback. Get real-time situational advice.
            </p>
          </div>
        </div>
      </div>

      {/* How To Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl hud-panel border border-hud-cyan/40 p-6 shadow-hud-glow">
            <h3 className="font-display font-bold text-xl text-hud-cyan mb-3">
              Commander's Flight Manual // How to Play
            </h3>

            <div className="space-y-4 text-xs font-sans text-hud-text leading-relaxed">
              <div className="p-3 rounded-xl bg-space-900 border border-space-700">
                <span className="font-mono font-bold text-hud-cyan block mb-1">
                  1. The 30-Sol Survival Goal
                </span>
                You are Commander of 4 astronauts. Your goal is to guide the colony through 30 Martian Sols. Advancing each Sol consumes Oxygen, Water, and Food, while testing your habitat integrity and solar grid.
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-700">
                <span className="font-mono font-bold text-hud-cyan block mb-1">
                  2. Understand Engineering Trade-Offs
                </span>
                Power is the lifeblood of your base. Running MOXIE produces Oxygen but drains batteries. Clearing solar panels costs power now but prevents blackouts. Hydroponics consumes water and power to generate food. Never allow any vital resource to reach 0%!
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-700">
                <span className="font-mono font-bold text-hud-cyan block mb-1">
                  3. Emergency Incident Protocols
                </span>
                When dust storms or solar flares hit, you must choose from tactical options. Consider your margins before deploying EVA repairs or overcharging magnetic shields.
              </div>

              <div className="p-3 rounded-xl bg-space-900 border border-space-700">
                <span className="font-mono font-bold text-hud-cyan block mb-1">
                  4. Consult ARES AI
                </span>
                Unsure why oxygen is plummeting or what to prioritize? Ask ARES in the AI Advisor panel for structured telemetry diagnostics and science-backed recommendations.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-6 py-2 rounded-lg font-mono text-xs font-bold uppercase bg-hud-cyan text-space-950 hover:bg-hud-cyan/80 transition-all"
              >
                Understood, Commander
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <footer className="relative py-4 border-t border-space-800 text-center text-[11px] font-mono text-hud-muted bg-space-950/70 z-10">
        <p>
          NASA Space Apps Challenge 2026 Educational Project // MARSBASE: BEYOND EARTH // Designed for Junior Astronaut Training
        </p>
      </footer>
    </div>
  );
};
