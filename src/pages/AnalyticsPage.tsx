import React, { useEffect, useState } from 'react';
import { useMission } from '../context/MissionContext';
import { api } from '../services/api';
import { DailySnapshot } from '../types';
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  LineChart,
  Activity,
  Layers,
  Zap,
  Shield,
  Heart,
  Droplets,
  Wind,
  Sprout,
  Filter,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { activeMission } = useMission();
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  const [filterMode, setFilterMode] = useState<'ALL' | 'RECENT_7'>('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeMission) {
      setLoading(true);
      api
        .getAnalytics(activeMission.id)
        .then((res) => {
          if (res.success && res.snapshots) {
            setSnapshots(res.snapshots);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeMission]);

  if (!activeMission) {
    return <div className="text-center p-8 text-hud-muted">No active mission.</div>;
  }

  const chartData =
    filterMode === 'RECENT_7' ? snapshots.slice(-7) : snapshots;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-hud-cyan/20 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-hud-cyan tracking-widest font-bold flex items-center gap-1.5">
            <LineChart className="w-4 h-4" />
            Flight Telemetry & Historical Trends
          </span>
          <h1 className="text-3xl font-display font-black text-hud-text tracking-wide">
            MISSION ANALYTICS
          </h1>
          <p className="text-xs font-mono text-hud-muted mt-1">
            Empirical time-series telemetry logged across each Sol of operation.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 bg-space-850 p-1.5 rounded-xl border border-hud-cyan/20 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-hud-muted ml-1" />
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterMode === 'ALL'
                ? 'bg-hud-cyan/20 text-hud-cyan font-bold border border-hud-cyan/40'
                : 'text-hud-muted hover:text-hud-text'
            }`}
          >
            All Sols ({snapshots.length})
          </button>
          <button
            onClick={() => setFilterMode('RECENT_7')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterMode === 'RECENT_7'
                ? 'bg-hud-cyan/20 text-hud-cyan font-bold border border-hud-cyan/40'
                : 'text-hud-muted hover:text-hud-text'
            }`}
          >
            Recent 7 Sols
          </button>
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-hud-muted hud-panel rounded-2xl">
          Telemetry data will populate as you advance Sols and record daily snapshots.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Chart 1: Life Support Consumables (Oxygen, Water, Food, Power) */}
          <div className="p-6 rounded-2xl hud-panel border border-hud-cyan/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-hud-cyan" />
                <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider">
                  Consumables Telemetry (O2, Water, Food, Power vs Sols)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-hud-muted">
                Y-Axis: Reserves (%) // X-Axis: Martian Sol
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLine data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(80, 217, 234, 0.1)" />
                  <XAxis
                    dataKey="day"
                    stroke="#8A99AD"
                    tickFormatter={(val) => `Sol ${val}`}
                    style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#8A99AD"
                    style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#080D18',
                      borderColor: '#50D9EA',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                  <Line
                    type="monotone"
                    dataKey="oxygen"
                    name="Oxygen %"
                    stroke="#50D9EA"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="water"
                    name="Water %"
                    stroke="#61D69A"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="food"
                    name="Food %"
                    stroke="#FFA085"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="power"
                    name="Battery %"
                    stroke="#F1C56B"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </RechartsLine>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Radiation Exposure & Habitat Shielding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl hud-panel border border-hud-red/30 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-hud-red" />
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Cosmic Radiation Index Over Time
                </h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 89, 111, 0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="#8A99AD"
                      tickFormatter={(val) => `Sol ${val}`}
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#8A99AD"
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#080D18',
                        borderColor: '#FF596F',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="radiation"
                      name="Radiation Flux %"
                      stroke="#FF596F"
                      fill="rgba(255, 89, 111, 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Crew Morale & Hull Structural Integrity */}
            <div className="p-6 rounded-2xl hud-panel border border-hud-green/30 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-hud-green" />
                <h3 className="font-display font-bold text-sm text-hud-text uppercase tracking-wider">
                  Crew Wellbeing & Habitat Integrity
                </h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLine data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(97, 214, 154, 0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="#8A99AD"
                      tickFormatter={(val) => `Sol ${val}`}
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#8A99AD"
                      style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#080D18',
                        borderColor: '#61D69A',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                    <Line
                      type="monotone"
                      dataKey="morale"
                      name="Crew Morale %"
                      stroke="#61D69A"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="integrity"
                      name="Hull Integrity %"
                      stroke="#50D9EA"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
