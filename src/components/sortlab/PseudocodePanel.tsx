import React from 'react';
import { AlgorithmMetadata } from '../../algorithms/types';
import { Code2 } from 'lucide-react';

interface PseudocodePanelProps {
  metadata: AlgorithmMetadata;
  activeLine: number;
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ metadata, activeLine }) => {
  return (
    <div className="bg-[#0b0f19] border border-slate-800/90 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      <div className="px-4 py-3 bg-[#0d1322] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Synchronized Pseudocode
          </h3>
        </div>
        <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
          {metadata.name}
        </div>
      </div>

      <div className="p-3 font-mono text-xs overflow-x-auto flex-1 divide-y divide-slate-900/40">
        {metadata.pseudocode.map((item) => {
          const isActive = item.line === activeLine;
          return (
            <div
              key={item.line}
              className={`flex items-center gap-3 py-1 px-2.5 rounded transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-200 font-medium'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span
                className={`w-5 text-right text-[10px] select-none ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-600'
                }`}
              >
                {item.line}
              </span>
              <pre
                className="whitespace-pre overflow-x-visible font-mono"
                style={{ paddingLeft: `${item.indent * 12}px` }}
              >
                {item.code}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
