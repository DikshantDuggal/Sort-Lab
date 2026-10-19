import React, { useState, useMemo } from 'react';
import { AlgorithmId, AlgorithmStep } from '../../algorithms/types';
import {
  ALGORITHM_METADATA,
  ALGORITHMS_LIST,
  executeAlgorithm,
  generateArrayPreset,
} from '../../algorithms';
import { VisualizerCanvas } from './VisualizerCanvas';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Zap,
} from 'lucide-react';

interface QuestionItem {
  id: number;
  stepIndex: number;
  beforeStep: AlgorithmStep;
  nextStep: AlgorithmStep;
  questionText: string;
  options: { id: string; label: string; isCorrect: boolean; explanation: string }[];
}

export const PredictMode: React.FC = () => {
  const [algoId, setAlgoId] = useState<AlgorithmId>('bubble');
  const [arraySize] = useState<number>(6);
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    generateArrayPreset('random', 6)
  );

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Execute algorithm to build true steps
  const runResult = useMemo(() => executeAlgorithm(algoId, baseArray), [algoId, baseArray]);

  // Extract all meaningful decision points (comparisons)
  const questions: QuestionItem[] = useMemo(() => {
    const list: QuestionItem[] = [];
    const steps = runResult.steps;

    for (let i = 0; i < steps.length - 1; i++) {
      const step = steps[i];
      const next = steps[i + 1];

      if (step.type === 'compare' && step.indices.length >= 2) {
        const [idx1, idx2] = step.indices;
        const val1 = step.array[idx1];
        const val2 = step.array[idx2];
        const isSwapNext = next.type === 'swap';

        const options = isSwapNext
          ? [
              {
                id: 'A',
                label: `Swap ${val1} (index ${idx1}) and ${val2} (index ${idx2})`,
                isCorrect: true,
                explanation: `Correct! ${val1} is greater than ${val2}, so the algorithm must swap them.`,
              },
              {
                id: 'B',
                label: `Keep order as-is (do nothing)`,
                isCorrect: false,
                explanation: `Incorrect. Since ${val1} > ${val2}, leaving them would keep the inversion.`,
              },
              {
                id: 'C',
                label: `Reverse the entire array`,
                isCorrect: false,
                explanation: `Incorrect. Sorting algorithms only alter targeted elements per step.`,
              },
              {
                id: 'D',
                label: `Mark index ${idx1} as permanently sorted`,
                isCorrect: false,
                explanation: `Incorrect. An element can only be marked sorted after a pass finishes.`,
              },
            ]
          : [
              {
                id: 'A',
                label: `Keep order as-is (advance to next comparison)`,
                isCorrect: true,
                explanation: `Correct! ${val1} <= ${val2}, so they are already properly ordered.`,
              },
              {
                id: 'B',
                label: `Swap ${val1} (index ${idx1}) and ${val2} (index ${idx2})`,
                isCorrect: false,
                explanation: `Incorrect. ${val1} <= ${val2}, so swapping them would create an inversion.`,
              },
              {
                id: 'C',
                label: `Shift all elements to index 0`,
                isCorrect: false,
                explanation: `Incorrect. The algorithm only compares adjacent items here.`,
              },
              {
                id: 'D',
                label: `Immediately terminate the algorithm`,
                isCorrect: false,
                explanation: `Incorrect. Remaining unsorted items still need to be verified.`,
              },
            ];

        // Shuffle options deterministically
        list.push({
          id: list.length,
          stepIndex: i,
          beforeStep: step,
          nextStep: next,
          questionText: `The algorithm is comparing index ${idx1} (${val1}) and index ${idx2} (${val2}). What happens next?`,
          options,
        });
      }
    }

    return list.slice(0, 10); // cap at 10 high-value questions per exercise
  }, [runResult]);

  const currentQ = questions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= questions.length;

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQ || hasSubmitted) return;

    const opt = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!opt?.isCorrect;

    setHasSubmitted(true);

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    const newArr = generateArrayPreset('random', arraySize);
    setBaseArray(newArr);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setScore(0);
    setStreak(0);
  };

  const meta = ALGORITHM_METADATA[algoId];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-amber-400" />
            Predict Laboratory — Test Your Intuition
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Step into the algorithm's shoes. Predict the exact next state based on algorithm logic.
          </p>
        </div>

        {/* Algorithm Selector */}
        <div className="flex items-center gap-3">
          <select
            value={algoId}
            onChange={(e) => {
              setAlgoId(e.target.value as AlgorithmId);
              handleRestart();
            }}
            className="bg-[#101626] border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-amber-300 font-medium focus:outline-none"
          >
            {ALGORITHMS_LIST.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} Practice
              </option>
            ))}
          </select>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Restart Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scoreboard Bar */}
      <div className="grid grid-cols-3 gap-3 font-mono text-center">
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Session Score</span>
          <span className="text-xl font-bold text-amber-400">{score} pts</span>
        </div>
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Streak</span>
          <span className="text-xl font-bold text-cyan-400 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" /> {streak}
          </span>
        </div>
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Challenge</span>
          <span className="text-xl font-bold text-slate-200">
            {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
          </span>
        </div>
      </div>

      {isFinished ? (
        /* Completion Screen */
        <div className="bg-[#0b0f19] border border-emerald-500/40 rounded-2xl p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold text-white">Challenge Completed!</h2>
          <p className="text-slate-300 text-sm max-w-md">
            You finished the {meta.name} predictive intuition round with{' '}
            <strong className="text-emerald-400">{score} points</strong> and a peak streak of{' '}
            <strong className="text-cyan-400">{streak}</strong>.
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            Start New Challenge
          </button>
        </div>
      ) : currentQ ? (
        /* Interactive Question Card */
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          {/* Visual State: Display Array */}
          <div className="bg-[#101626] border border-slate-700/80 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span>Current Algorithm State</span>
              <span className="text-cyan-400 font-semibold">{meta.name}</span>
            </div>
            <VisualizerCanvas
              array={
                hasSubmitted && selectedOptionId
                  ? currentQ.nextStep.array
                  : currentQ.beforeStep.array
              }
              activeIndices={currentQ.beforeStep.indices}
              stepType={currentQ.beforeStep.type}
              pivotIndex={currentQ.beforeStep.pivotIndex}
              sortedIndices={currentQ.beforeStep.sortedIndices}
              maxHeightPx={200}
            />
          </div>

          {/* Question Text */}
          <div>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">
              Decision Point
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnClass = 'bg-[#101626] border-slate-700/80 text-slate-200 hover:border-slate-500';

              if (hasSubmitted) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-red-950/80 border-red-500 text-red-200';
                } else {
                  btnClass = 'bg-[#101626]/50 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnClass = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasSubmitted}
                  className={`border rounded-xl p-4 text-left flex items-start gap-3 transition-all ${btnClass}`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      hasSubmitted && opt.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : hasSubmitted && isSelected && !opt.isCorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div className="flex-1 text-sm font-sans">{opt.label}</div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Pedagogical Explanation */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-sm animate-fadeIn ${
                currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
              }`}
            >
              {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-xs font-mono uppercase tracking-wider mb-0.5">
                  {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                    ? 'Correct intuition!'
                    : 'Learning opportunity:'}
                </div>
                <p>
                  {currentQ.options.find((o) => o.id === selectedOptionId)?.explanation ||
                    currentQ.options.find((o) => o.isCorrect)?.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
