// Набор маленьких переиспользуемых UI-компонентов.
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { NON_MEDICAL_DISCLAIMER } from '@obraz/shared';

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: string }) {
  return (
    <header className="mb-4">
      {back && (
        <Link to={back} className="text-sm text-ink/50 mb-1 inline-block">
          ← Назад
        </Link>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}
    </header>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <Card className="text-center text-ink/50 py-8">
      <p>{text}</p>
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}

/** Мультивыбор чипсов. */
export function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={selected.includes(opt) ? 'chip-on' : 'chip-off'}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/** Визуализация score 0..100 с подписью. */
export function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 45 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-ink/60">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-black/10 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/** Дисклеймер для немедицинских разделов. */
export function Disclaimer({ text = NON_MEDICAL_DISCLAIMER }: { text?: string }) {
  return (
    <p className="text-[11px] leading-snug text-ink/50 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
      ⚠️ {text}
    </p>
  );
}

/** Подпись источника данных (прозрачность Style DNA). */
export function SourceTag({ source }: { source?: string }) {
  if (!source) return null;
  return <p className="text-[11px] text-ink/40 mt-1">Источник: {source}</p>;
}
