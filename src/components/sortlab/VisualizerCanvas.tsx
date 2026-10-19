import React from 'react';
import { StepType } from '../../algorithms/types';

interface VisualizerCanvasProps {
  array: number[];
  activeIndices?: number[];
  stepType?: StepType;
  pivotIndex?: number;
  sortedIndices?: number[];
  compact?: boolean;
  maxHeightPx?: number;
  label?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  array,
  activeIndices = [],
  stepType = 'highlight',
  pivotIndex,
  sortedIndices = [],
  compact = false,
  maxHeightPx = 300,
  label,
}) => {
  const maxVal = Math.max(...array, 1);
  const sortedSet = new Set(sortedIndices);

  const getBarColor = (index: number) => {
    // If element is in final sorted position
    if (sortedSet.has(index)) {
      return {
        bg: 'bg-emerald-500',
        border: 'border-emerald-400',
        text: 'text-emerald-300',
        glow: 'shadow-emerald-500/20',
      };
    }

    // If currently being swapped or overwritten
    if ((stepType === 'swap' || stepType === 'overwrite') && activeIndices.includes(index)) {
      return {
        bg: 'bg-amber-500',
        border: 'border-amber-300',
        text: 'text-amber-200',
        glow: 'shadow-amber-500/30 scale-[1.02]',
      };
    }

    // If currently being compared
    if (stepType === 'compare' && activeIndices.includes(index)) {
      return {
        bg: 'bg-cyan-500',
        border: 'border-cyan-300',
        text: 'text-cyan-200',
        glow: 'shadow-cyan-500/30 scale-[1.02]',
      };
    }

    // If pivot or minimum pointer
    if (pivotIndex === index || (stepType === 'pivot' && activeIndices.includes(index))) {
      return {
        bg: 'bg-violet-500',
        border: 'border-violet-300',
        text: 'text-violet-200',
        glow: 'shadow-violet-500/30',
      };
    }

    // Default neutral state
    return {
      bg: 'bg-slate-700/80 hover:bg-slate-700',
      border: 'border-slate-600/50',
      text: 'text-slate-400',
      glow: '',
    };
  };

  return (
    <div className="w-full flex flex-col items-center">
      {label && (
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs font-mono text-slate-400">
          <span>{label}</span>
          <span>{array.length} elements</span>
        </div>
      )}

      {/* Bar visualizer stage */}
      <div
        className="w-full flex items-end justify-center gap-1.5 sm:gap-2 px-2 pt-8 pb-3 relative"
        style={{ height: `${maxHeightPx}px` }}
      >
        {array.map((val, idx) => {
          const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));
          const color = getBarColor(idx);
          const isComparing = stepType === 'compare' && activeIndices.includes(idx);
          const isSwapping = (stepType === 'swap' || stepType === 'overwrite') && activeIndices.includes(idx);
          const isPivot = pivotIndex === idx;

          return (
            <div
              key={idx}
              className="flex-1 max-w-[48px] h-full flex flex-col justify-end items-center group relative select-none"
            >
              {/* Top value badge */}
              <div
                className={`text-[10px] sm:text-xs font-mono font-semibold mb-1 transition-colors duration-150 ${
                  color.text
                }`}
              >
                {val}
              </div>

              {/* Bar element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md border-t border-x ${color.bg} ${color.border} ${color.glow} shadow-md transition-all duration-150 ease-out flex flex-col justify-between items-center relative overflow-hidden`}
              >
                {/* Subtle sheen highlight inside bar */}
                <div className="w-full h-1 bg-white/20" />

                {/* Vertical subtle indicator line if highlighted */}
                {(isComparing || isSwapping || isPivot) && (
                  <div className="w-full h-full absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Bottom index label */}
              {!compact && (
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 mt-1.5 group-hover:text-slate-300">
                  {idx}
                </div>
              )}

              {/* Status pointer arrow */}
              {(isComparing || isSwapping || isPivot) && (
                <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none">
                  <div
                    className={`w-1.5 h-1.5 rotate-45 ${
                      isSwapping
                        ? 'bg-amber-400'
                        : isComparing
                        ? 'bg-cyan-400'
                        : 'bg-violet-400'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visualizer Legend */}
      <div className="w-full mt-6 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-700 border border-slate-600 inline-block" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cyan-500 border border-cyan-300 inline-block" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-300 inline-block" />
          <span>Swapping/Shift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-violet-500 border border-violet-300 inline-block" />
          <span>Pivot/Key</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-300 inline-block" />
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
};
