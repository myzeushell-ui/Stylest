import { Link } from 'react-router-dom';
import { useStyleDna } from '../store/styledna';
import { Card, PageHeader, EmptyState, SourceTag } from '../components/ui';
import { DNA_FIELD_SOURCES } from '../lib/buildDna';
import { t } from '../i18n';

export function BodyDnaScreen() {
  const bodyDNA = useStyleDna((s) => s.bodyDNA);

  if (!bodyDNA) {
    return (
      <div>
        <PageHeader title="Body DNA" back="/styledna" />
        <EmptyState text="Сначала собери карту." action={<Link to="/styledna/setup" className="btn-primary">{t.styledna.setup}</Link>} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Body DNA" subtitle="Фигура, посадки и что подчеркнуть." back="/styledna" />

      <Card className="mb-3">
        <div className="text-xs uppercase tracking-wide text-ink/50 mb-1">Тип фигуры</div>
        <div className="text-lg font-semibold">{bodyDNA.bodyType}</div>
        <div className="text-sm text-ink/60 mt-1">Осанка: {bodyDNA.postureNotes}</div>
      </Card>

      <Block title="Что подчеркнуть" items={bodyDNA.areasToHighlight} tone="good" />
      <Block title="Что сбалансировать" items={bodyDNA.areasToBalance} />
      <Block title="Лучшие посадки" items={bodyDNA.bestFits} tone="good" />
      <Block title="Менее удачные посадки" items={bodyDNA.worstFits} tone="bad" />
      <Block title="Цели по телу" items={bodyDNA.fitnessGoals} source={DNA_FIELD_SOURCES.fitnessGoals} />

      <Card className="mb-3 border-l-4 border-accent">
        <div className="text-xs uppercase tracking-wide text-ink/50 mb-1">Советы по коррекции образа</div>
        <ul className="text-sm list-disc pl-4 space-y-1">
          {bodyDNA.styleCorrectionTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>
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
