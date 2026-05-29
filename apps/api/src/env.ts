// Чтение и валидация переменных окружения бэкенда.
// ВАЖНО: секреты (ANTHROPIC_API_KEY и т.п.) читаются ТОЛЬКО здесь, на сервере,
// и никогда не отдаются клиенту.

import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(8787),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-4-6'),
  // Если AI_PROVIDER не задан — выбираем автоматически по наличию ключа.
  AI_PROVIDER: z.enum(['mock', 'anthropic']).optional(),
  SKIN_PROVIDER: z.enum(['mock']).default('mock'),
  TRYON_PROVIDER: z.enum(['mock']).default('mock'),
  MARKETPLACE_PROVIDER: z.enum(['mock']).default('mock'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  // Не валим процесс — логируем и используем дефолты, чтобы dev-режим запускался.
  console.warn('[env] Некоторые переменные окружения некорректны, используются значения по умолчанию.');
}

const raw = parsed.success ? parsed.data : schema.parse({});

export const env = {
  ...raw,
  // Автовыбор AI-провайдера: anthropic если есть ключ, иначе mock.
  aiProvider: raw.AI_PROVIDER ?? (raw.ANTHROPIC_API_KEY ? 'anthropic' : 'mock'),
} as const;
