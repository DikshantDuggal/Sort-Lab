import React from 'react';
import { X, BookOpen, Atom, CheckCircle2 } from 'lucide-react';
import { Latex } from './Latex';

interface PhysicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhysicsModal: React.FC<PhysicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Atom className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Transfer Matrix Method (TMM)</h2>
              <p className="text-xs text-slate-400">Exact Thin-Film Electromagnetic Wave Propagation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Math & Physics Body */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" /> 1. Optical Phase Thickness (<Latex math="\delta" />)
            </h3>
            <p className="text-slate-400 mb-2">
              For each homogeneous dielectric layer of physical thickness <Latex math="d" /> and refractive index <Latex math="n" />, illuminated by normal incidence light of wavelength <Latex math="\lambda" />:
            </p>
            <div className="bg-slate-900/90 py-2.5 px-4 rounded-lg border border-slate-800 text-cyan-200 shadow-inner">
              <Latex math="\delta = \frac{2\pi n d}{\lambda}" display={true} />
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-cyan-300 mb-1.5">
              2. Characteristic Interference Matrix (<Latex math="M" />)
            </h3>
            <p className="text-slate-400 mb-2">
              The continuous tangential electric and magnetic field boundary conditions across layer <Latex math="j" /> are governed by the unimodular characteristic matrix:
            </p>
            <div className="bg-slate-900/90 py-3 px-4 rounded-lg border border-slate-800 text-cyan-200 shadow-inner">
              <Latex
                math="M_j = \begin{pmatrix} \cos\delta_j & \frac{i}{n_j}\sin\delta_j \\ i n_j \sin\delta_j & \cos\delta_j \end{pmatrix}"
                display={true}
              />
            </div>
            <p className="text-slate-400 text-[11px] mt-2">
              For a multi-layer stack of <Latex math="N" /> films, the overall transfer matrix is the sequential product:
            </p>
            <div className="bg-slate-900/90 py-2 px-4 rounded-lg border border-slate-800 text-slate-200 shadow-inner mt-1">
              <Latex
                math="M_{\text{total}} = \prod_{j=1}^N M_j = M_1 \times M_2 \times \cdots \times M_N = \begin{pmatrix} m_{11} & m_{12} \\ m_{21} & m_{22} \end{pmatrix}"
                display={true}
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-cyan-300 mb-1.5">
              3. Boundary Admittance, Reflection & Transmission
            </h3>
            <p className="text-slate-400 mb-2">
              Coupling the ambient incident medium <Latex math="n_0 = 1.00" /> (Air) and substrate <Latex math="n_s = 1.50" /> (Glass):
            </p>
            <div className="bg-slate-900/90 py-2.5 px-4 rounded-lg border border-slate-800 text-cyan-200 shadow-inner">
              <Latex
                math="\begin{pmatrix} B \\ C \end{pmatrix} = M_{\text{total}} \begin{pmatrix} 1 \\ n_s \end{pmatrix} = \begin{pmatrix} m_{11} + n_s m_{12} \\ m_{21} + n_s m_{22} \end{pmatrix}"
                display={true}
              />
            </div>
            <p className="text-slate-400 text-[11px] mt-2">
              The complex amplitude reflection coefficient <Latex math="r" /> and observable optical responses:
            </p>
            <div className="bg-slate-900/90 py-2.5 px-4 rounded-lg border border-slate-800 text-cyan-200 shadow-inner mt-1">
              <Latex
                math="r = \frac{n_0 B - C}{n_0 B + C}, \qquad R = |r|^2, \qquad T = 1 - R"
                display={true}
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-indigo-300 mb-1.5">
              4. Physics-Guided Search Prior
            </h3>
            <p className="text-slate-400 mb-1">
              Initial candidate populations are seeded using quarter-wave constructive interference criteria:
            </p>
            <div className="bg-slate-900/90 py-2 px-4 rounded-lg border border-slate-800 text-indigo-200 shadow-inner">
              <Latex math="d_{\text{QWOT}} \approx \frac{\lambda_{\text{target}}}{4 n}" display={true} />
            </div>
            <p className="text-slate-400 text-[11px] mt-2">
              Every candidate is evaluated through exact matrix multiplication in client-side JavaScript without approximations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Normal incidence, lossless dielectric model verified.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
