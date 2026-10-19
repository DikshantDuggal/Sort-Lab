import React from 'react';
import { Layers, Activity, Zap, HelpCircle, BookOpen, Atom } from 'lucide-react';

export type ActiveTab = 'overview' | 'lab' | 'race' | 'predict' | 'resources' | 'optics';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const SortLabNavbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                SortLab
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                CS Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Computer Science Laboratory
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lab'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Algorithm Lab</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-950/90 text-cyan-300 ml-0.5">
              Watch
            </span>
          </button>

          <button
            onClick={() => onSelectTab('race')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'race'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Compare</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-indigo-950/90 text-indigo-300 ml-0.5">
              Race
            </span>
          </button>

          <button
            onClick={() => onSelectTab('predict')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'predict'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-amber-950/90 text-amber-300 ml-0.5">
              Predict
            </span>
          </button>

          <button
            onClick={() => onSelectTab('resources')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Resources</span>
          </button>

          {/* Preserved Optics Simulation Lab module */}
          <button
            onClick={() => onSelectTab('optics')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'optics'
                ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
            title="Switch to Photonic Material Physics Simulator"
          >
            <Atom className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Optics Lab</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
