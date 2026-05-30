// ─────────────────────────────────────────────────────────────────────────
// Общие константы домена «Образ».
// Здесь живут перечисления (enum-подобные массивы), которые используются и на
// фронте (для выпадашек/чипсов), и на бэке (для валидации). Один источник правды.
// ─────────────────────────────────────────────────────────────────────────

/** Цели стиля — мультивыбор в онбординге Style DNA. */
export const STYLE_GOALS = [
  'дороже',
  'сексуальнее',
  'спортивнее',
  'взрослее',
  'мягче',
  'увереннее',
  'креативнее',
  'минималистичнее',
  'статуснее',
  'аккуратнее',
  'женственнее',
  'мужественнее',
  'более fashion',
  'естественнее',
] as const;
export type StyleGoal = (typeof STYLE_GOALS)[number];

/** Lifestyle-теги — где и как человек проводит время (влияет на рекомендации). */
export const LIFESTYLE_TAGS = [
  'работа',
  'учёба',
  'свидания',
  'спортзал',
  'прогулки',
  'мероприятия',
  'путешествия',
  'повседневность',
  'деловые встречи',
  'фотосессии',
] as const;
export type LifestyleTag = (typeof LIFESTYLE_TAGS)[number];

/** Категории вещей гардероба. */
export const WARDROBE_CATEGORIES = [
  'верх',
  'низ',
  'платье',
  'верхняя одежда',
  'обувь',
  'аксессуар',
  'сумка',
  'бельё/база',
] as const;
export type WardrobeCategory = (typeof WARDROBE_CATEGORIES)[number];

/** Сезоны. */
export const SEASONS = ['зима', 'весна', 'лето', 'осень', 'всесезон'] as const;
export type Season = (typeof SEASONS)[number];

/** Типы товаров для PurchaseImpactScore. */
export const ITEM_TYPES = ['clothing', 'beauty', 'hair', 'fitness'] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

/** Цветотипы (упрощённая сезонная теория). */
export const COLOR_TYPES = ['весна', 'лето', 'осень', 'зима', 'не знаю'] as const;
export type ColorType = (typeof COLOR_TYPES)[number];

/** Типы фигуры. */
export const BODY_TYPES = [
  'песочные часы',
  'треугольник',
  'перевёрнутый треугольник',
  'прямоугольник',
  'круг',
  'не знаю',
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

/** Типы кожи. */
export const SKIN_TYPES = ['сухая', 'жирная', 'комбинированная', 'нормальная', 'чувствительная'] as const;
export type SkinType = (typeof SKIN_TYPES)[number];

/** Типы волос. */
export const HAIR_TYPES = ['прямые', 'волнистые', 'кудрявые', 'афро'] as const;
export type HairType = (typeof HAIR_TYPES)[number];

/** Размеры одежды (международные). */
export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type ClothingSize = (typeof CLOTHING_SIZES)[number];

/** Пол/гендерное предпочтение в подаче рекомендаций. */
export const GENDER_PRESENTATIONS = ['женственная', 'мужественная', 'нейтральная'] as const;
export type GenderPresentation = (typeof GENDER_PRESENTATIONS)[number];

/** Готовые вопросы-кнопки для AI-чата (фаза Style DNA). */
export const AI_SUGGESTED_QUESTIONS = [
  'Что докупить, чтобы выглядеть дороже?',
  'Какие вещи в гардеробе бесполезны?',
  'Какие цвета мне подходят?',
  'Какие силуэты лучше носить?',
  'Какой макияж под мой стиль?',
  'Какая причёска усилит образ?',
  'Что купить на 5000 ₽, чтобы улучшить максимум образов?',
  'Какие 5 покупок дадут самый большой эффект?',
  'Почему этот образ мне подходит?',
  'Что во мне подчеркнуть?',
] as const;

/** Дисклеймер для немедицинских разделов (бьюти/тело). Показывать везде. */
export const NON_MEDICAL_DISCLAIMER =
  'Это не медицинская диагностика и не замена консультации врача. ' +
  'При серьёзных или длительных проблемах с кожей, волосами или здоровьем обратитесь к специалисту.';
