// Роут расчёта PurchaseImpactScore. Тонкая обёртка над общим движком
// computePurchaseImpact из @obraz/shared (формулы — там, прозрачные).
// Может работать и на клиенте, но держим на бэке для единообразия (прокси).

import { Hono } from 'hono';
import { z } from 'zod';
import {
  ITEM_TYPES,
  WARDROBE_CATEGORIES,
  LIFESTYLE_TAGS,
  computePurchaseImpact,
  type ScoreCandidate,
  type ScoreContext,
} from '@obraz/shared';
import { logger } from '../logger.js';

const candidateSchema = z.object({
  itemType: z.enum(ITEM_TYPES),
  priceRub: z.number().nonnegative(),
  color: z.string().optional(),
  category: z.enum(WARDROBE_CATEGORIES).optional(),
  ingredients: z.array(z.string()).optional(),
  lifestyleTags: z.array(z.enum(LIFESTYLE_TAGS)).optional(),
});

// Контекст валидируем мягко: пропускаем как есть (формы заполняет наш же фронт).
const bodySchema = z.object({
  candidate: candidateSchema,
  context: z.object({
    profile: z.any(),
    styleDNA: z.any().optional(),
    beautyDNA: z.any().optional(),
    wardrobe: z.array(z.any()).default([]),
  }),
});

export const recommendationsRoute = new Hono();

recommendationsRoute.post('/score', async (c) => {
  const parsed = bodySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: 'Некорректный запрос', details: parsed.error.flatten() }, 400);
  }
  try {
    const candidate = parsed.data.candidate as ScoreCandidate;
    const context = parsed.data.context as ScoreContext;
    const result = computePurchaseImpact(candidate, context);
    return c.json(result);
  } catch (err) {
    logger.error('recommendations.score failed', err);
    return c.json({ error: 'Не удалось рассчитать' }, 500);
  }
});
