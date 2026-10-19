import React from 'react';
import { HeroVisualizer } from './HeroVisualizer';
import { ActiveTab } from './SortLabNavbar';
import { ALGORITHMS_LIST } from '../../algorithms';
import {
  Activity,
  Zap,
  HelpCircle,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface LandingOverviewProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({ onSelectTab }) => {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono w-fit shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Next-Gen Computer Science Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Don't just learn computer science.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-cyan-200 bg-clip-text text-transparent">
                Experiment with it.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Explore algorithms, understand complex systems, and test your intuition through
              interactive experiments that make computer science easier to understand.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectTab('lab')}
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter the Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('pillars');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700 transition-all"
              >
                Explore How It Works
              </button>
            </div>

            {/* Micro Specs */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Deterministic Step Tracing</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>100% Client-Side Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Synchronized Pseudocode</span>
              </div>
            </div>
          </div>

          {/* Hero Live Visualizer Component */}
          <div className="lg:col-span-5 w-full">
            <HeroVisualizer />
          </div>
        </div>
      </section>

      {/* The Three Pillars Section */}
      <section id="pillars" className="px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Three Core Modalities
          </span>
          <h2 className="text-3xl font-bold text-white mt-1">
            Engineered for Deep Algorithmic Intuition
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Moving beyond static code lectures into hands-on empirical experimentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: WATCH */}
          <div
            onClick={() => onSelectTab('lab')}
            className="group bg-[#0b0f19] hover:bg-[#0f1524] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Watch — Understand
              </div>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Step-by-Step Laboratory
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Slow down execution, step forward and backward through comparisons and swaps, and inspect live operation explanations mapped directly to highlighted pseudocode lines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Open Algorithm Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2: RACE */}
          <div
            onClick={() => onSelectTab('race')}
            className="group bg-[#0b0f19] hover:bg-[#0f1524] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Race — Compare
              </div>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Head-to-Head Arena
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pit any two algorithms against the exact same initial array. Compare their real comparisons, swaps, and total operation counts side-by-side with empirical analysis.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Enter Algorithm Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3: PREDICT */}
          <div
            onClick={() => onSelectTab('predict')}
            className="group bg-[#0b0f19] hover:bg-[#0f1524] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Predict — Learn
              </div>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Active Recall Practice
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transform passive observing into active thinking. Predict the next algorithmic state at decision points, get instant reasoning feedback, and track your intuition score.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Start Predicting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Available Algorithms Catalog */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Algorithms Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Currently Implemented Laboratory Modules
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('resources')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>View Full Complexity Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALGORITHMS_LIST.map((algo) => (
            <div
              key={algo.id}
              onClick={() => onSelectTab('lab')}
              className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {algo.category}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {algo.timeComplexity.average}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {algo.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Space: {algo.spaceComplexity}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Launch <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="px-4 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80 pt-8 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-semibold">SortLab</span>
          <span>— Interactive Computer Science Laboratory</span>
        </div>
        <div>Engineered with React, TypeScript & Tailwind CSS</div>
      </footer>
    </div>
  );
};
