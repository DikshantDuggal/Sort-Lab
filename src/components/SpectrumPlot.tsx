import React, { useState, useRef, useMemo } from 'react';
import { OpticalPoint } from '../physics/tmm';
import { OptimizationTarget } from '../physics/optimizer';
import { Activity } from 'lucide-react';
import { Latex } from './Latex';

interface SpectrumPlotProps {
  spectrum: OpticalPoint[];
  target: OptimizationTarget;
  isOptimizing: boolean;
}

export const SpectrumPlot: React.FC<SpectrumPlotProps> = ({
  spectrum,
  target,
  isOptimizing
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG viewport coordinates
  const width = 800;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // X scale: 400nm to 700nm
  const minWl = 400;
  const maxWl = 700;
  const wlRange = maxWl - minWl;

  const getX = (wl: number) => padding.left + ((wl - minWl) / wlRange) * innerWidth;
  // Y scale: 0% to 100%
  const getY = (pct: number) => padding.top + innerHeight - (pct / 100) * innerHeight;

  // Generate SVG path commands for Reflection and Transmission
  const { reflectionPath, transmissionPath, reflectionArea } = useMemo(() => {
    if (!spectrum || spectrum.length === 0) {
      return { reflectionPath: '', transmissionPath: '', reflectionArea: '' };
    }

    let rD = '';
    let tD = '';
    let rArea = '';

    spectrum.forEach((pt, idx) => {
      const x = getX(pt.wavelength);
      const yR = getY(pt.reflectionPct);
      const yT = getY(pt.transmissionPct);

      if (idx === 0) {
        rD += `M ${x.toFixed(1)} ${yR.toFixed(1)}`;
        tD += `M ${x.toFixed(1)} ${yT.toFixed(1)}`;
        rArea += `M ${x.toFixed(1)} ${getY(0).toFixed(1)} L ${x.toFixed(1)} ${yR.toFixed(1)}`;
      } else {
        rD += ` L ${x.toFixed(1)} ${yR.toFixed(1)}`;
        tD += ` L ${x.toFixed(1)} ${yT.toFixed(1)}`;
        rArea += ` L ${x.toFixed(1)} ${yR.toFixed(1)}`;
      }
    });

    const lastPt = spectrum[spectrum.length - 1];
    rArea += ` L ${getX(lastPt.wavelength).toFixed(1)} ${getY(0).toFixed(1)} Z`;

    return {
      reflectionPath: rD,
      transmissionPath: tD,
      reflectionArea: rArea
    };
  }, [spectrum]);

  // Target band highlights
  const targetBands = useMemo(() => {
    const bands: { start: number; end: number; type: 'reflect' | 'transmit' }[] = [];
    if (target.reflectBands) {
      target.reflectBands.forEach(([start, end]) => bands.push({ start, end, type: 'reflect' }));
    }
    if (target.transmitBands) {
      target.transmitBands.forEach(([start, end]) => bands.push({ start, end, type: 'transmit' }));
    }
    if (bands.length === 0) {
      // Custom band
      const center = target.targetWavelength;
      bands.push({
        start: Math.max(400, center - 35),
        end: Math.min(700, center + 35),
        type: target.behavior
      });
    }
    return bands;
  }, [target]);

  // Mouse move handler for tooltips
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || spectrum.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgRelativeX = (mouseX / rect.width) * width;

    if (svgRelativeX < padding.left || svgRelativeX > width - padding.right) {
      setHoverIndex(null);
      return;
    }

    const ratio = (svgRelativeX - padding.left) / innerWidth;
    const targetWl = minWl + ratio * wlRange;

    // Find closest index
    let closestIdx = 0;
    let minDiff = Infinity;
    spectrum.forEach((pt, idx) => {
      const diff = Math.abs(pt.wavelength - targetWl);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const hoveredPoint = hoverIndex !== null ? spectrum[hoverIndex] : null;

  return (
    <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col gap-3">
      {/* Card Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            3. Spectrum Graph
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            X: Wavelength (nm) • Y: Optical response (%)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="text-cyan-300 flex items-center gap-1">
              Reflection <Latex math="R(\lambda)" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            <span className="text-amber-300 flex items-center gap-1">
              Transmission <Latex math="T(\lambda)" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div ref={containerRef} className="relative w-full aspect-[2/1] min-h-[280px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Gradient for Reflection Area */}
            <linearGradient id="reflectionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            {/* Target band pattern */}
            <pattern id="targetHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.15" />
            </pattern>
          </defs>

          {/* Grid lines: Y-axis (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map(pct => {
            const y = getY(pct);
            return (
              <g key={`y-${pct}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray={pct === 0 || pct === 100 ? undefined : '4 4'}
                  strokeWidth={pct === 0 || pct === 100 ? '1.5' : '1'}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[11px]"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Grid lines: X-axis (Wavelength ticks 400, 450, 500, 550, 600, 650, 700) */}
          {[400, 450, 500, 550, 600, 650, 700].map(wl => {
            const x = getX(wl);
            return (
              <g key={`x-${wl}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + innerHeight}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + innerHeight + 20}
                  textAnchor="middle"
                  className="fill-slate-400 font-mono text-[11px]"
                >
                  {wl}
                </text>
              </g>
            );
          })}

          {/* Target Bands Shading */}
          {targetBands.map((band, idx) => {
            const x1 = Math.max(padding.left, getX(band.start));
            const x2 = Math.min(width - padding.right, getX(band.end));
            const bandWidth = Math.max(0, x2 - x1);
            const isReflect = band.type === 'reflect';

            return (
              <g key={`band-${idx}`}>
                <rect
                  x={x1}
                  y={padding.top}
                  width={bandWidth}
                  height={innerHeight}
                  fill={isReflect ? 'rgba(6, 182, 212, 0.08)' : 'rgba(245, 158, 11, 0.08)'}
                />
                <rect
                  x={x1}
                  y={padding.top}
                  width={bandWidth}
                  height={innerHeight}
                  fill="url(#targetHatch)"
                />
                <line
                  x1={x1}
                  y1={padding.top}
                  x2={x1}
                  y2={padding.top + innerHeight}
                  stroke={isReflect ? '#06b6d4' : '#f59e0b'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  strokeOpacity="0.6"
                />
                <line
                  x1={x2}
                  y1={padding.top}
                  x2={x2}
                  y2={padding.top + innerHeight}
                  stroke={isReflect ? '#06b6d4' : '#f59e0b'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  strokeOpacity="0.6"
                />
                <text
                  x={x1 + bandWidth / 2}
                  y={padding.top + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                    isReflect ? 'fill-cyan-400' : 'fill-amber-400'
                  }`}
                >
                  {isReflect ? 'Target Block' : 'Target Pass'}
                </text>
              </g>
            );
          })}

          {/* Reflection Area Fill */}
          <path d={reflectionArea} fill="url(#reflectionGradient)" />

          {/* Transmission Line (Gold/Amber) */}
          <path
            d={transmissionPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Reflection Line (Cyan/Sky) */}
          <path
            d={reflectionPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 shadow-[0_0_10px_#06b6d4]"
          />

          {/* Interactive Hover Indicator */}
          {hoveredPoint && (
            <g>
              <line
                x1={getX(hoveredPoint.wavelength)}
                y1={padding.top}
                x2={getX(hoveredPoint.wavelength)}
                y2={padding.top + innerHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Reflection dot */}
              <circle
                cx={getX(hoveredPoint.wavelength)}
                cy={getY(hoveredPoint.reflectionPct)}
                r="4.5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Transmission dot */}
              <circle
                cx={getX(hoveredPoint.wavelength)}
                cy={getY(hoveredPoint.transmissionPct)}
                r="4.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Visible light spectrum strip under X axis */}
          <g transform={`translate(${padding.left}, ${padding.top + innerHeight + 28})`}>
            <defs>
              <linearGradient id="spectrumGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="15%" stopColor="#3b82f6" />
                <stop offset="35%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="85%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width={innerWidth}
              height="5"
              rx="2.5"
              fill="url(#spectrumGradient)"
              opacity="0.8"
            />
          </g>

          {/* Axis Labels */}
          <text
            x={padding.left + innerWidth / 2}
            y={height - 2}
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[11px]"
          >
            Wavelength λ (nm)
          </text>
        </svg>

        {/* Floating Tooltip readout on Hover */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-950/95 border border-slate-700 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs font-mono"
            style={{
              left: `${Math.min(
                85,
                Math.max(15, ((hoveredPoint.wavelength - minWl) / wlRange) * 100)
              )}%`,
              top: '12px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-white font-bold pb-1 border-b border-slate-800 mb-1 flex items-center justify-between gap-3">
              <span className="flex items-center">
                <Latex math={`\\lambda = ${hoveredPoint.wavelength}\\text{ nm}`} />
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40"
                style={{
                  backgroundColor:
                    hoveredPoint.wavelength < 490
                      ? '#0ea5e9'
                      : hoveredPoint.wavelength < 570
                      ? '#10b981'
                      : '#ef4444'
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-cyan-400 flex items-center justify-between gap-3">
                <span>Reflection <Latex math="R" />:</span>
                <b className="text-white font-mono">{hoveredPoint.reflectionPct}%</b>
              </span>
              <span className="text-amber-400 flex items-center justify-between gap-3">
                <span>Transmission <Latex math="T" />:</span>
                <b className="text-white font-mono">{hoveredPoint.transmissionPct}%</b>
              </span>
            </div>
          </div>
        )}

        {/* Optimizing Overlay */}
        {isOptimizing && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl pointer-events-none">
            <div className="bg-slate-900/90 border border-cyan-500/50 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-cyan-300">Computing TMM Eigenmodes...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
