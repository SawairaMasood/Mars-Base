import React, { useEffect, useState } from 'react';
import { useMission } from '../context/MissionContext';
import { api } from '../services/api';
import { MissionReportData } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  AlertTriangle,
  RotateCcw,
  Printer,
  Compass,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const MissionDebrief: React.FC = () => {
  const { activeMission, restartMission, setActiveTab } = useMission();
  const [report, setReport] = useState<MissionReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeMission) {
      setLoading(true);
      api
        .getReport(activeMission.id)
        .then((res) => {
          if (res.success && res.report) {
            setReport(res.report);
            if (res.report.status === 'COMPLETED') {
              try {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch {}
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeMission]);

  const handlePrint = () => {
    window.print();
  };

  if (!activeMission) {
    return <div className="text-center p-8 text-hud-muted">No mission selected.</div>;
  }

  const isSuccess = activeMission.status === 'COMPLETED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in print:p-0">
      {/* Top Banner / Verdict */}
      <div
        className={`p-8 rounded-2xl border text-center space-y-4 ${
          isSuccess
            ? 'bg-space-900/90 border-hud-green/50 shadow-[0_0_35px_rgba(97,214,154,0.25)]'
            : 'bg-hud-panel-alert border-hud-red/60 shadow-danger-glow'
        }`}
      >
        <div className="inline-flex p-4 rounded-full bg-space-950/80 border border-hud-cyan/20">
          {isSuccess ? (
            <Award className="w-12 h-12 text-hud-green" />
          ) : (
            <XCircle className="w-12 h-12 text-hud-red" />
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-hud-muted">
            NASA Flight Director Evaluation // Expedition debrief
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-wider text-hud-text">
            {isSuccess ? 'MISSION ACCOMPLISHED' : 'EXPEDITION TERMINATED'}
          </h1>
          <p className="text-sm font-sans text-hud-muted max-w-xl mx-auto">
            {isSuccess
              ? 'Congratulations Commander. Your crew successfully survived 30 Martian Sols with colony infrastructure intact.'
              : activeMission.failureReason || 'Colony life-support parameters breached non-recoverable survival margins.'}
          </p>
        </div>

        {/* Score & Grade Display */}
        {report && (
          <div className="pt-4 flex items-center justify-center gap-8">
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase text-hud-muted block">
                Composite Score
              </span>
              <span className="text-3xl font-display font-black text-hud-cyan">
                {report.score} <span className="text-sm text-hud-muted">/ 1000</span>
              </span>
            </div>
            <div className="h-10 w-px bg-space-700" />
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase text-hud-muted block">
                Flight Grade
              </span>
              <span
                className={`text-4xl font-display font-black ${
                  report.grade === 'S' || report.grade === 'A'
                    ? 'text-hud-green'
                    : report.grade === 'B'
                    ? 'text-hud-cyan'
                    : report.grade === 'C'
                    ? 'text-hud-amber'
                    : 'text-hud-red'
                }`}
              >
                {report.grade}
              </span>
            </div>
          </div>
        )}
      </div>

      {report && (
        <div className="space-y-6">
          {/* Metrics Summary Grid */}
          <div className="p-6 rounded-2xl hud-panel border border-space-700 space-y-4">
            <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-hud-cyan" />
              Final Habitat Telemetry Snapshot
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">SOLS SURVIVED</span>
                <span className="text-hud-text font-bold text-sm">
                  {report.daysSurvived} / {report.totalDuration}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">REMAINING OXYGEN</span>
                <span className="text-hud-cyan font-bold text-sm">
                  {report.finalResources.oxygen.toFixed(1)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">REMAINING WATER</span>
                <span className="text-hud-cyan font-bold text-sm">
                  {report.finalResources.water.toFixed(1)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-900 border border-space-800">
                <span className="text-hud-muted block text-[10px]">BATTERY CHARGE</span>
                <span className="text-hud-cyan font-bold text-sm">
                  {report.finalResources.power.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Strengths and Mistakes Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-2xl hud-panel border border-hud-green/30 space-y-3">
              <h3 className="font-display font-bold text-sm text-hud-green uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Commander Strengths
              </h3>
              <div className="space-y-2 text-xs font-sans text-hud-text">
                {report.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-space-900 border border-hud-green/20">
                    {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Weaknesses / Mistakes */}
            <div className="p-6 rounded-2xl hud-panel border border-hud-red/30 space-y-3">
              <h3 className="font-display font-bold text-sm text-hud-red uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Vulnerabilities & Tactical Lessons
              </h3>
              <div className="space-y-2 text-xs font-sans text-hud-text">
                {report.mistakes.map((mis, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-space-900 border border-hud-red/20">
                    {mis}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Aerospace Lessons */}
          <div className="p-6 rounded-2xl hud-panel border border-mars/30 space-y-3">
            <h3 className="font-display font-bold text-sm text-mars uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Core Aerospace Takeaways (NASA Junior Astronaut Challenge)
            </h3>
            <div className="space-y-2 text-xs font-sans text-hud-text leading-relaxed">
              {report.educationalLessons.map((les, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-space-900/80 border border-space-800">
                  {les}
                </div>
              ))}
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="p-4 rounded-xl bg-space-950 border border-space-800 text-[11px] font-mono text-hud-muted">
            {report.disclaimer}
          </div>
        </div>
      )}

      {/* Action Buttons (Hidden when printing) */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs text-hud-cyan hover:text-hud-text border border-hud-cyan/40 bg-hud-cyan/10 hover:bg-hud-cyan/20 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Inspect Flight Telemetry Graphs</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase border border-space-600 bg-space-800 hover:bg-space-700 text-hud-text transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Mission Report</span>
          </button>

          <button
            onClick={restartMission}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-mars hover:bg-mars-dark text-space-950 transition-all shadow-mars-glow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Expedition (Sol 1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
