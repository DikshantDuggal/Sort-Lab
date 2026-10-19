import React from 'react';
import { Sliders, Zap, Layers as LayersIcon, RotateCcw, ShieldCheck, SunMedium } from 'lucide-react';
import { PRESETS, TargetBehavior } from '../physics/optimizer';

interface ControlsProps {
  activePresetId: string | null;
  onSelectPreset: (presetId: string) => void;
  wavelength: number;
  onWavelengthChange: (wl: number) => void;
  behavior: TargetBehavior;
  onBehaviorChange: (b: TargetBehavior) => void;
  numLayers: number;
  onNumLayersChange: (n: number) => void;
  isOptimizing: boolean;
  onOptimize: () => void;
  onReset: () => void;
}

// Convert wavelength to approximate RGB color hex for visual preview
function wavelengthToColor(wl: number): string {
  if (wl < 440) return '#6366f1'; // Indigo/Violet
  if (wl < 490) return '#0ea5e9'; // Blue/Cyan
  if (wl < 560) return '#10b981'; // Green
  if (wl < 590) return '#eab308'; // Yellow
  if (wl < 630) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

export const Controls: React.FC<ControlsProps> = ({
  activePresetId,
  onSelectPreset,
  wavelength,
  onWavelengthChange,
  behavior,
  onBehaviorChange,
  numLayers,
  onNumLayersChange,
  isOptimizing,
  onOptimize,
  onReset
}) => {
  const currentColor = wavelengthToColor(wavelength);

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Target Specifications</h2>
        </div>
        <button
          onClick={onReset}
          disabled={isOptimizing}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
          title="Reset to default preset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* 1. Presets */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Target Presets</span>
          <span className="text-[10px] text-cyan-400 font-mono">1-Click Design</span>
        </label>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map(preset => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                disabled={isOptimizing}
                className={`text-left px-3.5 py-2.5 rounded-xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-white'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {preset.name}
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/60">
                    {preset.targetWavelength} nm
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Wavelength Slider (400 - 700 nm) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            Target Wavelength
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-white/40 shadow-sm transition-colors"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700/80">
              {wavelength} nm
            </span>
          </div>
        </div>

        {/* Custom Range Slider with Spectrum Visual Gradient */}
        <div className="relative py-1">
          <input
            type="range"
            min={400}
            max={700}
            step={5}
            value={wavelength}
            disabled={isOptimizing}
            onChange={(e) => onWavelengthChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-cyan-400 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          {/* Spectrum guide strip */}
          <div
            className="h-1.5 w-full rounded-full mt-1.5 opacity-80"
            style={{
              background: 'linear-gradient(to right, #4c1d95, #3b82f6, #06b6d4, #10b981, #eab308, #f97316, #ef4444)'
            }}
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>400 nm (Violet)</span>
            <span>550 nm (Green)</span>
            <span>700 nm (Red)</span>
          </div>
        </div>
      </div>

      {/* 3. Desired Behavior: Reflect vs Transmit */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Desired Optical Behavior
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isOptimizing}
            onClick={() => onBehaviorChange('reflect')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              behavior === 'reflect'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Reflect (Block)
          </button>
          <button
            type="button"
            disabled={isOptimizing}
            onClick={() => onBehaviorChange('transmit')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              behavior === 'transmit'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Transmit (Pass)
          </button>
        </div>
      </div>

      {/* 4. Number of Layers (2 - 4) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <LayersIcon className="w-3.5 h-3.5 text-indigo-400" />
            Number of Thin-Film Layers
          </label>
          <span className="text-xs font-mono font-bold text-slate-300">
            {numLayers} Layers
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              disabled={isOptimizing}
              onClick={() => onNumLayersChange(n)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                numLayers === n
                  ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {n} Layers
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 italic">
          Higher layer counts increase interference contrast and band steepness.
        </p>
      </div>

      {/* 5. Optimize Button */}
      <div className="pt-2">
        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2.5 ${
            isOptimizing
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.01] active:scale-[0.99] border border-cyan-400/40'
          }`}
        >
          {isOptimizing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span>Synthesizing Interferences...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
              <span>Optimize Design</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
