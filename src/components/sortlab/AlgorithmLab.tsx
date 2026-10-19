import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlgorithmId, AlgorithmStep } from '../../algorithms/types';
import {
  ALGORITHM_METADATA,
  executeAlgorithm,
  generateArrayPreset,
} from '../../algorithms';
import { VisualizerCanvas } from './VisualizerCanvas';
import { ControlPanel } from './ControlPanel';
import { PseudocodePanel } from './PseudocodePanel';
import {
  Activity,
  ArrowRightLeft,
  CheckCircle2,
  Database,
  Layers,
  Info,
} from 'lucide-react';

export const AlgorithmLab: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('bubble');
  const [arraySize, setArraySize] = useState<number>(14);
  const [speedMs, setSpeedMs] = useState<number>(180);
  const [sourceArray, setSourceArray] = useState<number[]>(() =>
    generateArrayPreset('random', 14)
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Pre-generate steps whenever sourceArray or selectedAlgo changes
  const runResult = useMemo(() => {
    return executeAlgorithm(selectedAlgo, sourceArray);
  }, [selectedAlgo, sourceArray]);

  const steps = runResult.steps;
  const currentStep: AlgorithmStep | undefined = steps[currentStepIndex] || steps[0];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs, steps.length]);

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleShuffle = () => {
    setIsPlaying(false);
    const newArr = generateArrayPreset('random', arraySize);
    setSourceArray(newArr);
    setCurrentStepIndex(0);
  };

  const handleArraySizeChange = (newSize: number) => {
    setArraySize(newSize);
    setIsPlaying(false);
    const newArr = generateArrayPreset('random', newSize);
    setSourceArray(newArr);
    setCurrentStepIndex(0);
  };

  const handleApplyPreset = (type: 'random' | 'nearly-sorted' | 'reversed' | 'few-unique') => {
    setIsPlaying(false);
    const newArr = generateArrayPreset(type, arraySize);
    setSourceArray(newArr);
    setCurrentStepIndex(0);
  };

  const handleUpdateArray = (newArr: number[]) => {
    setIsPlaying(false);
    setSourceArray(newArr);
    setArraySize(newArr.length);
    setCurrentStepIndex(0);
  };

  const handleSelectAlgorithm = (id: AlgorithmId) => {
    setIsPlaying(false);
    setSelectedAlgo(id);
    setCurrentStepIndex(0);
  };

  const metadata = ALGORITHM_METADATA[selectedAlgo];
  const progressPercent = Math.round(
    ((currentStepIndex + 1) / Math.max(steps.length, 1)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {metadata.name}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              {metadata.category}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/80">
              Avg: {metadata.timeComplexity.average}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{metadata.tagline}</p>
        </div>

        {/* Live Status Tag */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Status:</span>
          {isPlaying ? (
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Running Simulation
            </span>
          ) : currentStepIndex >= steps.length - 1 ? (
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sorting Complete
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Paused / Ready
            </span>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        selectedAlgorithm={selectedAlgo}
        onSelectAlgorithm={handleSelectAlgorithm}
        array={sourceArray}
        onUpdateArray={handleUpdateArray}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onReset={handleReset}
        onShuffle={handleShuffle}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        arraySize={arraySize}
        onArraySizeChange={handleArraySizeChange}
        canStepForward={currentStepIndex < steps.length - 1}
        canStepBackward={currentStepIndex > 0}
        onApplyPreset={handleApplyPreset}
      />

      {/* Live Telemetry / Counters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Comparisons */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Comparisons</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">
            {currentStep?.comparisons ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Total for run: {runResult.totalComparisons}
          </div>
        </div>

        {/* Swaps / Shifts */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Swaps / Shifts</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {currentStep?.swaps ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Total for run: {runResult.totalSwaps}
          </div>
        </div>

        {/* Array Accesses */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Array Accesses</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-2">
            {currentStep?.accesses ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Reads and writes</div>
        </div>

        {/* Progress & Scrubbing */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Step Progress</span>
            <span className="text-emerald-400 font-semibold">{progressPercent}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-2">
            {currentStepIndex + 1} <span className="text-xs text-slate-500">/ {steps.length}</span>
          </div>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Main Stage: Visualizer & Operation Explainer */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Dynamic Operation Explanation Banner */}
        <div className="w-full bg-[#101626] border border-slate-700/80 rounded-lg p-3.5 flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-cyan-950 text-cyan-400 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Current Operation & Reasoning
            </div>
            <p className="text-sm text-slate-200 mt-0.5 leading-relaxed font-sans">
              {currentStep?.explanation || 'Ready to start sorting.'}
            </p>
          </div>
        </div>

        {/* Vertical Bars Canvas */}
        <VisualizerCanvas
          array={currentStep?.array || sourceArray}
          activeIndices={currentStep?.indices || []}
          stepType={currentStep?.type || 'highlight'}
          pivotIndex={currentStep?.pivotIndex}
          sortedIndices={currentStep?.sortedIndices || []}
          maxHeightPx={320}
        />
      </div>

      {/* Two-Column Bottom Grid: Pseudocode & Complexity Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pseudocode Synchronizer */}
        <div className="lg:col-span-7">
          <PseudocodePanel
            metadata={metadata}
            activeLine={currentStep?.pseudocodeLine || 1}
          />
        </div>

        {/* Algorithm Dossier & Complexity Breakdown */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Algorithm Dossier & Complexity
            </h3>

            {/* Complexity Badges Table */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
              <div className="bg-[#101626] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Best Time</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {metadata.timeComplexity.best}
                </span>
              </div>
              <div className="bg-[#101626] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Average Time</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {metadata.timeComplexity.average}
                </span>
              </div>
              <div className="bg-[#101626] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Worst Time</span>
                <span className="text-amber-400 font-bold text-sm">
                  {metadata.timeComplexity.worst}
                </span>
              </div>
              <div className="bg-[#101626] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Space Complexity</span>
                <span className="text-indigo-400 font-bold text-sm">
                  {metadata.spaceComplexity}
                </span>
              </div>
            </div>

            {/* Properties Pills */}
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <span
                className={`px-2 py-1 rounded font-mono ${
                  metadata.stable
                    ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {metadata.stable ? '✓ Stable Sort' : '✗ Unstable Sort'}
              </span>
              <span
                className={`px-2 py-1 rounded font-mono ${
                  metadata.inPlace
                    ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/60'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {metadata.inPlace ? '✓ In-Place' : '✗ Requires Auxiliary Buffer'}
              </span>
            </div>

            {/* Pedagogical Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
              {metadata.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            <div>
              <b className="text-slate-400">Best Case:</b> {metadata.bestCaseDescription}
            </div>
            <div className="mt-1">
              <b className="text-slate-400">Worst Case:</b> {metadata.worstCaseDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
