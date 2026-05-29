// Роут AI-чата. Прокси-паттерн: клиент НИКОГДА не ходит в Claude напрямую —
// только через этот эндпоинт, где живёт ключ и где валидируется вход.

import { Hono } from 'hono';
import { z } from 'zod';
import { providers } from '../providers/index.js';
import { buildSystemPrompt } from '../prompt.js';
import { logger } from '../logger.js';

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(40),
  context: z
    .object({
      displayName: z.string().optional(),
      colorType: z.string().optional(),
      bodyType: z.string().optional(),
      skinType: z.string().optional(),
      hairType: z.string().optional(),
      styleGoals: z.array(z.string()).optional(),
      lifestyleTags: z.array(z.string()).optional(),
      styleSummary: z.string().optional(),
      bestColors: z.array(z.string()).optional(),
      worstColors: z.array(z.string()).optional(),
      wardrobeSize: z.number().optional(),
    })
    .optional(),
});

export const aiRoute = new Hono();

aiRoute.post('/chat', async (c) => {
  const parsed = bodySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: 'Некорректный запрос', details: parsed.error.flatten() }, 400);
  }
  const { messages, context } = parsed.data;
  try {
    const system = buildSystemPrompt(context ?? {});
    const res = await providers.ai.chat({ system, messages });
    return c.json(res);
  } catch (err) {
    logger.error('ai.chat failed', err);
    // Деградация: даже при ошибке отдаём вежливый ответ, не роняем UX.
    return c.json(
      { content: 'Сейчас не получилось обратиться к AI. Попробуй ещё раз чуть позже.', provider: 'error' },
      502,
    );
  }
});
