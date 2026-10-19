import React, { useState } from 'react';
import { Layer } from '../physics/tmm';
import { MATERIALS } from '../physics/materials';
import { Layers, Copy, Check, ArrowDown, Sparkles, Cloud } from 'lucide-react';
import { Latex } from './Latex';

interface MaterialStackProps {
  layers: Layer[];
  onSaveDesign?: () => void;
}

export const MaterialStack: React.FC<MaterialStackProps> = ({ layers, onSaveDesign }) => {
  const [copied, setCopied] = useState(false);

  // Calculate total physical thickness
  const totalPhysicalNm = layers.reduce((acc, l) => acc + l.thicknessNm, 0);

  // Calculate total optical thickness (sum of n * d)
  const totalOpticalNm = layers.reduce((acc, l) => {
    const mat = MATERIALS[l.materialId] || MATERIALS.sio2;
    return acc + mat.n * l.thicknessNm;
  }, 0);

  const handleCopyDesign = () => {
    const text = layers
      .map(l => {
        const mat = MATERIALS[l.materialId] || MATERIALS.sio2;
        return `${mat.formula} — ${l.thicknessNm} nm (n=${mat.n.toFixed(2)})`;
      })
      .join('\n');

    navigator.clipboard.writeText(`PHOTONFORGE AI DESIGN:\nIncident Medium: Air (n=1.00)\n${text}\nSubstrate: Glass (n=1.50)\nTotal Thickness: ${totalPhysicalNm} nm`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            4. Material Stack
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            AIR → Layers → GLASS
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onSaveDesign && (
            <button
              onClick={onSaveDesign}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/60 rounded-lg border border-cyan-500/40 hover:border-cyan-400 transition-colors shadow-sm"
              title="Save current design to Supabase database"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save to Cloud</span>
            </button>
          )}

          <button
            onClick={handleCopyDesign}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-800/90 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
            title="Copy design parameters to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Stack</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Visual Thin-Film Cross-Section Graphic (Left/Top) */}
        <div className="lg:col-span-6 flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
            Cross-Section Profile (Air → Glass)
          </span>

          {/* Incident Medium: Air */}
          <div className="relative border border-dashed border-slate-700 bg-slate-950/60 rounded-t-xl px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400/80" />
              <span className="font-bold text-slate-200">Incident Medium (Air)</span>
            </div>
            <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-xs">
              <Latex math="n_0 = 1.00" />
            </span>
          </div>

          {/* Dielectric Interference Layers */}
          <div className="flex flex-col gap-1.5 my-0.5">
            {layers.map((layer, index) => {
              const mat = MATERIALS[layer.materialId] || MATERIALS.sio2;
              // Normalize height visually: min 36px, max 64px based on thickness
              const heightPx = Math.max(38, Math.min(64, Math.round(38 + (layer.thicknessNm / 200) * 26)));

              return (
                <div
                  key={index}
                  style={{ height: `${heightPx}px` }}
                  className={`relative rounded-lg border ${mat.border} bg-gradient-to-r ${mat.color} px-4 flex items-center justify-between transition-all duration-300 shadow-md group`}
                >
                  {/* Subtle index glow */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-10 blur-sm pointer-events-none"
                    style={{ backgroundColor: mat.glow }}
                  />

                  <div className="flex items-center gap-3 z-10">
                    <span className="font-mono text-[10px] w-5 h-5 rounded bg-black/40 border border-white/10 flex items-center justify-center text-slate-300 font-bold">
                      L{index + 1}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-white flex items-center gap-1.5">
                        {mat.formula}
                        <span className="text-[11px] font-normal text-slate-300 hidden sm:inline">
                          ({mat.name})
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 z-10">
                    <span className="text-xs font-mono font-bold text-white bg-black/50 px-2.5 py-1 rounded border border-white/20">
                      {layer.thicknessNm} nm
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      n={mat.n.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Substrate Medium: Glass */}
          <div className="relative border border-teal-500/40 bg-gradient-to-r from-teal-950/40 to-slate-900/60 rounded-b-xl px-4 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400/80 shadow-[0_0_8px_#2dd4bf]" />
              <span className="font-bold text-teal-100">Substrate Medium (Glass)</span>
            </div>
            <span className="font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded border border-teal-500/30 text-xs">
              <Latex math="n_s = 1.50" />
            </span>
          </div>
        </div>

        {/* Best Design Parameters & Breakdown (Right/Bottom) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1. Best Design
            </span>
            <span className="text-[10px] font-mono text-slate-400">Normal Incidence</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 font-mono text-xs">
            <div className="text-slate-400 pb-2 border-b border-slate-800 flex justify-between text-[11px]">
              <span>MATERIAL LAYER</span>
              <span>THICKNESS</span>
            </div>

            {layers.map((l, i) => {
              const mat = MATERIALS[l.materialId] || MATERIALS.sio2;
              return (
                <div key={i} className="flex items-center justify-between py-1.5 text-slate-200 border-b border-slate-900/60 last:border-none">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-normal">{i + 1}.</span>
                    <span className="font-bold text-white tracking-wide">{mat.formula}</span>
                    <span className="text-slate-500 text-[11px]">— (n={mat.n.toFixed(2)})</span>
                  </div>
                  <span className="font-bold text-cyan-300 bg-slate-900/90 px-2.5 py-0.5 rounded border border-slate-800/90 shadow-sm">
                    {mat.formula} — {l.thicknessNm} nm
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Optical Metrics Summary */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Physical Depth</span>
              <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                {totalPhysicalNm} nm
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">
                Optical Path (<Latex math="\sum n_j d_j" />)
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400 mt-0.5 block">
                {Math.round(totalOpticalNm)} nm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
