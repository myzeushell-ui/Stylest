import { Hono } from 'hono';
import { z } from 'zod';
import { providers } from '../providers/index.js';
import { logger } from '../logger.js';
import { SKIN_TYPES } from '@obraz/shared';

const bodySchema = z.object({
  photoUrl: z.string().optional(),
  knownSkinType: z.enum(SKIN_TYPES).optional(),
});

export const skinRoute = new Hono();

skinRoute.post('/analyze', async (c) => {
  const parsed = bodySchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ error: 'Некорректный запрос' }, 400);
  try {
    const result = await providers.skin.analyze(parsed.data);
    return c.json(result);
  } catch (err) {
    logger.error('skin.analyze failed', err);
    return c.json({ error: 'Не удалось проанализировать' }, 502);
  }
});
