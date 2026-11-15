import React from 'react';
import { ColonyStructure } from './MarsColonyView';
import { useMission } from '../../context/MissionContext';
import { X, Wrench, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';

interface StructureModalProps {
  structure: ColonyStructure | null;
  onClose: () => void;
  onOpenScience: (title: string, note: string) => void;
}

export const StructureModal: React.FC<StructureModalProps> = ({
  structure,
  onClose,
  onOpenScience,
}) => {
  const { runAction } = useMission();
  const [loading, setLoading] = React.useState(false);

  if (!structure) return null;

  const Icon = structure.icon;
  const isAlert = structure.status === 'ALERT';

  const handleAction = async () => {
    if (!structure.actionType) return;
    setLoading(true);
    try {
      await runAction(structure.actionType);
      onClose();
    } catch (err) {
      // Toast handles error in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl hud-panel border border-hud-cyan/40 p-6 shadow-hud-glow">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-hud-cyan/20">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl border ${
                isAlert
                  ? 'bg-hud-red/20 border-hud-red text-hud-red shadow-danger-glow'
                  : 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-hud-muted tracking-widest">
                {structure.category}
              </span>
              <h3 className="text-lg font-display font-bold text-hud-text">
                {structure.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-hud-muted hover:text-hud-cyan hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="py-4 space-y-4">
          {/* Status and Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-space-900/80 border border-space-700">
              <span className="text-[10px] font-mono text-hud-muted">OPERATIONAL STATUS</span>
              <div className="flex items-center gap-2 mt-1">
                {isAlert ? (
                  <AlertTriangle className="w-4 h-4 text-hud-red animate-pulse" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-hud-green" />
                )}
                <span
                  className={`font-mono text-sm font-bold ${
                    isAlert ? 'text-hud-red' : 'text-hud-green'
                  }`}
                >
                  {structure.status}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-space-900/80 border border-space-700">
              <span className="text-[10px] font-mono text-hud-muted">EFFICIENCY RATING</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-display font-bold text-hud-cyan">
                  {structure.conditionPercent}%
                </span>
                <span className="text-[10px] font-mono text-hud-muted">OF THEORETICAL MAX</span>
              </div>
            </div>
          </div>

          {/* Subsystem Purpose */}
          <div>
            <span className="text-xs font-mono font-semibold text-hud-muted uppercase">
              Mission Role & Engineering Function
            </span>
            <p className="mt-1 text-sm text-hud-text leading-relaxed bg-space-900/50 p-3 rounded-lg border border-space-800">
              {structure.purpose}
            </p>
          </div>

          {/* Consumption Specs */}
          <div>
            <span className="text-xs font-mono font-semibold text-hud-muted uppercase">
              Telemetry & Flow Dynamics
            </span>
            <p className="mt-1 text-xs font-mono text-hud-cyan bg-space-900/60 p-2.5 rounded-lg border border-hud-cyan/20">
              {structure.consumptionInfo}
            </p>
          </div>

          {/* Scientific note callout */}
          <div className="p-3 rounded-xl bg-mars/10 border border-mars/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-mars flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                NASA Aerospace Science Context
              </span>
              <button
                onClick={() => onOpenScience(structure.name, structure.scienceNote)}
                className="text-[11px] font-mono text-hud-cyan underline hover:text-hud-text"
              >
                Read Explainer
              </button>
            </div>
            <p className="mt-1.5 text-xs text-hud-text/90 italic leading-relaxed">
              "{structure.scienceNote}"
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-hud-cyan/20 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono text-hud-muted hover:text-hud-text transition-colors"
          >
            Close Telemetry
          </button>

          {structure.actionType && (
            <button
              onClick={handleAction}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-hud-cyan hover:bg-hud-cyan/80 text-space-950 transition-all shadow-hud-glow disabled:opacity-50"
            >
              <Wrench className="w-4 h-4" />
              {loading ? 'Executing Cycle...' : structure.actionLabel || 'Execute Cycle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
