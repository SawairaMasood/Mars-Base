import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { ScienceExplainerModal } from '../components/modals/ScienceExplainerModal';
import {
  Wind,
  Droplets,
  Sprout,
  Zap,
  ShieldAlert,
  Home,
  Heart,
  Wrench,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { SystemActionDefinition } from '../types';

export const ResourceCenter: React.FC = () => {
  const { resources, actionCatalog, runAction, activeMission } = useMission();
  const [selectedAction, setSelectedAction] = useState<SystemActionDefinition | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [scienceModal, setScienceModal] = useState<{ title: string; note: string } | null>(null);

  if (!resources) {
    return <div className="text-center p-8 text-hud-muted">No telemetry available.</div>;
  }

  const handleExecute = async (action: SystemActionDefinition) => {
    setLoadingAction(action.actionType);
    try {
      await runAction(action.actionType);
      setSelectedAction(null);
    } catch (err) {
      // Toast handles error in context
    } finally {
      setLoadingAction(null);
    }
  };

  // Helper to check if player can afford an action
  const canAfford = (cost: any) => {
    if (!cost) return true;
    if (cost.oxygen && resources.oxygen < cost.oxygen) return false;
    if (cost.water && resources.water < cost.water) return false;
    if (cost.food && resources.food < cost.food) return false;
    if (cost.power && resources.power < cost.power) return false;
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-hud-cyan/20 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-mars tracking-widest font-bold">
            Life Support Subsystems // Closed-Loop ECLSS
          </span>
          <h1 className="text-3xl font-display font-black text-hud-text tracking-wide">
            RESOURCE MANAGEMENT CENTER
          </h1>
          <p className="text-xs font-mono text-hud-muted mt-1">
            Authorize chemical cycles, power allocation, and biological harvesting to maintain outpost equilibrium.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-space-850 border border-hud-cyan/20 text-xs font-mono">
          <span className="text-hud-muted">BATTERY RESERVE:</span>
          <span className={`font-bold ${resources.power < 30 ? 'text-hud-red' : 'text-hud-cyan'}`}>
            {resources.power.toFixed(1)} kWh
          </span>
        </div>
      </div>

      {/* Grid of Subsystems and Available Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actionCatalog.map((action) => {
          const affordable = canAfford(action.cost);
          const isSelected = selectedAction?.actionType === action.actionType;

          return (
            <div
              key={action.actionType}
              className={`p-6 rounded-2xl hud-panel border transition-all duration-300 flex flex-col justify-between ${
                !affordable
                  ? 'border-space-800 opacity-60'
                  : isSelected
                  ? 'border-hud-cyan shadow-hud-glow bg-space-800/90'
                  : 'border-space-700 hover:border-hud-cyan/40'
              }`}
            >
              <div>
                {/* System Title and Science Explainer Link */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-hud-cyan tracking-wider">
                      {action.systemName}
                    </span>
                    <h3 className="text-base font-display font-bold text-hud-text">
                      {action.title}
                    </h3>
                  </div>

                  <button
                    onClick={() =>
                      setScienceModal({
                        title: action.title,
                        note: action.scienceNote,
                      })
                    }
                    className="p-1.5 rounded-lg text-hud-muted hover:text-mars hover:bg-space-800 transition-colors"
                    title="NASA Science Explainer"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs font-sans text-hud-muted leading-relaxed mb-4">
                  {action.description}
                </p>

                {/* Trade-Off Matrix */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-space-900/80 border border-space-800 text-xs font-mono">
                  {/* Cost */}
                  <div>
                    <span className="text-[10px] text-hud-red uppercase block font-semibold mb-1">
                      Resource Cost:
                    </span>
                    {action.cost && Object.keys(action.cost).length > 0 ? (
                      <div className="space-y-0.5">
                        {Object.entries(action.cost).map(([res, val]) => (
                          <div key={res} className="text-hud-red flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            <span>
                              -{Number(val)} {res.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-hud-muted">Nominal</span>
                    )}
                  </div>

                  {/* Gain */}
                  <div>
                    <span className="text-[10px] text-hud-green uppercase block font-semibold mb-1">
                      Resource Yield:
                    </span>
                    {action.gain && Object.keys(action.gain).length > 0 ? (
                      <div className="space-y-0.5">
                        {Object.entries(action.gain).map(([res, val]) => (
                          <div key={res} className="text-hud-green flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>
                              +{Number(val)} {res.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-hud-muted">Stability</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button & Confirmation Trigger */}
              <div className="pt-3 border-t border-space-800 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-hud-muted">
                  {affordable ? 'Conditions Ready' : 'Insufficient Resources'}
                </span>

                <button
                  onClick={() => setSelectedAction(action)}
                  disabled={!affordable || loadingAction !== null}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    affordable
                      ? 'bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 shadow-hud-glow'
                      : 'bg-space-800 text-hud-muted cursor-not-allowed'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Execute Cycle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl hud-panel border border-hud-cyan/50 p-6 shadow-hud-glow animate-fade-in">
            <h3 className="font-display font-bold text-lg text-hud-text mb-2">
              Confirm Subsystem Overcharge
            </h3>
            <p className="text-xs font-sans text-hud-muted mb-4">
              Authorize "{selectedAction.title}"? Resources will be deducted immediately from the colony reserves.
            </p>

            <div className="p-3 rounded-xl bg-space-900 border border-space-700 mb-6 text-xs font-mono space-y-1">
              <div className="text-hud-red">
                Deducting: {JSON.stringify(selectedAction.cost)}
              </div>
              <div className="text-hud-green">
                Producing: {JSON.stringify(selectedAction.gain)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-hud-muted hover:text-hud-text"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecute(selectedAction)}
                disabled={loadingAction !== null}
                className="px-5 py-2 rounded-xl font-mono text-xs font-bold uppercase bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 shadow-hud-glow"
              >
                {loadingAction ? 'Executing...' : 'Authorize Execution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Science Explainer Modal */}
      <ScienceExplainerModal
        title={scienceModal?.title || null}
        scienceNote={scienceModal?.note || null}
        onClose={() => setScienceModal(null)}
      />
    </div>
  );
};
