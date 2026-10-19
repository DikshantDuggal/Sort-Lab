import React, { useState, useEffect } from 'react';
import { runQuickSort } from '../../algorithms/quickSort';
import { generateArrayPreset } from '../../algorithms';
import { VisualizerCanvas } from './VisualizerCanvas';
import { Shuffle, Play, Pause } from 'lucide-react';

export const HeroVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>(() => generateArrayPreset('random', 12));
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = React.useMemo(() => runQuickSort(array).steps, [array]);
  const currentStep = steps[stepIndex] || steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            // Auto-loop after a brief pause
            setTimeout(() => {
              setArray(generateArrayPreset('random', 12));
              setStepIndex(0);
            }, 1200);
            return prev;
          }
          return prev + 1;
        });
      }, 160);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length]);

  return (
    <div className="w-full bg-[#0b0f19] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">Live Experiment: Quick Sort Partition</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setArray(generateArrayPreset('random', 12));
              setStepIndex(0);
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Canvas */}
      <VisualizerCanvas
        array={currentStep.array}
        activeIndices={currentStep.indices}
        stepType={currentStep.type}
        pivotIndex={currentStep.pivotIndex}
        sortedIndices={currentStep.sortedIndices}
        compact
        maxHeightPx={180}
      />

      {/* Live Operation Badge */}
      <div className="mt-3 text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-lg flex items-center justify-between">
        <span className="truncate">{currentStep.explanation}</span>
        <span className="text-slate-500 shrink-0 ml-2">
          {stepIndex + 1}/{steps.length}
        </span>
      </div>
    </div>
  );
};
