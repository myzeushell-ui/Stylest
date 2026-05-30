// ─────────────────────────────────────────────────────────────────────────
// Доменные типы «Образ». Зеркалят Prisma-схему (apps/api/prisma/schema.prisma).
// Используются и фронтом, и бэком — единый контракт данных.
// ─────────────────────────────────────────────────────────────────────────

import type {
  BodyType,
  ClothingSize,
  ColorType,
  GenderPresentation,
  HairType,
  ItemType,
  LifestyleTag,
  Season,
  SkinType,
  StyleGoal,
  WardrobeCategory,
} from './constants.js';

/** Базовые поля, которые есть у всех сущностей. */
export interface BaseEntity {
  id: string;
  userId: string;
  createdAt: string; // ISO-строка
  updatedAt: string;
}

// ── Профиль себя ──────────────────────────────────────────────────────────
export interface SelfProfile extends BaseEntity {
  displayName: string;
  colorType: ColorType;
  bodyType: BodyType;
  skinType: SkinType;
  hairType: HairType;
  /** Рост, см — для подсказок по посадке и пропорциям. */
  heightCm: number;
  /** Размер одежды (международный). */
  clothingSize: ClothingSize;
  /** Как подавать рекомендации (женственно/мужественно/нейтрально). */
  genderPresentation: GenderPresentation;
  /** Бюджет на покупки в месяц, ₽. Используется в budgetFitScore. */
  monthlyBudgetRub: number;
  styleGoals: StyleGoal[];
  lifestyleTags: LifestyleTag[];
}

// ── Гардероб ────────────────────────────────────────────────────────────
export interface WardrobeItem extends BaseEntity {
  title: string;
  category: WardrobeCategory;
  /** Основной цвет (название или hex). */
  color: string;
  seasons: Season[];
  /** URL фото (в Storage) или dataURL для локального режима. */
  photoUrl?: string;
  /** Цена покупки, ₽ — для расчёта cost-per-wear. */
  priceRub?: number;
  /** Сколько раз надето — двигает cost-per-wear вниз. */
  wearCount: number;
  /** Бренд (необязательно). */
  brand?: string;
}

export interface Outfit extends BaseEntity {
  title: string;
  itemIds: string[];
  occasion?: string;
  /** Лайк/дизлайк уточняют Style DNA со временем. */
  liked?: boolean;
}

// ── Бьюти ─────────────────────────────────────────────────────────────
export interface BeautyEntry extends BaseEntity {
  date: string; // ISO-дата
  photoUrl?: string;
  /** Самооценка состояния кожи 1..5. */
  skinScore: number;
  /** Самооценка состояния волос 1..5. */
  hairScore: number;
  notes?: string;
  /** Результат MockSkinAnalysisProvider (если запускался). */
  analysis?: SkinAnalysisResult;
}

export interface BeautyProduct extends BaseEntity {
  title: string;
  kind: 'уход за кожей' | 'уход за волосами' | 'макияж' | 'другое';
  brand?: string;
  /** Активные ингредиенты — для совпадения с recommendedIngredients. */
  ingredients: string[];
  openedAt?: string;
  finished?: boolean;
}

// ── Фитнес ────────────────────────────────────────────────────────────
export interface FitnessGoal extends BaseEntity {
  title: string;
  kind: 'похудение' | 'набор массы' | 'тонус' | 'выносливость' | 'осанка' | 'общее здоровье';
  targetDate?: string;
  done: boolean;
}

export interface ActivityLog extends BaseEntity {
  date: string;
  /** Тип активности: бег, силовая, йога и т.п. */
  activity: string;
  durationMin: number;
  /** Субъективная нагрузка 1..5. */
  intensity: number;
}

// ── Style DNA (поля строго по ТЗ) ──────────────────────────────────────
export interface StyleDNA extends BaseEntity {
  bestColors: string[];
  worstColors: string[];
  baseWardrobeColors: string[];
  accentColors: string[];
  bestSilhouettes: string[];
  worstSilhouettes: string[];
  styleGoals: StyleGoal[];
  lifestyleTags: LifestyleTag[];
  wardrobeStrengths: string[];
  wardrobeWeaknesses: string[];
  missingKeyItems: string[];
  highImpactPurchases: string[];
  lowValuePurchases: string[];
  styleSummary: string;
}

export interface BeautyDNA extends BaseEntity {
  skinType: SkinType;
  skinConcerns: string[];
  skinSensitivity: 'низкая' | 'средняя' | 'высокая';
  bestMakeupStyles: string[];
  worstMakeupStyles: string[];
  bestMakeupColors: string[];
  hairType: HairType;
  hairCondition: string;
  hairGoals: string[];
  beautyRoutineGoals: string[];
  recommendedIngredients: string[];
  ingredientsToAvoid: string[];
}

export interface BodyDNA extends BaseEntity {
  bodyType: BodyType;
  postureNotes: string;
  areasToHighlight: string[];
  areasToBalance: string[];
  bestFits: string[];
  worstFits: string[];
  fitnessGoals: string[];
  styleCorrectionTips: string[];
}

// ── PurchaseImpactScore ────────────────────────────────────────────────
export interface PurchaseImpactScore extends BaseEntity {
  itemType: ItemType;
  itemId: string;
  /** Все score в шкале 0..100. */
  compatibilityScore: number;
  wardrobeImpactScore: number;
  beautyCompatibilityScore: number;
  budgetFitScore: number;
  lifestyleFitScore: number;
  finalScore: number;
  aiExplanation: string;
}

// ── AI-чат ────────────────────────────────────────────────────────────
export interface ChatMessage extends BaseEntity {
  role: 'user' | 'assistant';
  content: string;
  /** Контекст модуля, из которого задан вопрос. */
  module?: 'wardrobe' | 'beauty' | 'fitness' | 'styledna';
}

// ── Результаты провайдеров (мок-контракты) ─────────────────────────────
export interface SkinAnalysisResult {
  skinType: SkinType;
  hydration: number; // 0..100
  oiliness: number; // 0..100
  concerns: string[];
  recommendedIngredients: string[];
  ingredientsToAvoid: string[];
  disclaimer: string;
  provider: string;
}

export interface TryOnResult {
  resultImageUrl: string;
  note: string;
  provider: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  priceRub: number;
  category: WardrobeCategory;
  color: string;
  brand?: string;
  url: string;
  source: 'wildberries' | 'ozon' | 'lamoda' | 'mock';
  imageUrl?: string;
}
