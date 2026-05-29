// SkinAnalysisProvider — анализ кожи/волос. На старте всегда мок.
// ДОПУЩЕНИЕ: реальный вендор (напр. Perfect Corp) подключается позже; пока
// возвращаем правдоподобный JSON. НЕ медицинская диагностика.

import { NON_MEDICAL_DISCLAIMER, type SkinAnalysisResult, type SkinType } from '@obraz/shared';

export interface SkinAnalysisProvider {
  readonly name: string;
  /** На вход — фото (dataURL/URL) и опционально известный тип кожи. */
  analyze(input: { photoUrl?: string; knownSkinType?: SkinType }): Promise<SkinAnalysisResult>;
}

export class MockSkinAnalysisProvider implements SkinAnalysisProvider {
  readonly name = 'mock';

  async analyze(input: { photoUrl?: string; knownSkinType?: SkinType }): Promise<SkinAnalysisResult> {
    const skinType: SkinType = input.knownSkinType ?? 'комбинированная';
    // Детерминированный, но «живой» мок.
    return {
      skinType,
      hydration: 62,
      oiliness: skinType === 'жирная' ? 74 : 41,
      concerns: ['неравномерный тон', 'расширенные поры в Т-зоне'],
      recommendedIngredients: ['ниацинамид', 'гиалуроновая кислота', 'SPF 30+'],
      ingredientsToAvoid: ['агрессивные спирты', 'высокие концентрации кислот без подготовки'],
      disclaimer: NON_MEDICAL_DISCLAIMER,
      provider: this.name,
    };
  }
}

// TODO(v2): export class PerfectCorpSkinProvider implements SkinAnalysisProvider {
//   Реальная интеграция с вендором. Ключ — только из env на сервере.
//   НЕ обращаться к выдуманным URL — взять из официальной документации вендора.
// }
