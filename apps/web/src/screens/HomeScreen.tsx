import { Link } from 'react-router-dom';
import { useProfile } from '../store/profile';
import { useWardrobe } from '../store/wardrobe';
import { useBeauty } from '../store/beauty';
import { useFitness } from '../store/fitness';
import { useStyleDna } from '../store/styledna';
import { Section } from '../components/ui';
import { t } from '../i18n';

export function HomeScreen() {
  const { profile } = useProfile();
  const wardrobe = useWardrobe((s) => s.items);
  const beauty = useBeauty((s) => s.entries);
  const goals = useFitness((s) => s.goals);
  const styleDNA = useStyleDna((s) => s.styleDNA);

  const hello = profile.displayName ? `Привет, ${profile.displayName}!` : 'Привет!';

  return (
    <div>
      {/* Премиальный герой-блок */}
      <div className="rounded-3xl bg-gradient-to-br from-ink to-[#243044] text-white p-6 mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />
        <p className="text-white/50 text-sm">{t.app.tagline}</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{hello}</h1>

        {styleDNA ? (
          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wider text-white/40">{t.styledna.threeWords}</div>
            <div className="text-xl font-semibold mt-0.5">{styleDNA.styleSummary}</div>
            <Link to="/styledna" className="inline-flex items-center gap-1 text-accent text-sm mt-2">
              Открыть Style DNA →
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-white/70 text-sm mb-3">Собери карту внешности — и я объясню, что тебе идёт и почему.</p>
            <Link to="/styledna/setup" className="btn-accent">Собрать Style DNA ✨</Link>
          </div>
        )}
      </div>

      <Section title="Модули">
        <div className="grid grid-cols-2 gap-3">
          <Tile to="/wardrobe" icon="👕" title={t.nav.wardrobe} value={`${wardrobe.length} вещей`} accent="from-sky-100" />
          <Tile to="/beauty" icon="✨" title={t.nav.beauty} value={`${beauty.length} записей`} accent="from-pink-100" />
          <Tile to="/fitness" icon="🏃" title={t.nav.fitness} value={`${goals.length} целей`} accent="from-emerald-100" />
          <Tile to="/styledna" icon="🧬" title={t.nav.styledna} value={styleDNA ? 'готова' : 'собрать'} accent="from-violet-100" />
        </div>
      </Section>

      <Section title="Быстрые действия">
        <div className="grid grid-cols-1 gap-3">
          <Link to="/wardrobe" className="card flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-accent/20 text-xl">📷</span>
            <div className="flex-1">
              <div className="font-semibold">Сфотографировать вещь</div>
              <div className="text-xs text-ink/50">Добавь одежду в цифровой шкаф</div>
            </div>
            <span className="text-ink/30">→</span>
          </Link>
          <Link to="/chat" className="card flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-ink text-accent text-xl">🎤</span>
            <div className="flex-1">
              <div className="font-semibold">Спросить стилиста голосом</div>
              <div className="text-xs text-ink/50">Говори — он ответит голосом</div>
            </div>
            <span className="text-ink/30">→</span>
          </Link>
        </div>
      </Section>
    </div>
  );
}

function Tile({ to, icon, title, value, accent }: { to: string; icon: string; title: string; value: string; accent: string }) {
  return (
    <Link to={to}>
      <div className={`card h-full bg-gradient-to-br ${accent} to-white`}>
        <div className="text-2xl mb-2">{icon}</div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-ink/50">{value}</div>
      </div>
    </Link>
  );
}
