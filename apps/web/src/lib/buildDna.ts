// Сборка Style DNA / Beauty DNA / Body DNA из ЯВНЫХ источников (Фаза 6).
//
// Источники данных (каждое поле помечено в комментарии):
//   [О] — опросник-онбординг (профиль + StyleDNASetup)
//   [М] — данные из модулей (гардероб, фитнес)
//   [Ф] — AI-интерпретация фото (на старте МОК)
//   [С] — синтез/правила (теория цвета и фигуры, движок)
//
// Ничего не «выдумываем молча»: где данных нет — берём прозрачное правило по
// цветотипу/фигуре и помечаем это.

import type {
  SelfProfile,
  WardrobeItem,
  FitnessGoal,
  StyleDNA,
  BeautyDNA,
  BodyDNA,
  SkinAnalysisResult,
} from '@obraz/shared';
import { now, uid } from './uid';
import { LOCAL_USER_ID } from '../store/profile';
import { COLOR_PALETTE, BODY_FIT } from './colorTheory';
import { wardrobeGaps, lowValueItems, colorDistribution } from './analytics';

/** Доп. ответы опросника StyleDNASetup (то, чего нет в базовом профиле). */
export interface DnaQuestionnaire {
  skinConcerns: string[]; // [О]
  skinSensitivity: 'низкая' | 'средняя' | 'высокая'; // [О]
  hairCondition: string; // [О]
  hairGoals: string[]; // [О]
  beautyRoutineGoals: string[]; // [О]
  postureNotes: string; // [О]
}

/** Карта источника для каждого блока — показывается в UI для прозрачности. */
export const DNA_FIELD_SOURCES: Record<string, string> = {
  bestColors: 'Цветотип из профиля [О] + теория цвета [С]',
  worstColors: 'Цветотип из профиля [О] + теория цвета [С]',
  bestSilhouettes: 'Тип фигуры из профиля [О] + правила стилистики [С]',
  styleGoals: 'Онбординг: цели стиля [О]',
  lifestyleTags: 'Онбординг: образ жизни [О]',
  wardrobeStrengths: 'Аналитика гардероба [М]',
  wardrobeWeaknesses: 'Аналитика гардероба [М]',
  missingKeyItems: 'Пробелы гардероба [М]',
  highImpactPurchases: 'Движок рекомендаций [С] на основе пробелов [М]',
  lowValuePurchases: 'Cost-per-wear из гардероба [М]',
  styleSummary: 'AI-синтез по целям и цветотипу [С]',
  skinConcerns: 'Опросник [О] или анализ фото [Ф]',
  recommendedIngredients: 'Тип кожи [О] + правила ухода [С] (или фото [Ф])',
  fitnessGoals: 'Модуль Фитнес: цели [М]',
};

export function buildDna(args: {
  profile: SelfProfile;
  wardrobe: WardrobeItem[];
  fitnessGoals: FitnessGoal[];
  questionnaire: DnaQuestionnaire;
  photoAnalysis?: SkinAnalysisResult; // [Ф] мок, если запускали анализ кожи
}): { styleDNA: StyleDNA; beautyDNA: BeautyDNA; bodyDNA: BodyDNA } {
  const { profile, wardrobe, fitnessGoals, questionnaire: q, photoAnalysis } = args;
  const base = { id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() };

  const palette = COLOR_PALETTE[profile.colorType]; // [С] по цветотипу [О]
  const fit = BODY_FIT[profile.bodyType]; // [С] по типу фигуры [О]

  // --- Гардеробная аналитика [М] ---
  const gaps = wardrobeGaps(wardrobe);
  const lowValue = lowValueItems(wardrobe);
  const colors = colorDistribution(wardrobe);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (wardrobe.length >= 10) strengths.push(`Большой гардероб (${wardrobe.length} вещей)`);
  if (colors[0]) strengths.push(`Сильная база в цвете «${colors[0].color}»`);
  if (gaps.length) weaknesses.push(`Нет базовых категорий: ${gaps.join(', ')}`);
  if (lowValue.length) weaknesses.push(`${lowValue.length} вещей с высокой ценой за выход`);
  if (wardrobe.length < 5) weaknesses.push('Гардероб маленький — мало комбинаций');

  // --- Что докупить с максимальным эффектом [С на основе М] ---
  const highImpact = gaps.map((g) => `База в категории «${g}»`);
  if (highImpact.length === 0) highImpact.push('Один акцентный аксессуар под твою палитру');

  // --- Стиль в 3 словах [С] ---
  const goalWords = profile.styleGoals.slice(0, 2);
  const summaryWords = [...goalWords, profile.colorType !== 'не знаю' ? `${profile.colorType}-палитра` : 'нейтральная база'];
  const styleSummary = summaryWords.join(' · ');

  const styleDNA: StyleDNA = {
    ...base,
    bestColors: palette.best, // [О]+[С]
    worstColors: palette.worst, // [О]+[С]
    baseWardrobeColors: palette.base, // [О]+[С]
    accentColors: palette.accent, // [О]+[С]
    bestSilhouettes: fit.bestSilhouettes, // [О]+[С]
    worstSilhouettes: fit.worstSilhouettes, // [О]+[С]
    styleGoals: profile.styleGoals, // [О]
    lifestyleTags: profile.lifestyleTags, // [О]
    wardrobeStrengths: strengths, // [М]
    wardrobeWeaknesses: weaknesses, // [М]
    missingKeyItems: gaps, // [М]
    highImpactPurchases: highImpact, // [С]+[М]
    lowValuePurchases: lowValue.slice(0, 3).map((i) => i.title), // [М]
    styleSummary, // [С]
  };

  // --- Beauty DNA ---
  const skinConcerns = photoAnalysis?.concerns ?? q.skinConcerns; // [Ф] или [О]
  const recommended = photoAnalysis?.recommendedIngredients ?? defaultIngredients(profile.skinType).rec; // [Ф]/[С]
  const avoid = photoAnalysis?.ingredientsToAvoid ?? defaultIngredients(profile.skinType).avoid;

  const beautyDNA: BeautyDNA = {
    ...base,
    id: uid(),
    skinType: profile.skinType, // [О]
    skinConcerns, // [О]/[Ф]
    skinSensitivity: q.skinSensitivity, // [О]
    bestMakeupStyles: ['естественный «здоровый» макияж', 'мягкая дымка'], // [С]
    worstMakeupStyles: ['тяжёлый матовый тон', 'контрастные кричащие цвета'], // [С]
    bestMakeupColors: palette.makeupColors, // [О]+[С]
    hairType: profile.hairType, // [О]
    hairCondition: q.hairCondition || 'нормальное', // [О]
    hairGoals: q.hairGoals, // [О]
    beautyRoutineGoals: q.beautyRoutineGoals, // [О]
    recommendedIngredients: recommended, // [С]/[Ф]
    ingredientsToAvoid: avoid, // [С]/[Ф]
  };

  // --- Body DNA ---
  const bodyDNA: BodyDNA = {
    ...base,
    id: uid(),
    bodyType: profile.bodyType, // [О]
    postureNotes: q.postureNotes || 'без особенностей', // [О]
    areasToHighlight: fit.highlight, // [С]
    areasToBalance: fit.balance, // [С]
    bestFits: fit.bestFits, // [С]
    worstFits: fit.worstFits, // [С]
    fitnessGoals: fitnessGoals.map((g) => g.title), // [М]
    styleCorrectionTips: fit.tips, // [С]
  };

  return { styleDNA, beautyDNA, bodyDNA };
}

/** Базовые ингредиенты по типу кожи (когда нет анализа фото). [С] */
function defaultIngredients(skinType: SelfProfile['skinType']): { rec: string[]; avoid: string[] } {
  switch (skinType) {
    case 'сухая':
      return { rec: ['гиалуроновая кислота', 'церамиды', 'сквалан'], avoid: ['агрессивные спирты', 'жёсткие ПАВ'] };
    case 'жирная':
      return { rec: ['ниацинамид', 'салициловая кислота', 'цинк'], avoid: ['плотные масла', 'комедогенные текстуры'] };
    case 'чувствительная':
      return { rec: ['пантенол', 'центелла', 'мягкие увлажнители'], avoid: ['отдушки', 'высокие концентрации кислот'] };
    case 'комбинированная':
      return { rec: ['ниацинамид', 'лёгкие увлажнители', 'SPF 30+'], avoid: ['тяжёлые кремы на Т-зону'] };
    default:
      return { rec: ['увлажнение', 'SPF 30+', 'антиоксиданты'], avoid: ['пересушивание'] };
  }
}
