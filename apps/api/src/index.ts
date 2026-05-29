// Точка входа бэкенда «Образ» (Hono).
// Все «тяжёлые» возможности доступны только через эти эндпоинты (прокси-паттерн):
// ключи и провайдеры живут здесь, на сервере.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { env } from './env.js';
import { logger } from './logger.js';
import { providers } from './providers/index.js';
import { aiRoute } from './routes/ai.js';
import { skinRoute } from './routes/skin.js';
import { tryonRoute } from './routes/tryon.js';
import { marketplaceRoute } from './routes/marketplace.js';
import { recommendationsRoute } from './routes/recommendations.js';

const app = new Hono();

// CORS для локального фронта (Vite). В проде сузить до своего домена.
app.use('*', cors());

app.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'obraz-api',
    providers: {
      ai: providers.ai.name,
      skin: providers.skin.name,
      tryon: providers.tryon.name,
      marketplace: providers.marketplace.name,
    },
  }),
);

app.route('/api/ai', aiRoute);
app.route('/api/skin', skinRoute);
app.route('/api/tryon', tryonRoute);
app.route('/api/marketplace', marketplaceRoute);
app.route('/api/recommendations', recommendationsRoute);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info(`obraz-api слушает http://localhost:${info.port}`);
});

export { app };
