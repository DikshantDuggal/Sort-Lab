import { Router, Request, Response } from 'express';
import { calculateSpectrum, Layer } from '../../src/physics/tmm';
import { runPhysicsOptimizer, PRESETS, createCustomTarget } from '../../src/physics/optimizer';

export const physicsRouter = Router();

// POST /api/physics/spectrum - Compute TMM spectrum for arbitrary layer stack
physicsRouter.post('/spectrum', (req: Request, res: Response) => {
  try {
    const { layers, startWl = 400, endWl = 700, step = 2 } = req.body;
    if (!layers || !Array.isArray(layers)) {
      return res.status(400).json({ success: false, error: 'Layers array is required.' });
    }

    const spectrum = calculateSpectrum(layers as Layer[], startWl, endWl, step);
    res.json({ success: true, count: spectrum.length, spectrum });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/physics/optimize - Run server-side physics-guided heuristic search
physicsRouter.post('/optimize', async (req: Request, res: Response) => {
  try {
    const { presetId, wavelength = 450, behavior = 'reflect', numLayers = 4 } = req.body;

    let target = PRESETS.find(p => p.id === presetId);
    if (!target) {
      target = createCustomTarget(Number(wavelength), behavior);
    }

    const result = await runPhysicsOptimizer(target, Number(numLayers));
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
