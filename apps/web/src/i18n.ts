// Тонкая обёртка над словарём из @obraz/shared. Структура заложена под i18n:
// сейчас один язык (ru), но добавление локали = новый словарь + переключатель.
import { ru, type Dictionary } from '@obraz/shared';

export const t: Dictionary = ru;
