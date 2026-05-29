// Клиент бэкенда. ВСЕ обращения к «тяжёлым» возможностям (AI, анализ кожи,
// примерка, маркетплейс) идут сюда — на наш сервер, а не напрямую к вендорам.
// В клиенте НЕТ и не может быть ключей.

import type {
  AIChatMessageDTO,
  SkinAnalysisResult,
  TryOnResult,
  MarketplaceItem,
  ScoreBreakdownDTO,
} from './apiTypes';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8787';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return (await res.json()) as T;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export interface AIChatContext {
  displayName?: string;
  colorType?: string;
  bodyType?: string;
  skinType?: string;
  hairType?: string;
  styleGoals?: string[];
  lifestyleTags?: string[];
  styleSummary?: string;
  bestColors?: string[];
  worstColors?: string[];
  wardrobeSize?: number;
}

export const api = {
  health: () => get<{ ok: boolean; providers: Record<string, string> }>('/api/health'),

  aiChat: (messages: AIChatMessageDTO[], context: AIChatContext) =>
    post<{ content: string; provider: string }>('/api/ai/chat', { messages, context }),

  analyzeSkin: (payload: { photoUrl?: string; knownSkinType?: string }) =>
    post<SkinAnalysisResult>('/api/skin/analyze', payload),

  tryOn: (payload: { personPhotoUrl?: string; itemPhotoUrl?: string; itemTitle: string }) =>
    post<TryOnResult>('/api/tryon', payload),

  marketplaceSearch: (query: string, category?: string, maxPriceRub?: number) => {
    const qs = new URLSearchParams({ query });
    if (category) qs.set('category', category);
    if (maxPriceRub) qs.set('maxPriceRub', String(maxPriceRub));
    return get<{ items: MarketplaceItem[] }>(`/api/marketplace/search?${qs.toString()}`);
  },

  score: (candidate: unknown, context: unknown) =>
    post<ScoreBreakdownDTO>('/api/recommendations/score', { candidate, context }),
};
