export interface Material {
  id: string;
  name: string;
  formula: string;
  n: number; // Refractive index
  color: string; // Tailored for dark scientific UI representation
  border: string;
  glow: string;
  category: 'ambient' | 'film' | 'substrate';
  description: string;
}

export const MATERIALS: Record<string, Material> = {
  air: {
    id: 'air',
    name: 'Air',
    formula: 'Air (n=1.00)',
    n: 1.00,
    color: 'from-slate-900/40 to-slate-800/40',
    border: 'border-slate-700/50',
    glow: 'rgba(148, 163, 184, 0.15)',
    category: 'ambient',
    description: 'Ambient incident medium'
  },
  mgf2: {
    id: 'mgf2',
    name: 'Magnesium Fluoride',
    formula: 'MgF₂',
    n: 1.38,
    color: 'from-indigo-950/80 via-indigo-900/60 to-blue-900/50',
    border: 'border-indigo-500/60',
    glow: 'rgba(99, 102, 241, 0.35)',
    category: 'film',
    description: 'Low-index fluoride thin film'
  },
  sio2: {
    id: 'sio2',
    name: 'Silicon Dioxide',
    formula: 'SiO₂',
    n: 1.45,
    color: 'from-sky-950/80 via-cyan-950/60 to-blue-950/50',
    border: 'border-cyan-500/60',
    glow: 'rgba(6, 182, 212, 0.35)',
    category: 'film',
    description: 'Standard low-loss dielectric oxide'
  },
  glass: {
    id: 'glass',
    name: 'Substrate Glass',
    formula: 'Glass (n=1.50)',
    n: 1.50,
    color: 'from-emerald-950/80 via-teal-950/60 to-slate-900/70',
    border: 'border-teal-500/60',
    glow: 'rgba(20, 184, 166, 0.25)',
    category: 'substrate',
    description: 'Bulk optical substrate medium'
  },
  tio2: {
    id: 'tio2',
    name: 'Titanium Dioxide',
    formula: 'TiO₂',
    n: 2.40,
    color: 'from-amber-950/80 via-orange-950/60 to-red-950/50',
    border: 'border-amber-500/60',
    glow: 'rgba(245, 158, 11, 0.4)',
    category: 'film',
    description: 'High-index contrast dielectric'
  }
};

// Materials selectable for multi-layer stack films
export const STACK_MATERIALS: Material[] = [
  MATERIALS.tio2,
  MATERIALS.sio2,
  MATERIALS.mgf2
];
