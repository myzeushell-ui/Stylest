import { Link } from 'react-router-dom';
import { useStyleDna } from '../store/styledna';
import { Card, PageHeader, EmptyState, Disclaimer, SourceTag } from '../components/ui';
import { DNA_FIELD_SOURCES } from '../lib/buildDna';
import { t } from '../i18n';

export function BeautyDnaScreen() {
  const beautyDNA = useStyleDna((s) => s.beautyDNA);

  if (!beautyDNA) {
    return (
      <div>
        <PageHeader title="Beauty DNA" back="/styledna" />
        <EmptyState text="Сначала собери карту." action={<Link to="/styledna/setup" className="btn-primary">{t.styledna.setup}</Link>} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Beauty DNA" subtitle="Кожа, волосы и макияж под тебя." back="/styledna" />

      <Block title="Тип и чувствительность кожи" items={[`${beautyDNA.skinType}`, `чувствительность: ${beautyDNA.skinSensitivity}`]} />
      <Block title="Что беспокоит" items={beautyDNA.skinConcerns} source={DNA_FIELD_SOURCES.skinConcerns} />
      <Block title="Подходящие ингредиенты" items={beautyDNA.recommendedIngredients} tone="good" source={DNA_FIELD_SOURCES.recommendedIngredients} />
      <Block title="Избегать в составе" items={beautyDNA.ingredientsToAvoid} tone="bad" />
      <Block title="Лучшие стили макияжа" items={beautyDNA.bestMakeupStyles} tone="good" />
      <Block title="Лучшие цвета макияжа" items={beautyDNA.bestMakeupColors} tone="good" />
      <Block title="Что не идёт в макияже" items={beautyDNA.worstMakeupStyles} tone="bad" />
      <Block title="Волосы" items={[`тип: ${beautyDNA.hairType}`, `состояние: ${beautyDNA.hairCondition}`, ...beautyDNA.hairGoals]} />
      <Block title="Цели ухода" items={beautyDNA.beautyRoutineGoals} />

      <Disclaimer />
    </div>
  );
}

function Block({ title, items, tone = 'neutral', source }: { title: string; items: string[]; tone?: 'good' | 'bad' | 'neutral'; source?: string }) {
  if (items.length === 0) return null;
  const cls = tone === 'good' ? 'border-emerald-300 text-emerald-700' : tone === 'bad' ? 'border-rose-300 text-rose-600' : 'border-black/10 text-ink/70';
  return (
    <Card className="mb-3">
      <div className="text-xs uppercase tracking-wide text-ink/50 mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className={`chip bg-white ${cls}`}>{i}</span>
        ))}
      </div>
      <SourceTag source={source} />
    </Card>
  );
}
