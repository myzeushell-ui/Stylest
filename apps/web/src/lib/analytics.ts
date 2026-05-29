// Аналитика гардероба: cost-per-wear и пробелы. Чистые функции — легко тестить.
import { WARDROBE_CATEGORIES, type WardrobeCategory, type WardrobeItem } from '@obraz/shared';

/** Цена за один выход. Если цена не задана — null (не считаем). */
export function costPerWear(item: WardrobeItem): number | null {
  if (item.priceRub == null) return null;
  return Math.round(item.priceRub / Math.max(1, item.wearCount));
}

/** Категории, которых мало или нет — это «пробелы» гардероба. */
export function wardrobeGaps(items: WardrobeItem[]): WardrobeCategory[] {
  const counts = new Map<WardrobeCategory, number>();
  for (const cat of WARDROBE_CATEGORIES) counts.set(cat, 0);
  for (const it of items) counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
  // Базовые категории, без которых трудно собрать образ.
  const essentials: WardrobeCategory[] = ['верх', 'низ', 'обувь', 'верхняя одежда'];
  return essentials.filter((c) => (counts.get(c) ?? 0) === 0);
}

/** Самые «дорогие в эксплуатации» вещи — кандидаты в бесполезные. */
export function lowValueItems(items: WardrobeItem[], threshold = 2000): WardrobeItem[] {
  return items
    .filter((i) => {
      const cpw = costPerWear(i);
      return cpw != null && cpw >= threshold;
    })
    .sort((a, b) => (costPerWear(b) ?? 0) - (costPerWear(a) ?? 0));
}

/** Распределение по цветам — для понимания базы/акцентов. */
export function colorDistribution(items: WardrobeItem[]): Array<{ color: string; count: number }> {
  const map = new Map<string, number>();
  for (const i of items) map.set(i.color, (map.get(i.color) ?? 0) + 1);
  return [...map.entries()].map(([color, count]) => ({ color, count })).sort((a, b) => b.count - a.count);
}
