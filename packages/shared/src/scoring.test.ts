import { describe, it, expect } from 'vitest';
import {
  budgetFitScore,
  compatibilityScore,
  lifestyleFitScore,
  wardrobeImpactScore,
  computePurchaseImpact,
  type ScoreContext,
  type ScoreCandidate,
} from './scoring.js';
import type { SelfProfile, StyleDNA, WardrobeItem } from './types.js';

// Минимальные фикстуры.
const profile: SelfProfile = {
  id: 'p1', userId: 'u1', createdAt: '', updatedAt: '',
  displayName: 'Тест', colorType: 'зима', bodyType: 'песочные часы',
  skinType: 'комбинированная', hairType: 'прямые',
  heightCm: 170, clothingSize: 'M', genderPresentation: 'нейтральная',
  monthlyBudgetRub: 10000, styleGoals: ['дороже'], lifestyleTags: ['работа', 'свидания'],
};

const styleDNA: StyleDNA = {
  id: 'd1', userId: 'u1', createdAt: '', updatedAt: '',
  bestColors: ['чёрный', 'белый', 'серый'], worstColors: ['оранжевый'],
  baseWardrobeColors: ['чёрный', 'бежевый'], accentColors: ['бордовый'],
  bestSilhouettes: ['прямой'], worstSilhouettes: ['оверсайз'],
  styleGoals: ['дороже'], lifestyleTags: ['работа'],
  wardrobeStrengths: [], wardrobeWeaknesses: [], missingKeyItems: ['обувь'],
  highImpactPurchases: [], lowValuePurchases: [], styleSummary: '',
};

const wardrobe: WardrobeItem[] = [
  { id: 'w1', userId: 'u1', createdAt: '', updatedAt: '', title: 'Брюки', category: 'низ', color: 'чёрный', seasons: ['всесезон'], wearCount: 10 },
  { id: 'w2', userId: 'u1', createdAt: '', updatedAt: '', title: 'Рубашка', category: 'верх', color: 'белый', seasons: ['всесезон'], wearCount: 5 },
];

const ctx: ScoreContext = { profile, styleDNA, wardrobe };

describe('compatibilityScore', () => {
  it('цвет из лучших → высокий балл', () => {
    const c: ScoreCandidate = { itemType: 'clothing', priceRub: 2000, color: 'чёрный', category: 'обувь' };
    expect(compatibilityScore(c, ctx)).toBeGreaterThanOrEqual(80);
  });
  it('цвет из худших → низкий балл', () => {
    const c: ScoreCandidate = { itemType: 'clothing', priceRub: 2000, color: 'оранжевый', category: 'верх' };
    expect(compatibilityScore(c, ctx)).toBeLessThan(50);
  });
});

describe('budgetFitScore', () => {
  it('дешевле 20% бюджета → 100', () => {
    expect(budgetFitScore({ itemType: 'clothing', priceRub: 1000 }, ctx)).toBe(100);
  });
  it('дороже бюджета → 10', () => {
    expect(budgetFitScore({ itemType: 'clothing', priceRub: 20000 }, ctx)).toBe(10);
  });
});

describe('lifestyleFitScore', () => {
  it('полное совпадение тегов → 100', () => {
    expect(lifestyleFitScore({ itemType: 'clothing', priceRub: 1, lifestyleTags: ['работа'] }, ctx)).toBe(100);
  });
  it('нет тегов → нейтральные 60', () => {
    expect(lifestyleFitScore({ itemType: 'clothing', priceRub: 1 }, ctx)).toBe(60);
  });
});

describe('wardrobeImpactScore', () => {
  it('обувь закрывает пробел и сочетается → бонус', () => {
    const c: ScoreCandidate = { itemType: 'clothing', priceRub: 2000, color: 'чёрный', category: 'обувь' };
    // обувь сочетается с верх+низ (оба в шкафу) → ratio=1, ×1.3 бонус → 100
    expect(wardrobeImpactScore(c, ctx)).toBe(100);
  });
});

describe('computePurchaseImpact', () => {
  it('идеальная вещь даёт высокий финал и объяснение', () => {
    const c: ScoreCandidate = {
      itemType: 'clothing', priceRub: 1500, color: 'чёрный', category: 'обувь', lifestyleTags: ['работа'],
    };
    const r = computePurchaseImpact(c, ctx);
    expect(r.finalScore).toBeGreaterThanOrEqual(70);
    expect(r.aiExplanation).toContain('покупка');
  });
  it('финал всегда в диапазоне 0..100', () => {
    const r = computePurchaseImpact({ itemType: 'beauty', priceRub: 999999 }, ctx);
    expect(r.finalScore).toBeGreaterThanOrEqual(0);
    expect(r.finalScore).toBeLessThanOrEqual(100);
  });
});
