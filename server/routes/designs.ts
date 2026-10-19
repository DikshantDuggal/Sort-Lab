import { Router, Request, Response } from 'express';
import { fetchDesigns, insertDesign, removeDesign } from '../supabase';

export const designsRouter = Router();

// GET /api/designs - Retrieve all saved photonic designs
designsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await fetchDesigns();
    res.json({
      success: true,
      data: result.data,
      source: result.source,
      error: result.error
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/designs - Save a new synthesized photonic design
designsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, target_wavelength, behavior, num_layers, score, layers, spectrum, candidates_tested, computation_time_ms } = req.body;

    if (!name || !target_wavelength || !behavior || !layers || !score) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, target_wavelength, behavior, layers, score.'
      });
    }

    const result = await insertDesign({
      name,
      target_wavelength: Number(target_wavelength),
      behavior,
      num_layers: Number(num_layers || layers.length),
      score: Number(score),
      layers,
      spectrum,
      candidates_tested: Number(candidates_tested || 0),
      computation_time_ms: Number(computation_time_ms || 0)
    });

    res.status(201).json({
      success: true,
      data: result.data,
      source: result.source,
      error: result.error
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/designs/:id - Remove a saved design
designsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await removeDesign(id);
    if (!result.success) {
      return res.status(404).json({ success: false, error: result.error });
    }
    res.json({ success: true, message: `Design ${id} removed successfully.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
