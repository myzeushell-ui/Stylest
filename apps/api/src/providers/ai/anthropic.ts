// AnthropicAIProvider — реальная реализация «мозга» на Claude (Sonnet).
// Ключ берётся ТОЛЬКО из переменной окружения на сервере. SDK импортируется
// лениво (dynamic import), чтобы приложение поднималось в mock-режиме даже без
// установленного пакета и без ключа.

import type { AIProvider, AIChatRequest, AIChatResponse } from './types.js';
import { env } from '../../env.js';
import { logger } from '../../logger.js';

export class AnthropicAIProvider implements AIProvider {
  readonly name = 'anthropic';

  async chat(req: AIChatRequest): Promise<AIChatResponse> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY не задан — нельзя использовать anthropic-провайдера');
    }
    // Ленивая загрузка SDK.
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const res = await client.messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: req.system,
      messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    // Собираем текст из блоков ответа.
    const content = res.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    logger.info('anthropic.chat ok', { model: env.ANTHROPIC_MODEL });
    return { content, provider: this.name };
  }
}
