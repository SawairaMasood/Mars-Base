import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResourceGaugeProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  icon: LucideIcon;
  delta?: number;
  isInvertedRisk?: boolean; // For radiation: high is bad, low is good
  tooltip: string;
  onClick?: () => void;
}

export const ResourceGauge: React.FC<ResourceGaugeProps> = ({
  label,
  value,
  max = 100,
  unit = '%',
  icon: Icon,
  delta,
  isInvertedRisk = false,
  tooltip,
  onClick,
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  // Determine status color
  let color = 'text-hud-green';
  let strokeColor = '#61D69A';
  let bgColor = 'rgba(97, 214, 154, 0.15)';
  let borderColor = 'border-hud-green/30';
  let glowClass = 'shadow-[0_0_15px_rgba(97,214,154,0.2)]';

  if (isInvertedRisk) {
    if (percentage > 60) {
      color = 'text-hud-red';
      strokeColor = '#FF596F';
      bgColor = 'rgba(255, 89, 111, 0.18)';
      borderColor = 'border-hud-red/40 animate-pulse';
      glowClass = 'shadow-danger-glow';
    } else if (percentage > 35) {
      color = 'text-hud-amber';
      strokeColor = '#F1C56B';
      bgColor = 'rgba(241, 197, 107, 0.15)';
      borderColor = 'border-hud-amber/30';
      glowClass = 'shadow-[0_0_15px_rgba(241,197,107,0.2)]';
    }
  } else {
    if (percentage < 25) {
      color = 'text-hud-red';
      strokeColor = '#FF596F';
      bgColor = 'rgba(255, 89, 111, 0.18)';
      borderColor = 'border-hud-red/40 animate-pulse';
      glowClass = 'shadow-danger-glow';
    } else if (percentage < 50) {
      color = 'text-hud-amber';
      strokeColor = '#F1C56B';
      bgColor = 'rgba(241, 197, 107, 0.15)';
      borderColor = 'border-hud-amber/30';
      glowClass = 'shadow-[0_0_15px_rgba(241,197,107,0.2)]';
    }
  }

  // Circular progress calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      onClick={onClick}
      title={tooltip}
      className={`group relative p-3.5 rounded-xl hud-panel border transition-all duration-300 ${borderColor} ${glowClass} ${
        onClick ? 'cursor-pointer hover:border-hud-cyan hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg border border-hud-cyan/20"
            style={{ backgroundColor: bgColor }}
          >
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <span className="text-xs font-mono font-semibold tracking-wider text-hud-muted uppercase">
            {label}
          </span>
        </div>

        {delta !== undefined && delta !== 0 && (
          <span
            className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
              delta > 0
                ? isInvertedRisk
                  ? 'bg-hud-red/20 text-hud-red'
                  : 'bg-hud-green/20 text-hud-green'
                : isInvertedRisk
                ? 'bg-hud-green/20 text-hud-green'
                : 'bg-hud-red/20 text-hud-red'
            }`}
          >
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Radial gauge */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-space-800"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke={strokeColor}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-sm font-display font-black leading-none ${color}`}>
              {Math.round(value)}
            </span>
            <span className="text-[9px] font-mono text-hud-muted">{unit}</span>
          </div>
        </div>

        {/* Readout bar & status */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-hud-muted">LEVEL</span>
            <span className={color}>
              {percentage >= 50 ? 'NOMINAL' : percentage >= 25 ? 'MARGINAL' : 'CRITICAL'}
            </span>
          </div>
          <div className="w-full bg-space-800 h-1.5 rounded-full overflow-hidden border border-space-700">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: strokeColor,
              }}
            />
          </div>
          <p className="text-[10px] text-hud-muted line-clamp-1 italic">
            {tooltip}
          </p>
        </div>
      </div>
    </div>
  );
};
