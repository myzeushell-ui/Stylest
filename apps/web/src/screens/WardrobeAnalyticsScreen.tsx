import { useWardrobe } from '../store/wardrobe';
import { costPerWear, wardrobeGaps, lowValueItems, colorDistribution } from '../lib/analytics';
import { Card, PageHeader, Section, EmptyState } from '../components/ui';

export function WardrobeAnalyticsScreen() {
  const items = useWardrobe((s) => s.items);
  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Аналитика гардероба" back="/wardrobe" />
        <EmptyState text="Добавь вещи, чтобы увидеть аналитику." />
      </div>
    );
  }

  const gaps = wardrobeGaps(items);
  const lowValue = lowValueItems(items);
  const colors = colorDistribution(items);
  const withCpw = items.filter((i) => costPerWear(i) != null);
  const avgCpw =
    withCpw.length > 0 ? Math.round(withCpw.reduce((a, i) => a + (costPerWear(i) ?? 0), 0) / withCpw.length) : null;

  return (
    <div>
      <PageHeader title="Аналитика гардероба" subtitle="Где деньги работают, а где простаивают." back="/wardrobe" />

      <Section title="Сводка">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Всего вещей" value={String(items.length)} />
          <Stat label="Средняя цена за выход" value={avgCpw != null ? `${avgCpw} ₽` : '—'} />
        </div>
      </Section>

      <Section title="Пробелы (что мешает собирать образы)">
        {gaps.length === 0 ? (
          <Card className="text-emerald-600">Базовые категории закрыты 👍</Card>
        ) : (
          <Card>
            <p className="text-sm mb-2">Не хватает базовых категорий:</p>
            <div className="flex flex-wrap gap-2">
              {gaps.map((g) => (
                <span key={g} className="chip-off border-rose-300 text-rose-600">
                  {g}
                </span>
              ))}
            </div>
          </Card>
        )}
      </Section>

      <Section title="Кандидаты в «бесполезные» (высокая цена за выход)">
        {lowValue.length === 0 ? (
          <Card className="text-emerald-600">Нет вещей с высокой ценой за выход 👍</Card>
        ) : (
          <div className="space-y-2">
            {lowValue.slice(0, 5).map((i) => (
              <Card key={i.id} className="flex justify-between">
                <span>{i.title}</span>
                <span className="font-semibold text-rose-600">{costPerWear(i)} ₽/выход</span>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Палитра гардероба">
        <Card>
          <div className="space-y-1">
            {colors.slice(0, 6).map((c) => (
              <div key={c.color} className="flex items-center gap-2 text-sm">
                <span className="w-24 text-ink/60 truncate">{c.color}</span>
                <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-ink" style={{ width: `${(c.count / items.length) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-ink/60">{c.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-ink/50">{label}</div>
    </Card>
  );
}
