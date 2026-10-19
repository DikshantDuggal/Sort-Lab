import React, { useState } from 'react';
import { ALGORITHMS_LIST } from '../../algorithms';
import { BookOpen, Check, X, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const LearningResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlgos = ALGORITHMS_LIST.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-10">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-emerald-400" />
          Complexity Matrix & Learning Resources
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Rigorous asymptotic complexity bounds, theoretical trade-offs, and practical engineering guidance.
        </p>
      </div>

      {/* Complexity Matrix Table */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 bg-[#0d1322] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Asymptotic Complexity Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical and formal bounds for comparison-based sorting algorithms
            </p>
          </div>
          <input
            type="text"
            placeholder="Filter algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#101626] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-60 font-mono"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101626] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Paradigm</th>
                <th className="py-3 px-4 text-emerald-400">Best Time</th>
                <th className="py-3 px-4 text-cyan-400">Average Time</th>
                <th className="py-3 px-4 text-amber-400">Worst Time</th>
                <th className="py-3 px-4 text-indigo-400">Space</th>
                <th className="py-3 px-4">Stable</th>
                <th className="py-3 px-4">In-Place</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAlgos.map((algo) => (
                <tr key={algo.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                    {algo.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{algo.category}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {algo.timeComplexity.best}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400">
                    {algo.timeComplexity.average}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">
                    {algo.timeComplexity.worst}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-400">{algo.spaceComplexity}</td>
                  <td className="py-3.5 px-4">
                    {algo.stable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {algo.inPlace ? (
                      <span className="inline-flex items-center gap-1 text-cyan-400">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Decision Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">When to use Insertion Sort?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
              Insertion Sort is unbeatable on small collections (n &lt; 30) or arrays that are already nearly sorted. Its adaptive nature achieves linear O(n) performance with zero auxiliary memory allocation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
            Real-world: Used inside hybrid sorts like Timsort & introsort.
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">When to use Quick Sort?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
              For general-purpose in-memory sorting of random data. With good cache locality and in-place partitioning, Quick Sort routinely outperforms Merge Sort and Heap Sort in practice by a constant factor of 2–3x.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
            Real-world: Default sorting engine in C qsort and C++ std::sort.
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">When to use Merge Sort?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
              When strict stability is mandatory or worst-case O(n log n) guarantees are required (e.g. safety-critical systems). Ideal for sorting linked lists and massive external disk datasets.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-indigo-400">
            Real-world: Java Arrays.sort() for objects and Python list.sort().
          </div>
        </div>
      </div>
    </div>
  );
};
