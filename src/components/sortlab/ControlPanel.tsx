import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Shuffle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AlgorithmId } from '../../algorithms/types';
import { ALGORITHMS_LIST } from '../../algorithms';

interface ControlPanelProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  array: number[];
  onUpdateArray: (newArray: number[]) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onShuffle: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  onApplyPreset: (type: 'random' | 'nearly-sorted' | 'reversed' | 'few-unique') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  array,
  onUpdateArray,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onShuffle,
  speedMs,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  canStepForward,
  canStepBackward,
  onApplyPreset,
}) => {
  const [inputStr, setInputStr] = useState<string>(array.join(', '));
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    setInputStr(array.join(', '));
  }, [array]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputStr(val);

    const parts = val.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    if (parts.length === 0) {
      setInputError('Array cannot be empty');
      return;
    }

    const nums = parts.map(Number);
    if (nums.some((n) => isNaN(n) || n < 1 || n > 999)) {
      setInputError('Must contain numbers between 1 and 999');
      return;
    }

    if (nums.length > 35) {
      setInputError('Maximum recommended array size is 35 elements for optimal visualization');
      return;
    }

    setInputError(null);
    onUpdateArray(nums);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Top Row: Algorithm Selection & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Algorithm Dropdown */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>Algorithm</span>
            <span className="text-[10px] text-cyan-400">Pure Client Engine</span>
          </label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => onSelectAlgorithm(e.target.value as AlgorithmId)}
            className="w-full bg-[#101626] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            {ALGORITHMS_LIST.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name} ({algo.category}) — {algo.timeComplexity.average}
              </option>
            ))}
          </select>
        </div>

        {/* Input Array Field */}
        <div className="md:col-span-7 flex flex-col gap-1.5">
          <label className="text-xs font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>Dataset (comma-separated values)</span>
            <span className="text-[10px] text-slate-500">{array.length} items</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputStr}
              onChange={handleInputChange}
              placeholder="e.g. 45, 12, 89, 3, 27, 61, 8"
              className={`w-full bg-[#101626] border rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none transition-colors ${
                inputError ? 'border-red-500/80 focus:border-red-400' : 'border-slate-700/80 focus:border-cyan-500'
              }`}
            />
            {inputError && (
              <div className="absolute right-3 top-2.5 text-red-400 flex items-center gap-1 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{inputError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Presets & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-800/80">
        {/* Preset quick buttons */}
        <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          <button
            onClick={() => onApplyPreset('random')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Random
          </button>
          <button
            onClick={() => onApplyPreset('nearly-sorted')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Nearly Sorted
          </button>
          <button
            onClick={() => onApplyPreset('reversed')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Reversed
          </button>
          <button
            onClick={() => onApplyPreset('few-unique')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Few Unique
          </button>
        </div>

        {/* Array Size Slider */}
        <div className="lg:col-span-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Size: {arraySize}</span>
            <span className="text-[10px] text-slate-500">5-30</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Speed Slider */}
        <div className="lg:col-span-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Delay: {speedMs}ms</span>
            <span className="text-[10px] text-cyan-400">
              {speedMs <= 50 ? 'Turbo' : speedMs <= 200 ? 'Fast' : speedMs <= 500 ? 'Normal' : 'Slow'}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={800}
            step={10}
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Bottom Row: Playback Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Main Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 hover:scale-[1.02]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Sorting</span>
              </>
            )}
          </button>

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!canStepBackward || isPlaying}
            title="Step Backward"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!canStepForward || isPlaying}
            title="Step Forward"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Shuffle Button */}
          <button
            onClick={onShuffle}
            disabled={isPlaying}
            className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-40"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shuffle</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={isPlaying}
            className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
