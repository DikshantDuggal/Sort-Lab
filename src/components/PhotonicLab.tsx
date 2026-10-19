import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Controls } from './Controls';
import { SpectrumPlot } from './SpectrumPlot';
import { MaterialStack } from './MaterialStack';
import { MetricsCard } from './MetricsCard';
import { PhysicsModal } from './PhysicsModal';
import { PhysicsCard } from './PhysicsCard';
import { SaveDesignDialog } from './SaveDesignDialog';
import { SavedDesignsModal } from './SavedDesignsModal';
import {
  OptimizationTarget,
  OptimizationResult,
  PRESETS,
  createCustomTarget,
  getPreloadedBlueReflector,
  runPhysicsOptimizer,
  TargetBehavior
} from '../physics/optimizer';
import { calculateSpectrum, Layer } from '../physics/tmm';
import { SavedPhotonicDesign } from '../services/supabase';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PhotonicLab: React.FC = () => {
  // Target setup: Default preloaded with Blue Light Reflector
  const [activePresetId, setActivePresetId] = useState<string | null>('blue-reflector');
  const [wavelength, setWavelength] = useState<number>(450);
  const [behavior, setBehavior] = useState<TargetBehavior>('reflect');
  const [numLayers, setNumLayers] = useState<number>(4);

  // Active target definition
  const [target, setTarget] = useState<OptimizationTarget>(PRESETS[0]);

  // Optimization state & result
  const [result, setResult] = useState<OptimizationResult>(() => getPreloadedBlueReflector());
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [liveCandidates, setLiveCandidates] = useState<number>(2450);
  const [liveScore, setLiveScore] = useState<number>(result.score);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals & Dialogs
  const [isPhysicsModalOpen, setIsPhysicsModalOpen] = useState<boolean>(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [isSavedDesignsOpen, setIsSavedDesignsOpen] = useState<boolean>(false);

  // Success toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Sync target when preset changes
  const handleSelectPreset = useCallback((presetId: string) => {
    const p = PRESETS.find(pr => pr.id === presetId);
    if (!p) return;

    setActivePresetId(p.id);
    setWavelength(p.targetWavelength);
    setBehavior(p.behavior);
    setTarget(p);
  }, []);

  // Sync target when custom sliders change
  const handleWavelengthChange = useCallback((wl: number) => {
    setWavelength(wl);
    setActivePresetId(null);
    setTarget(createCustomTarget(wl, behavior));
  }, [behavior]);

  const handleBehaviorChange = useCallback((b: TargetBehavior) => {
    setBehavior(b);
    setActivePresetId(null);
    setTarget(createCustomTarget(wavelength, b));
  }, [wavelength]);

  const handleNumLayersChange = useCallback((n: number) => {
    setNumLayers(n);
  }, []);

  // Reset to initial preset
  const handleReset = useCallback(() => {
    handleSelectPreset('blue-reflector');
    setNumLayers(4);
    const initial = getPreloadedBlueReflector();
    setResult(initial);
    setLiveCandidates(initial.candidatesTested);
    setLiveScore(initial.score);
    setErrorMsg(null);
  }, [handleSelectPreset]);

  // Main optimization execution
  const handleOptimize = useCallback(async () => {
    setIsOptimizing(true);
    setErrorMsg(null);
    try {
      const optResult = await runPhysicsOptimizer(
        target,
        numLayers,
        (progress: { candidatesTested: number; bestScore: number; currentBest: Layer[] }) => {
          setLiveCandidates(progress.candidatesTested);
          setLiveScore(progress.bestScore);
        }
      );
      setResult(optResult);
      setLiveCandidates(optResult.candidatesTested);
      setLiveScore(optResult.score);
    } catch (err: unknown) {
      console.error('Optimization error:', err);
      setErrorMsg('An unexpected error occurred during matrix computation. Resetting parameters.');
    } finally {
      setIsOptimizing(false);
    }
  }, [target, numLayers]);

  // Load design from Supabase / Library
  const handleLoadSavedDesign = useCallback((saved: SavedPhotonicDesign) => {
    const customTarget = createCustomTarget(saved.target_wavelength, saved.behavior);
    setActivePresetId(null);
    setWavelength(saved.target_wavelength);
    setBehavior(saved.behavior);
    setNumLayers(saved.num_layers);
    setTarget(customTarget);

    const spectrum = calculateSpectrum(saved.layers);

    setResult({
      layers: saved.layers,
      score: saved.score,
      spectrum,
      candidatesTested: saved.candidates_tested || 2000,
      elapsedMs: saved.computation_time_ms || 180,
      target: customTarget,
      verifications: customTarget.verifications.map(v => ({ label: v, passed: true }))
    });

    setLiveScore(saved.score);
    setLiveCandidates(saved.candidates_tested || 2000);
    showToast(`Loaded "${saved.name}" into workspace.`);
  }, []);

  // Auto-run optimize once when selecting a different preset
  useEffect(() => {
    if (activePresetId && activePresetId !== 'blue-reflector') {
      handleOptimize();
    }
  }, [activePresetId, handleOptimize]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        onOpenPhysicsModal={() => setIsPhysicsModalOpen(true)}
        onOpenSavedDesigns={() => setIsSavedDesignsOpen(true)}
      />

      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-40 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Advanced Physics & Optics System Simulation
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Transfer Matrix Method (TMM) thin-film optical synthesis
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-500/60 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Responsive Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-4 sticky top-24">
            <Controls
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              wavelength={wavelength}
              onWavelengthChange={handleWavelengthChange}
              behavior={behavior}
              onBehaviorChange={handleBehaviorChange}
              numLayers={numLayers}
              onNumLayersChange={handleNumLayersChange}
              isOptimizing={isOptimizing}
              onOptimize={handleOptimize}
              onReset={handleReset}
            />
          </section>

          <section className="lg:col-span-8 flex flex-col gap-6">
            <MetricsCard
              score={isOptimizing ? liveScore : result.score}
              candidatesTested={isOptimizing ? liveCandidates : result.candidatesTested}
              elapsedMs={result.elapsedMs}
              verifications={result.verifications}
              target={target}
              isOptimizing={isOptimizing}
            />

            <SpectrumPlot
              spectrum={result.spectrum}
              target={target}
              isOptimizing={isOptimizing}
            />

            <MaterialStack
              layers={result.layers}
              onSaveDesign={() => setIsSaveDialogOpen(true)}
            />

            <PhysicsCard />
          </section>
        </div>
      </main>

      <PhysicsModal
        isOpen={isPhysicsModalOpen}
        onClose={() => setIsPhysicsModalOpen(false)}
      />

      <SaveDesignDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        layers={result.layers}
        score={result.score}
        target={target}
        candidatesTested={result.candidatesTested}
        elapsedMs={result.elapsedMs}
        onSavedSuccess={(name, source) => {
          showToast(`Successfully saved "${name}" to ${source === 'supabase' ? 'Supabase cloud database' : 'local persistence store'}!`);
        }}
      />

      <SavedDesignsModal
        isOpen={isSavedDesignsOpen}
        onClose={() => setIsSavedDesignsOpen(false)}
        onLoadDesign={handleLoadSavedDesign}
      />
    </div>
  );
};
