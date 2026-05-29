import { Hono } from 'hono';
import { z } from 'zod';
import { providers } from '../providers/index.js';
import { logger } from '../logger.js';

const bodySchema = z.object({
  personPhotoUrl: z.string().optional(),
  itemPhotoUrl: z.string().optional(),
  itemTitle: z.string().min(1).max(200),
});

export const tryonRoute = new Hono();

tryonRoute.post('/', async (c) => {
  const parsed = bodySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: 'Некорректный запрос' }, 400);
  try {
    const result = await providers.tryon.tryOn(parsed.data);
    return c.json(result);
  } catch (err) {
    logger.error('tryon failed', err);
    return c.json({ error: 'Не удалось примерить' }, 502);
  }
});
