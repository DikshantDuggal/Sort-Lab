import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { designsRouter } from './routes/designs';
import { physicsRouter } from './routes/physics';
import { healthRouter } from './routes/health';
import { isSupabaseConfigured } from './supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/designs', designsRouter);
app.use('/api/physics', physicsRouter);

// Root informative endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'PhotonForge AI Backend API',
    description: 'Thin-film Transfer Matrix Method & Supabase persistence service',
    endpoints: [
      'GET  /api/health',
      'GET  /api/designs',
      'POST /api/designs',
      'DELETE /api/designs/:id',
      'POST /api/physics/spectrum',
      'POST /api/physics/optimize'
    ],
    supabaseConfigured: isSupabaseConfigured
  });
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 PhotonForge AI Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Supabase: ${isSupabaseConfigured ? 'Connected to Project' : 'In-Memory / Local Mode'}`);
  console.log(`================================================`);
});

export default app;
