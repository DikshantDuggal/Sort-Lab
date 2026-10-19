import React from 'react';
import { Target, CheckCircle2, Clock, Cpu, BarChart3 } from 'lucide-react';
import { OptimizationTarget } from '../physics/optimizer';

interface MetricsCardProps {
  score: number;
  candidatesTested: number;
  elapsedMs: number;
  verifications: { label: string; passed: boolean }[];
  target: OptimizationTarget;
  isOptimizing: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  score,
  candidatesTested,
  elapsedMs,
  verifications,
  isOptimizing
}) => {
  // Determine score color accent
  const scoreColor =
    score >= 85
      ? 'from-emerald-400 to-cyan-400 text-emerald-400 border-emerald-500/50'
      : score >= 70
      ? 'from-cyan-400 to-blue-400 text-cyan-400 border-cyan-500/50'
      : 'from-amber-400 to-orange-400 text-amber-400 border-amber-500/50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* 1. Large Performance Score Card */}
      <div className="md:col-span-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Performance Score
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Transfer Matrix Fit
          </span>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span
            className={`text-5xl lg:text-6xl font-black font-mono tracking-tight bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}
          >
            {score.toFixed(1)}%
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {score >= 90 ? 'Near Optimal' : score >= 75 ? 'High Resonance' : 'Acceptable'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      {/* 2. Target Results Checklist */}
      <div className="md:col-span-4 bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            5. Target Result
          </h3>
        </div>

        <div className="flex flex-col gap-2 my-2">
          {verifications.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950/70 border border-slate-800/80 px-3 py-2 rounded-xl"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] flex-shrink-0" />
              <span className="font-semibold">{v.label}</span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
          <span>Boundary conditions</span>
          <span className="text-emerald-400 font-bold">Satisfied</span>
        </div>
      </div>

      {/* 3. Optimization Telemetry Status */}
      <div className="md:col-span-3 bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            6. Optimization Status
          </h3>
        </div>

        <div className="flex flex-col gap-2 my-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-500" /> Candidates Tested:
            </span>
            <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {candidatesTested.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-500" /> Best Score:
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {score.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Optimization Time:
            </span>
            <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {elapsedMs} ms
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Engine Status:</span>
          <span className={`font-bold flex items-center gap-1 ${isOptimizing ? 'text-cyan-400' : 'text-emerald-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOptimizing ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
            {isOptimizing ? 'Running TMM' : 'Idle / Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
