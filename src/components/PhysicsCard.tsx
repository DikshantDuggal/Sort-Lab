import React, { useState } from 'react';
import { Atom, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Latex } from './Latex';

export const PhysicsCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col gap-3">
      {/* Header with expand toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer group select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Atom className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Transfer Matrix Physics Formulation
              <span className="text-[10px] font-mono font-normal text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                LaTeX Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Rigorous analytical thin-film boundary conditions (normal incidence)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 text-slate-400 group-hover:text-slate-200 bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1 text-xs"
        >
          <span className="text-[11px] hidden sm:inline">{isExpanded ? 'Hide' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsed summary strip */}
      {!isExpanded && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-500">Phase:</span>
            <Latex math="\delta = \frac{2\pi n d}{\lambda}" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-500">Matrix:</span>
            <Latex math="M = \prod M_j" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-500">Optics:</span>
            <Latex math="R = |r|^2, \; T = 1 - R" />
          </div>
        </div>
      )}

      {/* Expanded full mathematical breakdown */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Phase thickness */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Layer Phase Thickness (<Latex math="\delta_j" />)
              </span>
              <Latex math="\delta_j = \frac{2\pi \, n_j \, d_j}{\lambda}" display={true} className="text-cyan-200" />
            </div>

            {/* Characteristic Matrix */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Characteristic Matrix (<Latex math="M_j" />)
              </span>
              <Latex
                math="M_j = \begin{pmatrix} \cos\delta_j & \frac{i}{n_j}\sin\delta_j \\ i n_j \sin\delta_j & \cos\delta_j \end{pmatrix}"
                display={true}
                className="text-cyan-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* System Multiplication */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Cascaded System Matrix
              </span>
              <Latex
                math="M_{\text{total}} = \prod_{j=1}^N M_j = \begin{pmatrix} m_{11} & m_{12} \\ m_{21} & m_{22} \end{pmatrix}"
                display={true}
                className="text-slate-200"
              />
            </div>

            {/* Reflection & Transmission */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Reflection & Transmission Coefficients
              </span>
              <Latex
                math="r = \frac{n_0 B - C}{n_0 B + C}, \quad R = |r|^2, \quad T = 1 - R"
                display={true}
                className="text-cyan-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
