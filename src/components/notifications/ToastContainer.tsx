import React from 'react';
import { useMission } from '../../context/MissionContext';
import { AlertTriangle, CheckCircle, Info, X, AlertOctagon } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useMission();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let border = 'border-hud-cyan/40';
        let bg = 'bg-space-900/95';
        let text = 'text-hud-cyan';
        let Icon = Info;

        if (toast.type === 'danger') {
          border = 'border-hud-red/60';
          bg = 'bg-[#1F0A10]/95';
          text = 'text-hud-red';
          Icon = AlertOctagon;
        } else if (toast.type === 'warning') {
          border = 'border-hud-amber/60';
          bg = 'bg-[#1C150A]/95';
          text = 'text-hud-amber';
          Icon = AlertTriangle;
        } else if (toast.type === 'success') {
          border = 'border-hud-green/60';
          bg = 'bg-[#0A1A14]/95';
          text = 'text-hud-green';
          Icon = CheckCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border ${border} ${bg} shadow-lg backdrop-blur-md transition-all duration-300 flex items-start gap-3`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${text}`} />
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${text}`}>
                {toast.title}
              </h4>
              <p className="text-xs text-hud-text/90 mt-0.5 font-sans leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-hud-muted hover:text-hud-text p-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
