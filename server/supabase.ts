import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export interface SavedPhotonicDesign {
  id: string;
  created_at: string;
  name: string;
  target_wavelength: number;
  behavior: 'reflect' | 'transmit';
  num_layers: number;
  score: number;
  layers: { materialId: string; thicknessNm: number }[];
  spectrum?: { wavelength: number; reflectionPct: number; transmissionPct: number }[];
  candidates_tested?: number;
  computation_time_ms?: number;
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl!, supabaseKey!);
    console.log('✅ Supabase client initialized with project:', supabaseUrl);
  } catch (err) {
    console.error('⚠️ Failed to initialize Supabase client:', err);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not found or placeholder; operating in fallback in-memory mode.');
}

// In-memory fallback repository when Supabase credentials are not yet entered
const inMemoryDesigns: SavedPhotonicDesign[] = [
  {
    id: 'seed-blue-reflector',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    name: 'Standard Blue Light Reflector',
    target_wavelength: 450,
    behavior: 'reflect',
    num_layers: 4,
    score: 94.2,
    layers: [
      { materialId: 'tio2', thicknessNm: 82 },
      { materialId: 'sio2', thicknessNm: 143 },
      { materialId: 'tio2', thicknessNm: 96 },
      { materialId: 'sio2', thicknessNm: 151 }
    ],
    candidates_tested: 2450,
    computation_time_ms: 284
  },
  {
    id: 'seed-red-pass',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    name: 'Deep Red Passband Filter',
    target_wavelength: 650,
    behavior: 'transmit',
    num_layers: 4,
    score: 91.5,
    layers: [
      { materialId: 'tio2', thicknessNm: 143 },
      { materialId: 'mgf2', thicknessNm: 87 },
      { materialId: 'tio2', thicknessNm: 81 },
      { materialId: 'sio2', thicknessNm: 60 }
    ],
    candidates_tested: 1840,
    computation_time_ms: 215
  }
];

export async function fetchDesigns(): Promise<{ data: SavedPhotonicDesign[]; error: string | null; source: 'supabase' | 'in-memory' }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('photonic_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, using fallback:', error.message);
        return { data: inMemoryDesigns, error: error.message, source: 'in-memory' };
      }

      return { data: data || [], error: null, source: 'supabase' };
    } catch (err: any) {
      return { data: inMemoryDesigns, error: err.message, source: 'in-memory' };
    }
  }

  return { data: inMemoryDesigns, error: null, source: 'in-memory' };
}

export async function insertDesign(design: Omit<SavedPhotonicDesign, 'id' | 'created_at'>): Promise<{ data: SavedPhotonicDesign | null; error: string | null; source: 'supabase' | 'in-memory' }> {
  const newRecord: SavedPhotonicDesign = {
    ...design,
    id: `des_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString()
  };

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('photonic_designs')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert failed, saving to local in-memory store:', error.message);
        inMemoryDesigns.unshift(newRecord);
        return { data: newRecord, error: error.message, source: 'in-memory' };
      }

      return { data: data || newRecord, error: null, source: 'supabase' };
    } catch (err: any) {
      inMemoryDesigns.unshift(newRecord);
      return { data: newRecord, error: err.message, source: 'in-memory' };
    }
  }

  inMemoryDesigns.unshift(newRecord);
  return { data: newRecord, error: null, source: 'in-memory' };
}

export async function removeDesign(id: string): Promise<{ success: boolean; error: string | null; source: 'supabase' | 'in-memory' }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('photonic_designs')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message, source: 'supabase' };
      }
      return { success: true, error: null, source: 'supabase' };
    } catch (err: any) {
      return { success: false, error: err.message, source: 'supabase' };
    }
  }

  const idx = inMemoryDesigns.findIndex(d => d.id === id);
  if (idx !== -1) {
    inMemoryDesigns.splice(idx, 1);
    return { success: true, error: null, source: 'in-memory' };
  }
  return { success: false, error: 'Design not found', source: 'in-memory' };
}
