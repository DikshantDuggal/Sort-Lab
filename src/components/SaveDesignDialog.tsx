import React, { useState } from 'react';
import { X, Cloud, Loader2 } from 'lucide-react';
import { Layer } from '../physics/tmm';
import { OptimizationTarget } from '../physics/optimizer';
import { savePhotonicDesign } from '../services/supabase';

interface SaveDesignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  layers: Layer[];
  score: number;
  target: OptimizationTarget;
  candidatesTested: number;
  elapsedMs: number;
  onSavedSuccess: (name: string, source: string) => void;
}

export const SaveDesignDialog: React.FC<SaveDesignDialogProps> = ({
  isOpen,
  onClose,
  layers,
  score,
  target,
  candidatesTested,
  elapsedMs,
  onSavedSuccess
}) => {
  const defaultName = `${target.name} (TMM ${score.toFixed(1)}%)`;
  const [designName, setDesignName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designName.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await savePhotonicDesign({
        name: designName.trim(),
        target_wavelength: target.targetWavelength,
        behavior: target.behavior,
        num_layers: layers.length,
        score,
        layers,
        candidates_tested: candidatesTested,
        computation_time_ms: elapsedMs
      });

      if (result.error && !result.data) {
        setError(result.error);
      } else {
        onSavedSuccess(designName.trim(), result.source);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Cloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Save Design to Cloud</h2>
              <p className="text-xs text-slate-400">Persist to Supabase Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Design Label
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g. Blue Reflector 4-Layer Bragg"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Quick specs preview */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Performance Score:</span>
              <span className="font-bold text-emerald-400">{score.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Wavelength:</span>
              <span>{target.targetWavelength} nm ({target.behavior})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Layers:</span>
              <span>{layers.length} thin films</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !designName.trim()}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Save to Supabase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
