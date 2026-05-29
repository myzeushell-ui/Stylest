import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStyleDna } from '../store/styledna';
import { useWardrobe } from '../store/wardrobe';
import { wardrobeGaps } from '../lib/analytics';
import { api } from '../lib/api';
import { Card, PageHeader, EmptyState, Section } from '../components/ui';
import { t } from '../i18n';

// Чего не хватает: пробелы гардероба + мок-предложения, чем закрыть.
export function MissingItemsScreen() {
  const styleDNA = useStyleDna((s) => s.styleDNA);
  const items = useWardrobe((s) => s.items);
  const gaps = styleDNA?.missingKeyItems ?? wardrobeGaps(items);

  const { data } = useQuery({
    queryKey: ['marketplace', 'missing'],
    queryFn: () => api.marketplaceSearch(''),
  });

  return (
    <div>
      <PageHeader title={t.styledna.missingItems} subtitle="Базовые категории, без которых трудно собирать образы." back="/styledna" />

      {gaps.length === 0 ? (
        <EmptyState text="Базовые категории закрыты 👍 Добавляй акценты под палитру." />
      ) : (
        gaps.map((gap) => {
          const suggestions = (data?.items ?? []).filter((i) => i.category === gap);
          return (
            <Section key={gap} title={`Пробел: ${gap}`}>
              <p className="text-sm text-ink/60 mb-2">
                Почему важно: эта категория входит во многие образы, поэтому её отсутствие ограничивает весь гардероб.
              </p>
              {suggestions.length === 0 ? (
                <Card className="text-ink/50 text-sm">Подберём в каталоге позже.</Card>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <Card key={s.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-ink/50">{s.priceRub.toLocaleString('ru-RU')} ₽</div>
                      </div>
                      <a href={s.url} target="_blank" rel="noreferrer" className="btn-ghost text-xs">
                        В магазин
                      </a>
                    </Card>
                  ))}
                </div>
              )}
            </Section>
          );
        })
      )}

      <Link to="/styledna/high-impact" className="btn-primary w-full text-center mt-2">
        Что даст максимум эффекта →
      </Link>
    </div>
  );
}
