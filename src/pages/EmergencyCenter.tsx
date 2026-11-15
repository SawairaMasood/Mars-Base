import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Flame,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { EmergencyOption, MissionEvent } from '../types';

export const EmergencyCenter: React.FC = () => {
  const { events, activeEvents, resolveEmergency, activeMission } = useMission();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const resolvedEvents = events.filter((e) => e.status === 'RESOLVED');

  const handleResolve = async (eventId: string, optionId: string) => {
    setResolvingId(`${eventId}_${optionId}`);
    try {
      await resolveEmergency(eventId, optionId);
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-hud-red/20 text-hud-red border border-hud-red/40 animate-pulse">
            CRITICAL SEVERITY
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-hud-amber/20 text-hud-amber border border-hud-amber/40">
            HIGH SEVERITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40">
            ELEVATED RISK
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-space-700 text-hud-muted">
            LOW ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-hud-red/30 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-hud-red tracking-widest font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            Tactical Incident & Crisis Command
          </span>
          <h1 className="text-3xl font-display font-black text-hud-text tracking-wide">
            EMERGENCY RESPONSE CENTER
          </h1>
          <p className="text-xs font-mono text-hud-muted mt-1">
            Real-time management of Martian anomalies, environmental hazards, and hardware failures.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-hud-panel-alert border border-hud-red/40 text-xs font-mono">
          <span className="text-hud-muted">ACTIVE ANOMALIES:</span>
          <span className="font-bold text-hud-red">{activeEvents.length} UNRESOLVED</span>
        </div>
      </div>

      {/* Active Incidents Section */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-hud-text flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-hud-red" />
          Active Incident Tickets Awaiting Decision
        </h2>

        {activeEvents.length === 0 ? (
          <div className="p-8 rounded-2xl hud-panel border border-space-700 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-hud-green mx-auto" />
            <h3 className="font-display font-bold text-base text-hud-text">
              All Colony Sectors Operating Within Nominal Thresholds
            </h3>
            <p className="text-xs font-mono text-hud-muted max-w-md mx-auto">
              No active emergency tickets logged. Continue regular life-support maintenance and monitor atmospheric dust sensors.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeEvents.map((event) => {
              let options: EmergencyOption[] = [];
              try {
                options = JSON.parse(event.options);
              } catch {
                options = [];
              }

              return (
                <div
                  key={event.id}
                  className="p-6 rounded-2xl bg-hud-panel-alert border border-hud-red/50 shadow-danger-glow space-y-5"
                >
                  {/* Event Title and Severity */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hud-red/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-hud-red/20 border border-hud-red text-hud-red">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase text-hud-red font-bold">
                            SOL {event.day} // INCIDENT #{event.id.slice(0, 6)}
                          </span>
                          {getSeverityBadge(event.severity)}
                        </div>
                        <h3 className="text-lg font-display font-bold text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Incident Description */}
                  <p className="text-sm text-hud-text/90 font-sans leading-relaxed bg-space-950/60 p-4 rounded-xl border border-hud-red/30">
                    {event.description}
                  </p>

                  {/* Tactical Decision Options */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-hud-red">
                      Select Tactical Directive:
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {options.map((opt) => {
                        const isWorking = resolvingId === `${event.id}_${opt.id}`;

                        return (
                          <div
                            key={opt.id}
                            className="p-4 rounded-xl bg-space-900/90 border border-space-700 hover:border-hud-cyan/50 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <h4 className="font-display font-bold text-sm text-hud-text mb-1">
                                {opt.label}
                              </h4>
                              <p className="text-xs font-sans text-hud-muted leading-relaxed mb-3">
                                {opt.description}
                              </p>

                              {/* Resource impact pill */}
                              <div className="p-2.5 rounded-lg bg-space-950 border border-space-800 text-[11px] font-mono space-y-1 mb-3">
                                <div className="text-hud-amber font-semibold">
                                  IMPACT: {opt.benefit}
                                </div>
                                {opt.resourceCost && Object.keys(opt.resourceCost).length > 0 && (
                                  <div className="text-hud-red text-[10px]">
                                    COST: {JSON.stringify(opt.resourceCost)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleResolve(event.id, opt.id)}
                              disabled={isWorking}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 transition-all shadow-hud-glow disabled:opacity-50"
                            >
                              <span>{isWorking ? 'Authorizing...' : 'Authorize Directive'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Incidents History */}
      {resolvedEvents.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-space-800">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-hud-muted flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-hud-green" />
            Resolved Emergency Archive ({resolvedEvents.length})
          </h2>

          <div className="space-y-3">
            {resolvedEvents.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-space-900/60 border border-space-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-hud-muted">SOL {rev.day}</span>
                    <span className="font-display font-bold text-hud-text">{rev.title}</span>
                  </div>
                  <p className="text-hud-muted font-sans text-[11px]">
                    {rev.impactDescription || `Action taken: ${rev.selectedOption}`}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-hud-green/10 text-hud-green border border-hud-green/30 font-mono text-[10px] shrink-0 font-bold">
                  RESOLVED
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
