import { Link } from 'react-router-dom';
import { useStyleDna } from '../store/styledna';
import { useWardrobe } from '../store/wardrobe';
import { lowValueItems, costPerWear } from '../lib/analytics';
import { Card, PageHeader, Section, EmptyState } from '../components/ui';
import { t } from '../i18n';

export function StyleDnaInsightsScreen() {
  const styleDNA = useStyleDna((s) => s.styleDNA);
  const items = useWardrobe((s) => s.items);

  if (!styleDNA) {
    return (
      <div>
        <PageHeader title={t.styledna.insights} back="/styledna" />
        <EmptyState text="Сначала собери карту." action={<Link to="/styledna/setup" className="btn-primary">{t.styledna.setup}</Link>} />
      </div>
    );
  }

  const lowValue = lowValueItems(items);

  return (
    <div>
      <PageHeader title={t.styledna.insights} subtitle="Что работает и что тянет вниз." back="/styledna" />

      <Section title={t.styledna.boosters}>
        {styleDNA.wardrobeStrengths.length === 0 ? (
          <Card className="text-ink/50">Пока недостаточно данных. Добавь вещи в гардероб.</Card>
        ) : (
          <div className="space-y-2">
            {styleDNA.wardrobeStrengths.map((s) => (
              <Card key={s} className="border-l-4 border-emerald-400">{s}</Card>
            ))}
          </div>
        )}
      </Section>

      <Section title={t.styledna.killers}>
        <div className="space-y-2">
          {styleDNA.wardrobeWeaknesses.map((w) => (
            <Card key={w} className="border-l-4 border-rose-400">{w}</Card>
          ))}
          {styleDNA.wardrobeWeaknesses.length === 0 && <Card className="text-emerald-600">Явных слабых мест нет 👍</Card>}
        </div>
      </Section>

      <Section title="Бесполезные вещи (высокая цена за выход)">
        {lowValue.length === 0 ? (
          <Card className="text-emerald-600">Нет таких вещей 👍</Card>
        ) : (
          <div className="space-y-2">
            {lowValue.slice(0, 5).map((i) => (
              <Card key={i.id} className="flex justify-between">
                <span>{i.title}</span>
                <span className="text-rose-600 font-semibold">{costPerWear(i)} ₽/выход</span>
              </Card>
            ))}
          </div>
        )}
        <p className="text-[11px] text-ink/40 mt-2">Почему: если вещь редко надевается, каждый выход «стоит» дорого — она не окупается.</p>
      </Section>
    </div>
  );
}
