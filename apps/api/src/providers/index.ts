// Фабрика провайдеров — единственное место, где выбирается конкретная
// реализация по переменным окружения. Остальной код зависит только от
// интерфейсов, поэтому подмена вендора не затрагивает роуты и фронт.

import { env } from '../env.js';
import { logger } from '../logger.js';
import type { AIProvider } from './ai/types.js';
import { MockAIProvider } from './ai/mock.js';
import { AnthropicAIProvider } from './ai/anthropic.js';
import { MockSkinAnalysisProvider, type SkinAnalysisProvider } from './skin.js';
import { MockTryOnProvider, type TryOnProvider } from './tryon.js';
import { MockMarketplaceProvider, type MarketplaceProvider } from './marketplace.js';

function makeAIProvider(): AIProvider {
  if (env.aiProvider === 'anthropic') {
    logger.info('AIProvider = anthropic (Claude)');
    return new AnthropicAIProvider();
  }
  logger.info('AIProvider = mock (нет ключа или AI_PROVIDER=mock)');
  return new MockAIProvider();
}

export const providers = {
  ai: makeAIProvider(),
  skin: new MockSkinAnalysisProvider() as SkinAnalysisProvider,
  tryon: new MockTryOnProvider() as TryOnProvider,
  marketplace: new MockMarketplaceProvider() as MarketplaceProvider,
};

export type { AIProvider } from './ai/types.js';
export type { SkinAnalysisProvider } from './skin.js';
export type { TryOnProvider } from './tryon.js';
export type { MarketplaceProvider } from './marketplace.js';
