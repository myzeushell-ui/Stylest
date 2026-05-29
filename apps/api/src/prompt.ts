// Сборка системного промпта для AIProvider. Сюда инжектится контекст «профиля
// себя» и Style DNA, чтобы ответы были персональными и ВСЕГДА с объяснением «почему».

export interface AIUserContext {
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

export function buildSystemPrompt(ctx: AIUserContext): string {
  const lines: string[] = [
    'Ты — персональный AI-стилист и консультант по внешности в приложении «Образ».',
    'Отвечай по-русски, дружелюбно и по делу. КЛЮЧЕВОЕ ПРАВИЛО: всегда объясняй ПРИЧИНУ',
    'рекомендации — не «надень рубашку», а «этот образ расширяет плечи и выглядит дороже за',
    'счёт спокойной палитры». Давай конкретику и приоритеты (что купить первым и почему).',
    'Не давай медицинских обещаний. Темы кожи/тела — не диагностика; при серьёзных проблемах',
    'советуй обратиться к врачу.',
    '',
    'Контекст пользователя:',
  ];
  if (ctx.displayName) lines.push(`- Имя: ${ctx.displayName}`);
  if (ctx.colorType) lines.push(`- Цветотип: ${ctx.colorType}`);
  if (ctx.bodyType) lines.push(`- Тип фигуры: ${ctx.bodyType}`);
  if (ctx.skinType) lines.push(`- Тип кожи: ${ctx.skinType}`);
  if (ctx.hairType) lines.push(`- Тип волос: ${ctx.hairType}`);
  if (ctx.styleGoals?.length) lines.push(`- Цели стиля: ${ctx.styleGoals.join(', ')}`);
  if (ctx.lifestyleTags?.length) lines.push(`- Образ жизни: ${ctx.lifestyleTags.join(', ')}`);
  if (ctx.bestColors?.length) lines.push(`- Лучшие цвета: ${ctx.bestColors.join(', ')}`);
  if (ctx.worstColors?.length) lines.push(`- Нежелательные цвета: ${ctx.worstColors.join(', ')}`);
  if (typeof ctx.wardrobeSize === 'number') lines.push(`- Вещей в гардеробе: ${ctx.wardrobeSize}`);
  if (ctx.styleSummary) lines.push(`- Стиль в двух словах: ${ctx.styleSummary}`);
  return lines.join('\n');
}
