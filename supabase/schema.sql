-- PhotonForge AI - Supabase Database Schema
-- Run this script in your Supabase SQL Editor to initialize the persistence table.

-- Create table for storing synthesized photonic material designs
CREATE TABLE IF NOT EXISTS public.photonic_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    target_wavelength NUMERIC NOT NULL,
    behavior TEXT NOT NULL CHECK (behavior IN ('reflect', 'transmit')),
    num_layers INT NOT NULL CHECK (num_layers BETWEEN 2 AND 8),
    score NUMERIC NOT NULL,
    layers JSONB NOT NULL,
    spectrum JSONB,
    candidates_tested INT DEFAULT 0,
    computation_time_ms INT DEFAULT 0
);

-- Index for querying by recency and performance score
CREATE INDEX IF NOT EXISTS idx_photonic_designs_created_at ON public.photonic_designs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photonic_designs_score ON public.photonic_designs (score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.photonic_designs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for sharing designs)
CREATE POLICY "Public designs read policy" ON public.photonic_designs
    FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Public designs insert policy" ON public.photonic_designs
    FOR INSERT WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Public designs delete policy" ON public.photonic_designs
    FOR DELETE USING (true);
