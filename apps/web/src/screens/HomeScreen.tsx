import { Link } from 'react-router-dom';
import { useProfile } from '../store/profile';
import { useWardrobe } from '../store/wardrobe';
import { useBeauty } from '../store/beauty';
import { useFitness } from '../store/fitness';
import { useStyleDna } from '../store/styledna';
import { Card, PageHeader, Section } from '../components/ui';
import { t } from '../i18n';

export function HomeScreen() {
  const { profile, onboarded } = useProfile();
  const wardrobe = useWardrobe((s) => s.items);
  const beauty = useBeauty((s) => s.entries);
  const goals = useFitness((s) => s.goals);
  const styleDNA = useStyleDna((s) => s.styleDNA);

  const hello = profile.displayName ? `Привет, ${profile.displayName}!` : 'Привет!';

  return (
    <div>
      <PageHeader title={hello} subtitle={t.app.tagline} />

      {!onboarded && (
        <Card className="mb-6 bg-ink text-white">
          <p className="font-semibold mb-1">Начни с профиля себя</p>
          <p className="text-sm text-white/70 mb-3">Цветотип, фигура, цели и бюджет — основа всех рекомендаций.</p>
          <Link to="/profile" className="btn-accent">Заполнить профиль</Link>
        </Card>
      )}

      <Section title="Модули">
        <div className="grid grid-cols-2 gap-3">
          <Tile to="/wardrobe" icon="👕" title={t.nav.wardrobe} value={`${wardrobe.length} вещей`} />
          <Tile to="/beauty" icon="✨" title={t.nav.beauty} value={`${beauty.length} записей`} />
          <Tile to="/fitness" icon="🏃" title={t.nav.fitness} value={`${goals.length} целей`} />
          <Tile to="/styledna" icon="🧬" title={t.nav.styledna} value={styleDNA ? 'готова' : 'собрать'} />
        </div>
      </Section>

      <Section title="AI-стилист">
        <Card className="bg-accent/20 border-accent/30">
          <p className="font-semibold mb-1">{t.ai.title}</p>
          <p className="text-sm text-ink/70 mb-3">Подберу образ под повод и объясню «почему». Спрошу о цветах, силуэтах, уходе.</p>
          <Link to="/chat" className="btn-primary">Открыть чат</Link>
        </Card>
      </Section>

      {styleDNA && (
        <Section title={t.styledna.threeWords}>
          <Card>
            <p className="text-lg font-semibold">{styleDNA.styleSummary}</p>
            <Link to="/styledna/results" className="text-sm text-ink/60 underline mt-1 inline-block">
              Открыть Style DNA →
            </Link>
          </Card>
        </Section>
      )}
    </div>
  );
}

function Tile({ to, icon, title, value }: { to: string; icon: string; title: string; value: string }) {
  return (
    <Link to={to}>
      <Card className="h-full">
        <div className="text-2xl mb-1">{icon}</div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-ink/50">{value}</div>
      </Card>
    </Link>
  );
}
