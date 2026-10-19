import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, BookOpen, Atom, Database } from 'lucide-react';
import { getBackendHealth } from '../services/supabase';

interface NavbarProps {
  onOpenPhysicsModal: () => void;
  onOpenSavedDesigns: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPhysicsModal, onOpenSavedDesigns }) => {
  const [supabaseState, setSupabaseState] = useState<{
    online: boolean;
    configured: boolean;
    status: string;
  }>({
    online: false,
    configured: false,
    status: 'checking'
  });

  useEffect(() => {
    getBackendHealth().then(health => {
      setSupabaseState({
        online: health.online,
        configured: health.supabaseConfigured,
        status: health.supabaseStatus
      });
    });
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Atom className="w-6 h-6 text-cyan-400 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                PhotonForge<span className="text-cyan-400 ml-1 font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40">AI</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300/90 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Inverse Photonic Design
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Design Matter. Control Light. <span className="text-slate-600 mx-1">•</span> <span className="text-cyan-400/80 italic">AI searches. Physics validates.</span>
            </p>
          </div>
        </div>

        {/* Right controls: Scientific badge, Supabase status & Library */}
        <div className="flex items-center gap-2.5">
          {/* Mandatory Scientific disclaimer badge */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-300 font-mono tracking-tight">
              Simulation — simplified material model, normal incidence.
            </span>
          </div>

          {/* Supabase Status Pill */}
          <div
            onClick={onOpenSavedDesigns}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-colors bg-slate-900/90 border-slate-800 hover:border-slate-700"
            title="Click to manage cloud storage & saved designs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseState.configured
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
              }`}
            />
            <span className="text-slate-300">
              {supabaseState.configured ? 'Supabase: Active' : 'Supabase: Ready'}
            </span>
          </div>

          {/* Library Button */}
          <button
            onClick={onOpenSavedDesigns}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded-lg transition-all hover:border-cyan-500/40 hover:text-white"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Library</span>
          </button>

          {/* Physics Equations Button */}
          <button
            onClick={onOpenPhysicsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-all hover:border-cyan-500/40 hover:text-white hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Physics</span> Equations
          </button>
        </div>
      </div>
    </header>
  );
};
