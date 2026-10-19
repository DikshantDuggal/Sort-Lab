import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isClientSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabaseClient: SupabaseClient | null = isClientSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check backend and Supabase connection health
 */
export async function getBackendHealth(): Promise<{
  online: boolean;
  supabaseConfigured: boolean;
  supabaseStatus: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      online: true,
      supabaseConfigured: data.supabase?.configured || false,
      supabaseStatus: data.supabase?.status || 'offline'
    };
  } catch (_err) {
    return {
      online: false,
      supabaseConfigured: isClientSupabaseConfigured,
      supabaseStatus: isClientSupabaseConfigured ? 'direct_client_only' : 'offline_fallback'
    };
  }
}

/**
 * Fetch all saved photonic designs from the Backend / Supabase
 */
export async function fetchSavedDesigns(): Promise<{
  designs: SavedPhotonicDesign[];
  source: 'supabase' | 'in-memory' | 'client';
  error: string | null;
}> {
  try {
    const res = await fetch('/api/designs');
    if (res.ok) {
      const json = await res.json();
      return {
        designs: json.data || [],
        source: json.source || 'in-memory',
        error: json.error || null
      };
    }
  } catch (_e) {
    // Backend fetch failed, try direct Supabase client if available
  }

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('photonic_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { designs: data, source: 'supabase', error: null };
      }
    } catch (_err) {}
  }

  return {
    designs: [],
    source: 'in-memory',
    error: 'Backend API currently offline; please ensure the server is running.'
  };
}

/**
 * Save a new photonic design
 */
export async function savePhotonicDesign(
  design: Omit<SavedPhotonicDesign, 'id' | 'created_at'>
): Promise<{
  data: SavedPhotonicDesign | null;
  source: 'supabase' | 'in-memory' | 'client';
  error: string | null;
}> {
  try {
    const res = await fetch('/api/designs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design)
    });

    if (res.ok) {
      const json = await res.json();
      return {
        data: json.data,
        source: json.source || 'in-memory',
        error: json.error || null
      };
    }
  } catch (_e) {}

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('photonic_designs')
        .insert([design])
        .select()
        .single();

      if (!error && data) {
        return { data, source: 'supabase', error: null };
      }
    } catch (_err) {}
  }

  return {
    data: null,
    source: 'in-memory',
    error: 'Could not connect to backend server or Supabase.'
  };
}

/**
 * Delete a saved design
 */
export async function deleteSavedDesign(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/designs/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (_e) {}

  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('photonic_designs')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch (_e) {}
  }

  return false;
}
