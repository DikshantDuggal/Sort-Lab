import React, { useState, useEffect } from 'react';
import { X, Database, RefreshCw, Trash2, ArrowUpRight, AlertCircle, Layers, Calendar } from 'lucide-react';
import { SavedPhotonicDesign, fetchSavedDesigns, deleteSavedDesign } from '../services/supabase';
import { MATERIALS } from '../physics/materials';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDesign: (design: SavedPhotonicDesign) => void;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
  onLoadDesign
}) => {
  const [designs, setDesigns] = useState<SavedPhotonicDesign[]>([]);
  const [source, setSource] = useState<'supabase' | 'in-memory' | 'client'>('in-memory');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSavedDesigns();
      setDesigns(res.designs);
      setSource(res.source);
      if (res.error && res.designs.length === 0) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch designs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved photonic design?')) return;
    setDeletingId(id);
    const success = await deleteSavedDesign(id);
    setDeletingId(null);
    if (success) {
      setDesigns(prev => prev.filter(d => d.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Photonic Design Library</h2>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    source === 'supabase'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {source === 'supabase' ? 'Supabase Connected' : 'Local Fallback Storage'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse, restore, and manage persisted thin-film interference stacks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh designs list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
              title="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Supabase Connection Tip if using local fallback */}
        {source !== 'supabase' && (
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-300 block mb-0.5">
                Tip: Connect Your Supabase Cloud Project
              </span>
              <span>
                To sync across devices and teams, paste your <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">SUPABASE_URL</code> and <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">SUPABASE_ANON_KEY</code> into the <code className="text-white bg-slate-900 px-1 py-0.5 rounded">.env</code> file and run the SQL in <code className="text-white bg-slate-900 px-1 py-0.5 rounded">supabase/schema.sql</code>.
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Designs List */}
        {isLoading && designs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Retrieving saved designs...</span>
          </div>
        ) : designs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Database className="w-8 h-8 text-slate-600" />
            <span className="font-medium text-slate-300">No saved designs yet.</span>
            <span>Synthesize a structure on the dashboard and click "Save to Supabase".</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {designs.map(design => (
              <div
                key={design.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Info */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {design.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      Score: {Number(design.score).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {design.target_wavelength} nm ({design.behavior})
                    </span>
                  </div>

                  {/* Layer pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Layers className="w-3 h-3" /> Stack:
                    </span>
                    {design.layers.map((l, i) => {
                      const mat = MATERIALS[l.materialId] || MATERIALS.sio2;
                      return (
                        <span
                          key={i}
                          className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300"
                        >
                          {mat.formula} ({l.thicknessNm}nm)
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(design.created_at).toLocaleDateString()} {new Date(design.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {design.computation_time_ms ? (
                      <span>Time: {design.computation_time_ms} ms</span>
                    ) : null}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={(e) => handleDelete(design.id, e)}
                    disabled={deletingId === design.id}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-500/30 text-xs"
                    title="Delete design"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onLoadDesign(design);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Load Design</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>{designs.length} designs stored</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
