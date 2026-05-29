// Типы DTO для общения с бэком (часть переиспользуется из @obraz/shared).
import type {
  SkinAnalysisResult,
  TryOnResult,
  MarketplaceItem,
  ScoreBreakdown,
} from '@obraz/shared';

export type { SkinAnalysisResult, TryOnResult, MarketplaceItem };

export interface AIChatMessageDTO {
  role: 'user' | 'assistant';
  content: string;
}

export type ScoreBreakdownDTO = ScoreBreakdown;
