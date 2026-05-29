import { Link } from 'react-router-dom';
import { useStyleDna } from '../store/styledna';
import { Card, PageHeader, EmptyState } from '../components/ui';
import { t } from '../i18n';

// Хаб Style DNA: точка входа в killer-фичу.
export function StyleDnaHubScreen() {
  const styleDNA = useStyleDna((s) => s.styleDNA);

  if (!styleDNA) {
    return (
      <div>
        <PageHeader title={t.styledna.title} subtitle="Персональная карта внешности, которая объясняет все рекомендации." />
        <EmptyState
          text="Карта ещё не собрана. Пройди короткий опросник — мы соединим профиль, гардероб и цели."
          action={
            <Link to="/styledna/setup" className="btn-primary">
              {t.styledna.setup}
            </Link>
          }
        />
      </div>
    );
  }

  const links = [
    { to: '/styledna/results', icon: '🧬', title: t.styledna.results, desc: 'Цвета, силуэты, цели, вывод' },
    { to: '/styledna/insights', icon: '💡', title: t.styledna.insights, desc: 'Сильные и слабые места' },
    { to: '/styledna/missing', icon: '🧩', title: t.styledna.missingItems, desc: 'Чего не хватает гардеробу' },
    { to: '/styledna/high-impact', icon: '🚀', title: t.styledna.highImpact, desc: 'Покупки с максимальным эффектом' },
    { to: '/styledna/beauty', icon: '✨', title: 'Beauty DNA', desc: 'Кожа, волосы, макияж' },
    { to: '/styledna/body', icon: '🪞', title: 'Body DNA', desc: 'Фигура, посадки, акценты' },
  ];

  return (
    <div>
      <PageHeader title={t.styledna.title} subtitle={styleDNA.styleSummary} />
      <div className="flex justify-end mb-3">
        <Link to="/styledna/setup" className="text-sm text-ink/50 underline">
          Пересобрать
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            <Card className="h-full">
              <div className="text-2xl mb-1">{l.icon}</div>
              <div className="font-semibold">{l.title}</div>
              <div className="text-xs text-ink/50">{l.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
