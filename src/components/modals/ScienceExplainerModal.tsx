import React from 'react';
import { X, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

interface ScienceExplainerModalProps {
  title: string | null;
  scienceNote: string | null;
  onClose: () => void;
}

export const ScienceExplainerModal: React.FC<ScienceExplainerModalProps> = ({
  title,
  scienceNote,
  onClose,
}) => {
  if (!title) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl hud-panel border border-mars/40 p-6 shadow-mars-glow">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-mars/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-mars/20 border border-mars text-mars">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-mars tracking-widest font-bold">
                NASA Educational Science Explainer
              </span>
              <h3 className="text-lg font-display font-bold text-hud-text">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-hud-muted hover:text-mars hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm text-hud-text leading-relaxed">
          <div className="p-4 rounded-xl bg-space-900/90 border border-space-700 font-sans">
            <p className="text-base text-hud-text font-medium mb-3">
              {scienceNote}
            </p>
            <p className="text-xs text-hud-muted leading-relaxed">
              Living on Mars requires balancing strict thermodynamic mass and energy balances. Unlike Earth, which provides a protective magnetic field, dense nitrogen-oxygen atmosphere, and endless hydrological cycle, Martian explorers must synthesize, recycle, and shield every vital element in-situ.
            </p>
          </div>

          {/* Educational Disclaimer Callout */}
          <div className="p-3.5 rounded-xl bg-space-950/70 border border-hud-cyan/20 flex gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-hud-cyan shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-mono font-bold text-hud-cyan">
                Educational Model vs Real-World Flight Hardware:
              </span>
              <p className="text-hud-muted">
                MARSBASE scales complex biological, chemical, and orbital variables into educational units (0-100%) for junior astronaut training. Real NASA missions utilize multi-redundant triplicate systems with micro-level telemetry (e.g. partial pressures in Pascals, millisieverts, and moles of consumables).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-mars/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-mars hover:bg-mars-dark text-space-950 transition-all shadow-mars-glow"
          >
            Acknowledge & Return
          </button>
        </div>
      </div>
    </div>
  );
};
