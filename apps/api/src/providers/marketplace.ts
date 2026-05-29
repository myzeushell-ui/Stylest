// MarketplaceProvider — товары и ссылки (Wildberries / Ozon / Lamoda).
// На старте мок-каталог. ДОПУЩЕНИЕ: реальные API подключаются позже; URL ниже —
// это домены маркетплейсов с поисковым запросом, не выдуманные товарные эндпоинты.

import type { MarketplaceItem, WardrobeCategory } from '@obraz/shared';

export interface MarketplaceProvider {
  readonly name: string;
  search(input: { query: string; category?: WardrobeCategory; maxPriceRub?: number }): Promise<MarketplaceItem[]>;
}

// Небольшой мок-каталог базовых вещей (то, что чаще всего «докупить первым»).
const MOCK_CATALOG: MarketplaceItem[] = [
  { id: 'm1', title: 'Кожаные ботинки челси, чёрные', priceRub: 6990, category: 'обувь', color: 'чёрный', brand: 'BaseLine', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=ботинки+челси', source: 'mock' },
  { id: 'm2', title: 'Пальто-халат, бежевое', priceRub: 8990, category: 'верхняя одежда', color: 'бежевый', brand: 'BaseLine', url: 'https://www.ozon.ru/search/?text=пальто+халат', source: 'mock' },
  { id: 'm3', title: 'Брюки прямого кроя, серые', priceRub: 3490, category: 'низ', color: 'серый', brand: 'BaseLine', url: 'https://www.lamoda.ru/c/355/clothes-shtany/?q=брюки+прямые', source: 'mock' },
  { id: 'm4', title: 'Рубашка оверсайз, белая', priceRub: 2490, category: 'верх', color: 'белый', brand: 'BaseLine', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=рубашка+белая', source: 'mock' },
  { id: 'm5', title: 'Сумка-тоут, чёрная', priceRub: 4290, category: 'сумка', color: 'чёрный', brand: 'BaseLine', url: 'https://www.ozon.ru/search/?text=сумка+тоут', source: 'mock' },
  { id: 'm6', title: 'Ремень кожаный, коричневый', priceRub: 1290, category: 'аксессуар', color: 'коричневый', brand: 'BaseLine', url: 'https://www.lamoda.ru/c/2580/accessories-remni/?q=ремень', source: 'mock' },
];

export class MockMarketplaceProvider implements MarketplaceProvider {
  readonly name = 'mock';

  async search(input: { query: string; category?: WardrobeCategory; maxPriceRub?: number }): Promise<MarketplaceItem[]> {
    const q = input.query.trim().toLowerCase();
    return MOCK_CATALOG.filter((item) => {
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.category.includes(q);
      const matchCat = !input.category || item.category === input.category;
      const matchPrice = !input.maxPriceRub || item.priceRub <= input.maxPriceRub;
      return matchQuery && matchCat && matchPrice;
    });
  }
}

// TODO(v2): export class WildberriesMarketplaceProvider implements MarketplaceProvider {
//   Реальный поиск через официальный API. Ключи/токены — только из env на сервере.
// }
