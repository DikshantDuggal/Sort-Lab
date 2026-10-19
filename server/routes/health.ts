import { Router, Request, Response } from 'express';
import { isSupabaseConfigured, supabase } from '../supabase';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'unconfigured_fallback_in_memory';

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('photonic_designs').select('count', { count: 'exact', head: true });
      dbStatus = error ? `connected_warning: ${error.message}` : 'connected';
    } catch (e: any) {
      dbStatus = `connection_error: ${e.message}`;
    }
  }

  res.json({
    status: 'online',
    service: 'PhotonForge AI Backend API',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    supabase: {
      configured: isSupabaseConfigured,
      status: dbStatus
    }
  });
});
