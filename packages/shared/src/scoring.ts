// ─────────────────────────────────────────────────────────────────────────
// PersonalRecommendationEngine — расчёт PurchaseImpactScore.
//
// ГЛАВНЫЙ ПРИНЦИП: никакой «магии». У каждого score — явная формула с
// именованными весами и комментарием «почему так». Конкретные числа весов —
// это ДОПУЩЕНИЕ продукта (их можно калибровать на реальных данных), но логика
// прозрачна и объяснима пользователю.
//
// Все score в шкале 0..100. finalScore — взвешенная сумма (веса зависят от
// типа товара). Движок также генерирует aiExplanation — текстовое «почему»,
// которое позже можно обогатить настоящим AIProvider.
// ─────────────────────────────────────────────────────────────────────────

import type { LifestyleTag, WardrobeCategory, ItemType } from './constants.js';
import type { SelfProfile, StyleDNA, BeautyDNA, WardrobeItem } from './types.js';

/** Прижать число к диапазону 0..100 и округлить. */
export function clamp100(x: number): number {
  return Math.round(Math.max(0, Math.min(100, x)));
}

/** Карта сочетаемости категорий: с чем «дружит» вещь при сборке образа. */
const COMBINABLE: Record<WardrobeCategory, WardrobeCategory[]> = {
  'верх': ['низ', 'верхняя одежда', 'обувь', 'аксессуар', 'сумка'],
  'низ': ['верх', 'верхняя одежда', 'обувь', 'аксессуар', 'сумка'],
  'платье': ['верхняя одежда', 'обувь', 'аксессуар', 'сумка'],
  'верхняя одежда': ['верх', 'низ', 'платье', 'обувь', 'аксессуар'],
  'обувь': ['верх', 'низ', 'платье', 'верхняя одежда'],
  'аксессуар': ['верх', 'низ', 'платье', 'верхняя одежда', 'обувь', 'сумка'],
  'сумка': ['верх', 'низ', 'платье', 'обувь', 'аксессуар'],
  'бельё/база': ['верх', 'низ', 'платье'],
};

/** Что мы оцениваем перед покупкой. */
export interface ScoreCandidate {
  itemType: ItemType;
  priceRub: number;
  /** Для одежды. */
  color?: string;
  category?: WardrobeCategory;
  /** Для бьюти/волос. */
  ingredients?: string[];
  /** Под какие сценарии жизни вещь (для lifestyleFitScore). */
  lifestyleTags?: LifestyleTag[];
}

/** Контекст пользователя для расчёта. */
export interface ScoreContext {
  profile: SelfProfile;
  styleDNA?: StyleDNA;
  beautyDNA?: BeautyDNA;
  wardrobe: WardrobeItem[];
}

const norm = (s: string) => s.trim().toLowerCase();
const includesNorm = (arr: string[], v: string) => arr.map(norm).includes(norm(v));

// ── 1. compatibilityScore — совпадение с палитрой/стилем ──────────────────
// Базис 50 (нейтрально). Дальше двигаем по тому, попадает ли цвет в «лучшие»,
// «базовые», «акцентные» или «худшие» цвета Style DNA.
export function compatibilityScore(c: ScoreCandidate, ctx: ScoreContext): number {
  const dna = ctx.styleDNA;
  const bdna = ctx.beautyDNA;

  // Бьюти/волосы оцениваем по «лучшим цветам макияжа».
  if (c.itemType === 'beauty' || c.itemType === 'hair') {
    if (!c.color || !bdna) return 60;
    if (includesNorm(bdna.bestMakeupColors, c.color)) return 90;
    if (includesNorm(bdna.worstMakeupStyles, c.color)) return 30;
    return 60;
  }
  // Фитнес — цвет не определяет совместимость.
  if (c.itemType === 'fitness') return 65;

  // Одежда.
  if (!c.color || !dna) return 50;
  let s = 50;
  if (includesNorm(dna.bestColors, c.color)) s += 35;
  else if (includesNorm(dna.baseWardrobeColors, c.color)) s += 20;
  else if (includesNorm(dna.accentColors, c.color)) s += 15;
  if (includesNorm(dna.worstColors, c.color)) s -= 40;
  return clamp100(s);
}

// ── 2. wardrobeImpactScore — сколько образов усилит покупка ───────────────
// Идея: вещь ценна, если (а) сочетается со многими имеющимися вещами и
// (б) закрывает пробел (missingKeyItems) — тогда даём бонус.
export function wardrobeImpactScore(c: ScoreCandidate, ctx: ScoreContext): number {
  if (c.itemType !== 'clothing' || !c.category) return 50; // не одежда — нейтрально
  const wardrobe = ctx.wardrobe;
  if (wardrobe.length === 0) return 60; // пустой шкаф — любая база полезна

  const combinable = COMBINABLE[c.category] ?? [];
  const matches = wardrobe.filter((w) => combinable.includes(w.category)).length;
  // Доля сочетаемых вещей → база импакта (0..100).
  const ratio = matches / wardrobe.length;
  let s = ratio * 100;

  // Бонус за закрытие пробела: если эта категория названа в missingKeyItems.
  const isGap = (ctx.styleDNA?.missingKeyItems ?? []).some((m) => norm(m).includes(norm(c.category!)));
  if (isGap) s *= 1.3;

  return clamp100(s);
}

// ── 3. beautyCompatibilityScore — совместимость с кожей/волосами ──────────
// Для бьюти/волос смотрим ингредиенты против рекомендованных/нежелательных.
export function beautyCompatibilityScore(c: ScoreCandidate, ctx: ScoreContext): number {
  if (c.itemType !== 'beauty' && c.itemType !== 'hair') return 70; // не бьюти — нейтрально
  const bdna = ctx.beautyDNA;
  if (!bdna || !c.ingredients || c.ingredients.length === 0) return 60;

  let s = 60;
  for (const ing of c.ingredients) {
    if (includesNorm(bdna.recommendedIngredients, ing)) s += 15;
    if (includesNorm(bdna.ingredientsToAvoid, ing)) s -= 25;
  }
  return clamp100(s);
}

// ── 4. budgetFitScore — вписывается ли в бюджет ───────────────────────────
// ratio = цена / месячный бюджет. До 20% бюджета — идеально (100). Чем ближе
// к 100% бюджета на одну вещь — тем ниже (до 10).
export function budgetFitScore(c: ScoreCandidate, ctx: ScoreContext): number {
  const budget = ctx.profile.monthlyBudgetRub;
  if (budget <= 0) return 50; // бюджет не задан — нейтрально
  const ratio = c.priceRub / budget;
  if (ratio <= 0.2) return 100;
  if (ratio >= 1) return 10;
  // Линейно 100 → 10 на отрезке ratio ∈ [0.2, 1].
  return clamp100(100 - ((ratio - 0.2) / 0.8) * 90);
}

// ── 5. lifestyleFitScore — подходит ли под образ жизни ────────────────────
// Доля пересечения тегов вещи с тегами пользователя. Базис 40, чтобы вещь без
// тегов не уходила в ноль.
export function lifestyleFitScore(c: ScoreCandidate, ctx: ScoreContext): number {
  const userTags = ctx.profile.lifestyleTags;
  const itemTags = c.lifestyleTags ?? [];
  if (itemTags.length === 0) return 60; // вещь универсальна
  const overlap = itemTags.filter((t) => userTags.includes(t)).length;
  return clamp100(40 + 60 * (overlap / itemTags.length));
}

// ── Веса finalScore зависят от типа товара (сумма = 1) ────────────────────
const WEIGHTS: Record<ItemType, {
  compatibility: number; wardrobe: number; beauty: number; budget: number; lifestyle: number;
}> = {
  clothing: { compatibility: 0.30, wardrobe: 0.30, beauty: 0.05, budget: 0.20, lifestyle: 0.15 },
  beauty: { compatibility: 0.20, wardrobe: 0.05, beauty: 0.40, budget: 0.20, lifestyle: 0.15 },
  hair: { compatibility: 0.20, wardrobe: 0.05, beauty: 0.40, budget: 0.20, lifestyle: 0.15 },
  fitness: { compatibility: 0.15, wardrobe: 0.10, beauty: 0.10, budget: 0.30, lifestyle: 0.35 },
};

export interface ScoreBreakdown {
  compatibilityScore: number;
  wardrobeImpactScore: number;
  beautyCompatibilityScore: number;
  budgetFitScore: number;
  lifestyleFitScore: number;
  finalScore: number;
  aiExplanation: string;
}

/** Главная функция движка: считает все score + финал + объяснение. */
export function computePurchaseImpact(c: ScoreCandidate, ctx: ScoreContext): ScoreBreakdown {
  const compatibility = compatibilityScore(c, ctx);
  const wardrobe = wardrobeImpactScore(c, ctx);
  const beauty = beautyCompatibilityScore(c, ctx);
  const budget = budgetFitScore(c, ctx);
  const lifestyle = lifestyleFitScore(c, ctx);

  const w = WEIGHTS[c.itemType];
  const finalScore = clamp100(
    w.compatibility * compatibility +
      w.wardrobe * wardrobe +
      w.beauty * beauty +
      w.budget * budget +
      w.lifestyle * lifestyle,
  );

  return {
    compatibilityScore: compatibility,
    wardrobeImpactScore: wardrobe,
    beautyCompatibilityScore: beauty,
    budgetFitScore: budget,
    lifestyleFitScore: lifestyle,
    finalScore,
    aiExplanation: buildExplanation(c, {
      compatibility, wardrobe, beauty, budget, lifestyle, finalScore,
    }),
  };
}

/** Собирает понятное «почему» из самых сильных и слабых факторов. */
function buildExplanation(
  c: ScoreCandidate,
  s: { compatibility: number; wardrobe: number; beauty: number; budget: number; lifestyle: number; finalScore: number },
): string {
  const factors: Array<{ label: string; value: number; up: string; down: string }> = [
    { label: 'палитра', value: s.compatibility, up: 'цвет в твоей палитре', down: 'цвет вне твоей палитры' },
    { label: 'гардероб', value: s.wardrobe, up: 'сочетается со многими вещами и закрывает пробел', down: 'мало с чем сочетается' },
    { label: 'кожа/волосы', value: s.beauty, up: 'состав подходит твоей коже/волосам', down: 'в составе есть нежелательное' },
    { label: 'бюджет', value: s.budget, up: 'легко вписывается в бюджет', down: 'заметная доля бюджета' },
    { label: 'образ жизни', value: s.lifestyle, up: 'под твои сценарии жизни', down: 'редко пригодится в твоём ритме' },
  ];
  const sorted = [...factors].sort((a, b) => b.value - a.value);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const verdict = s.finalScore >= 70 ? 'Сильная покупка' : s.finalScore >= 45 ? 'Спорная покупка' : 'Слабая покупка';
  const kind = c.itemType === 'clothing' ? 'эта вещь' : 'это средство';
  return (
    `${verdict} (${s.finalScore}/100). Главный плюс — ${best.up} (${best.label} ${best.value}). ` +
    `Слабое место — ${worst.down} (${worst.label} ${worst.value}). ` +
    `Итог: ${kind} ${s.finalScore >= 45 ? 'усилит твой образ' : 'даст мало пользы относительно цены'}.`
  );
}
