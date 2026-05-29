import { Hono } from 'hono';
import { z } from 'zod';
import { providers } from '../providers/index.js';
import { logger } from '../logger.js';
import { WARDROBE_CATEGORIES } from '@obraz/shared';

const querySchema = z.object({
  query: z.string().default(''),
  category: z.enum(WARDROBE_CATEGORIES).optional(),
  maxPriceRub: z.coerce.number().optional(),
});

export const marketplaceRoute = new Hono();

marketplaceRoute.get('/search', async (c) => {
  const parsed = querySchema.safeParse({
    query: c.req.query('query'),
    category: c.req.query('category'),
    maxPriceRub: c.req.query('maxPriceRub'),
  });
  if (!parsed.success) return c.json({ error: 'Некорректный запрос' }, 400);
  try {
    const items = await providers.marketplace.search(parsed.data);
    return c.json({ items });
  } catch (err) {
    logger.error('marketplace.search failed', err);
    return c.json({ error: 'Не удалось найти товары' }, 502);
  }
});
