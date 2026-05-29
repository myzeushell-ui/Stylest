// TryOnProvider — виртуальная примерка одежды. На старте мок.
// ДОПУЩЕНИЕ: реальный вендор (Aiuta / FASHN) подключается позже.

import type { TryOnResult } from '@obraz/shared';

export interface TryOnProvider {
  readonly name: string;
  tryOn(input: { personPhotoUrl?: string; itemPhotoUrl?: string; itemTitle: string }): Promise<TryOnResult>;
}

export class MockTryOnProvider implements TryOnProvider {
  readonly name = 'mock';

  async tryOn(input: { personPhotoUrl?: string; itemPhotoUrl?: string; itemTitle: string }): Promise<TryOnResult> {
    // Возвращаем заглушку-«превью». Реальная картинка появится с живым вендором.
    return {
      resultImageUrl: input.itemPhotoUrl ?? input.personPhotoUrl ?? '',
      note: `Демо-примерка вещи «${input.itemTitle}». Реальная виртуальная примерка появится в v2.`,
      provider: this.name,
    };
  }
}

// TODO(v2): export class FashnTryOnProvider / AiutaTryOnProvider implements TryOnProvider {
//   Реальная интеграция. Ключ — только из env на сервере.
// }
