import { Link } from 'react-router-dom';
import { useStyleDna } from '../store/styledna';
import { DNA_FIELD_SOURCES } from '../lib/buildDna';
import { Card, PageHeader, EmptyState, SourceTag } from '../components/ui';
import { t } from '../i18n';

// Карта Style DNA: блоки строго по ТЗ, у каждого — источник данных.
export function StyleDnaResultsScreen() {
  const { styleDNA, like, dislike, feedback } = useStyleDna();

  if (!styleDNA) {
    return (
      <div>
        <PageHeader title={t.styledna.results} back="/styledna" />
        <EmptyState text="Сначала собери карту." action={<Link to="/styledna/setup" className="btn-primary">{t.styledna.setup}</Link>} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.styledna.results} subtitle="Твоя персональная карта внешности." back="/styledna" />

      <Card className="mb-4 bg-ink text-white">
        <div className="text-xs uppercase tracking-wide text-white/50 mb-1">{t.styledna.threeWords}</div>
        <div className="text-xl font-bold">{styleDNA.styleSummary}</div>
      </Card>

      <ChipBlock title={t.styledna.bestColors} items={styleDNA.bestColors} source={DNA_FIELD_SOURCES.bestColors} tone="good" onLike={like} onDislike={dislike} feedback={feedback} />
      <ChipBlock title={t.styledna.bestSilhouettes} items={styleDNA.bestSilhouettes} source={DNA_FIELD_SOURCES.bestSilhouettes} tone="good" onLike={like} onDislike={dislike} feedback={feedback} />
      <ChipBlock title={t.styledna.goals} items={styleDNA.styleGoals} source={DNA_FIELD_SOURCES.styleGoals} tone="neutral" />
      <ChipBlock title={t.styledna.boosters} items={styleDNA.wardrobeStrengths} source={DNA_FIELD_SOURCES.wardrobeStrengths} tone="good" />
      <ChipBlock title={t.styledna.killers} items={[...styleDNA.worstColors, ...styleDNA.wardrobeWeaknesses]} source="Худшие цвета [С] + слабые места гардероба [М]" tone="bad" />
      <ChipBlock title={t.styledna.buyFirst} items={styleDNA.highImpactPurchases} source={DNA_FIELD_SOURCES.highImpactPurchases} tone="neutral" />

      <Card className="mb-4">
        <div className="text-xs uppercase tracking-wide text-ink/50 mb-1">{t.styledna.aiVerdict}</div>
        <p className="text-sm">
          Твой стиль строится вокруг «{styleDNA.styleSummary}». База — {styleDNA.baseWardrobeColors.join(', ')}; акценты — {styleDNA.accentColors.join(', ')}.
          {styleDNA.missingKeyItems.length > 0
            ? ` Самый быстрый апгрейд — закрыть пробелы: ${styleDNA.missingKeyItems.join(', ')}.`
            : ' База закрыта — добавляй акценты под палитру.'}
        </p>
        <SourceTag source={DNA_FIELD_SOURCES.styleSummary} />
      </Card>

      <div className="flex gap-2">
        <Link to="/styledna/insights" className="btn-ghost flex-1 text-center">{t.styledna.insights}</Link>
        <Link to="/styledna/high-impact" className="btn-primary flex-1 text-center">{t.styledna.highImpact}</Link>
      </div>
    </div>
  );
}

function ChipBlock({
  title,
  items,
  source,
  tone,
  onLike,
  onDislike,
  feedback,
}: {
  title: string;
  items: string[];
  source?: string;
  tone: 'good' | 'bad' | 'neutral';
  onLike?: (k: string) => void;
  onDislike?: (k: string) => void;
  feedback?: { liked: string[]; disliked: string[] };
}) {
  if (items.length === 0) return null;
  const cls = tone === 'good' ? 'border-emerald-300 text-emerald-700' : tone === 'bad' ? 'border-rose-300 text-rose-600' : 'border-black/10 text-ink/70';
  return (
    <Card className="mb-4">
      <div className="text-xs uppercase tracking-wide text-ink/50 mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const liked = feedback?.liked.includes(it);
          const disliked = feedback?.disliked.includes(it);
          return (
            <span key={it} className={`chip bg-white ${cls} ${disliked ? 'opacity-40 line-through' : ''}`}>
              {it}
              {onLike && (
                <span className="ml-1 flex gap-1">
                  <button onClick={() => onLike(it)} className={liked ? 'text-emerald-600' : 'text-ink/30'}>▲</button>
                  <button onClick={() => onDislike?.(it)} className={disliked ? 'text-rose-600' : 'text-ink/30'}>▼</button>
                </span>
              )}
            </span>
          );
        })}
      </div>
      <SourceTag source={source} />
    </Card>
  );
}
