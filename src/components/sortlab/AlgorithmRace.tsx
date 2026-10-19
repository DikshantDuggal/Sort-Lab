import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlgorithmId, AlgorithmStep } from '../../algorithms/types';
import {
  ALGORITHMS_LIST,
  ALGORITHM_METADATA,
  executeAlgorithm,
  generateArrayPreset,
} from '../../algorithms';
import { VisualizerCanvas } from './VisualizerCanvas';
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Trophy,
  Scale,
  Sparkles,
} from 'lucide-react';

export const AlgorithmRace: React.FC = () => {
  const [algoA, setAlgoA] = useState<AlgorithmId>('bubble');
  const [algoB, setAlgoB] = useState<AlgorithmId>('insertion');
  const [arraySize, setArraySize] = useState<number>(14);
  const [speedMs, setSpeedMs] = useState<number>(140);
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    generateArrayPreset('random', 14)
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepA, setStepA] = useState<number>(0);
  const [stepB, setStepB] = useState<number>(0);

  // Compute runs for both algorithms on the exact same base input array
  const runA = useMemo(() => executeAlgorithm(algoA, baseArray), [algoA, baseArray]);
  const runB = useMemo(() => executeAlgorithm(algoB, baseArray), [algoB, baseArray]);

  const stepsA = runA.steps;
  const stepsB = runB.steps;

  const currentStepA: AlgorithmStep | undefined = stepsA[stepA] || stepsA[0];
  const currentStepB: AlgorithmStep | undefined = stepsB[stepB] || stepsB[0];

  const doneA = stepA >= stepsA.length - 1;
  const doneB = stepB >= stepsB.length - 1;
  const allDone = doneA && doneB;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepA((prev) => (prev < stepsA.length - 1 ? prev + 1 : prev));
        setStepB((prev) => (prev < stepsB.length - 1 ? prev + 1 : prev));
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
  }, [isPlaying, speedMs, stepsA.length, stepsB.length]);

  // Stop playing once both are done
  useEffect(() => {
    if (allDone && isPlaying) {
      setIsPlaying(false);
    }
  }, [allDone, isPlaying]);

  const handleTogglePlay = () => {
    if (allDone) {
      setStepA(0);
      setStepB(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepA(0);
    setStepB(0);
  };

  const handleShuffle = () => {
    setIsPlaying(false);
    const newArr = generateArrayPreset('random', arraySize);
    setBaseArray(newArr);
    setStepA(0);
    setStepB(0);
  };

  const handleApplyPreset = (type: 'random' | 'nearly-sorted' | 'reversed' | 'few-unique') => {
    setIsPlaying(false);
    const newArr = generateArrayPreset(type, arraySize);
    setBaseArray(newArr);
    setStepA(0);
    setStepB(0);
  };

  const metaA = ALGORITHM_METADATA[algoA];
  const metaB = ALGORITHM_METADATA[algoB];

  // Determine winner by total operation efficiency
  const totalOpsA = runA.totalComparisons + runA.totalSwaps;
  const totalOpsB = runB.totalComparisons + runB.totalSwaps;
  const winner =
    totalOpsA < totalOpsB ? 'A' : totalOpsA > totalOpsB ? 'B' : 'Tie';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6">
      {/* Race Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Scale className="w-7 h-7 text-indigo-400" />
              Algorithm Arena — Head-to-Head Race
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirically benchmark two algorithms executing concurrently on the exact same starting dataset.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20 hover:scale-[1.02]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause Race
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start Race
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={isPlaying}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40"
            title="Reset Race"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleShuffle}
            disabled={isPlaying}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 disabled:opacity-40"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shuffle Data</span>
          </button>
        </div>
      </div>

      {/* Dataset & Presets Toolbar */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Benchmark Input:
          </span>
          <button
            onClick={() => handleApplyPreset('random')}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium"
          >
            Random
          </button>
          <button
            onClick={() => handleApplyPreset('nearly-sorted')}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium"
          >
            Nearly Sorted
          </button>
          <button
            onClick={() => handleApplyPreset('reversed')}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium"
          >
            Reversed
          </button>
          <button
            onClick={() => handleApplyPreset('few-unique')}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium"
          >
            Few Unique
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Size:</span>
            <input
              type="range"
              min={6}
              max={25}
              value={arraySize}
              onChange={(e) => {
                const s = Number(e.target.value);
                setArraySize(s);
                setBaseArray(generateArrayPreset('random', s));
                setStepA(0);
                setStepB(0);
              }}
              className="accent-indigo-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer w-24"
            />
            <span className="text-slate-200">{arraySize}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Speed:</span>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer w-24"
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Visualizer Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor A */}
        <div
          className={`bg-[#0b0f19] border rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all ${
            allDone && winner === 'A'
              ? 'border-emerald-500/80 shadow-emerald-500/10'
              : 'border-slate-800'
          }`}
        >
          <div>
            {/* Header / Selector A */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Lane 1
                </span>
              </div>
              <select
                value={algoA}
                onChange={(e) => {
                  setAlgoA(e.target.value as AlgorithmId);
                  setStepA(0);
                }}
                disabled={isPlaying}
                className="bg-[#101626] border border-slate-700 rounded-md px-2.5 py-1 text-sm text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
              >
                {ALGORITHMS_LIST.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics Ribbon A */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4 font-mono text-xs">
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Comparisons</span>
                <span className="text-cyan-400 font-bold text-base">
                  {currentStepA?.comparisons ?? 0}
                </span>
              </div>
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Swaps / Shifts</span>
                <span className="text-amber-400 font-bold text-base">
                  {currentStepA?.swaps ?? 0}
                </span>
              </div>
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Status</span>
                <span
                  className={`font-semibold text-xs ${
                    doneA ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {doneA ? 'Finished' : `${Math.round(((stepA + 1) / stepsA.length) * 100)}%`}
                </span>
              </div>
            </div>

            {/* Visualizer Canvas A */}
            <VisualizerCanvas
              array={currentStepA?.array || baseArray}
              activeIndices={currentStepA?.indices || []}
              stepType={currentStepA?.type || 'highlight'}
              pivotIndex={currentStepA?.pivotIndex}
              sortedIndices={currentStepA?.sortedIndices || []}
              compact
              maxHeightPx={240}
            />
          </div>

          {/* Lane Footer A */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Complexity: {metaA.timeComplexity.average}</span>
            <span>Total Steps: {stepsA.length}</span>
          </div>
        </div>

        {/* Competitor B */}
        <div
          className={`bg-[#0b0f19] border rounded-xl p-5 flex flex-col justify-between shadow-xl transition-all ${
            allDone && winner === 'B'
              ? 'border-emerald-500/80 shadow-emerald-500/10'
              : 'border-slate-800'
          }`}
        >
          <div>
            {/* Header / Selector B */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Lane 2
                </span>
              </div>
              <select
                value={algoB}
                onChange={(e) => {
                  setAlgoB(e.target.value as AlgorithmId);
                  setStepB(0);
                }}
                disabled={isPlaying}
                className="bg-[#101626] border border-slate-700 rounded-md px-2.5 py-1 text-sm text-indigo-300 font-medium focus:outline-none focus:border-indigo-500"
              >
                {ALGORITHMS_LIST.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics Ribbon B */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4 font-mono text-xs">
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Comparisons</span>
                <span className="text-cyan-400 font-bold text-base">
                  {currentStepB?.comparisons ?? 0}
                </span>
              </div>
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Swaps / Shifts</span>
                <span className="text-amber-400 font-bold text-base">
                  {currentStepB?.swaps ?? 0}
                </span>
              </div>
              <div className="bg-[#101626] p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Status</span>
                <span
                  className={`font-semibold text-xs ${
                    doneB ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {doneB ? 'Finished' : `${Math.round(((stepB + 1) / stepsB.length) * 100)}%`}
                </span>
              </div>
            </div>

            {/* Visualizer Canvas B */}
            <VisualizerCanvas
              array={currentStepB?.array || baseArray}
              activeIndices={currentStepB?.indices || []}
              stepType={currentStepB?.type || 'highlight'}
              pivotIndex={currentStepB?.pivotIndex}
              sortedIndices={currentStepB?.sortedIndices || []}
              compact
              maxHeightPx={240}
            />
          </div>

          {/* Lane Footer B */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Complexity: {metaB.timeComplexity.average}</span>
            <span>Total Steps: {stepsB.length}</span>
          </div>
        </div>
      </div>

      {/* Post-Race Empirical Analysis Card */}
      {allDone && (
        <div className="bg-gradient-to-r from-[#0b1329] via-[#0f172a] to-[#0b1329] border border-cyan-500/40 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Empirical Benchmark Winner
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {winner === 'A'
                  ? `${metaA.name} is the clear winner!`
                  : winner === 'B'
                  ? `${metaB.name} is the clear winner!`
                  : 'Both algorithms tied in efficiency!'}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {winner === 'A'
                  ? `${metaA.name} completed sorting with ${totalOpsA} total operations vs ${totalOpsB} for ${metaB.name} (${Math.round(((totalOpsB - totalOpsA) / totalOpsB) * 100)}% fewer operations).`
                  : winner === 'B'
                  ? `${metaB.name} completed sorting with ${totalOpsB} total operations vs ${totalOpsA} for ${metaA.name} (${Math.round(((totalOpsA - totalOpsB) / totalOpsA) * 100)}% fewer operations).`
                  : 'Identical operations count on this particular dataset.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShuffle}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              Test with New Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
