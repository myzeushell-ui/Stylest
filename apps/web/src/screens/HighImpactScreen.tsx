import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  computePurchaseImpact,
  type ScoreCandidate,
  type ScoreContext,
  type MarketplaceItem,
} from '@obraz/shared';
import { useProfile } from '../store/profile';
import { useWardrobe } from '../store/wardrobe';
import { useStyleDna } from '../store/styledna';
import { api } from '../lib/api';
import { Card, PageHeader, EmptyState, ScoreBar } from '../components/ui';
import { t } from '../i18n';

// Покупки с максимальным эффектом: берём мок-каталог маркетплейса, прогоняем
// каждую вещь через PersonalRecommendationEngine и сортируем по finalScore.
export function HighImpactScreen() {
  const profile = useProfile((s) => s.profile);
  const wardrobe = useWardrobe((s) => s.items);
  const { styleDNA, registerPurchase } = useStyleDna();

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace', 'all'],
    queryFn: () => api.marketplaceSearch(''),
  });

  const ctx: ScoreContext = { profile, styleDNA, wardrobe };

  const scored = (data?.items ?? [])
    .map((item: MarketplaceItem) => {
      const candidate: ScoreCandidate = {
        itemType: 'clothing',
        priceRub: item.priceRub,
        color: item.color,
        category: item.category,
        lifestyleTags: profile.lifestyleTags,
      };
      return { item, score: computePurchaseImpact(candidate, ctx) };
    })
    .sort((a, b) => b.score.finalScore - a.score.finalScore);

  return (
    <div>
      <PageHeader title={t.styledna.highImpact} subtitle="Один движок, прозрачные формулы. Каждая покупка с объяснением." back="/styledna" />

      {!styleDNA && (
        <Card className="mb-4 bg-amber-50 border-amber-200 text-sm">
          Совет точнее, если сначала{' '}
          <Link to="/styledna/setup" className="underline font-medium">
            собрать Style DNA
          </Link>
          .
        </Card>
      )}

      {isLoading ? (
        <EmptyState text={t.common.loading} />
      ) : (
        <div className="space-y-3">
          {scored.map(({ item, score }) => (
            <Card key={item.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-ink/50">{item.priceRub.toLocaleString('ru-RU')} ₽ · {item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{score.finalScore}</div>
                  <div className="text-[10px] text-ink/40">из 100</div>
                </div>
              </div>

              <ScoreBar label="Совместимость с палитрой" value={score.compatibilityScore} />
              <ScoreBar label="Влияние на гардероб" value={score.wardrobeImpactScore} />
              <ScoreBar label="Вписывается в бюджет" value={score.budgetFitScore} />
              <ScoreBar label="Под образ жизни" value={score.lifestyleFitScore} />

              <p className="text-sm bg-soft rounded-xl p-2 mt-2">{score.aiExplanation}</p>

              <div className="flex gap-2 mt-2">
                <a href={item.url} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-center text-xs">
                  Открыть в магазине
                </a>
                <button className="btn-primary flex-1 text-xs" onClick={() => registerPurchase('clothing')}>
                  Отметить покупку
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <p className="text-[11px] text-ink/40 mt-3">
        ДОПУЩЕНИЕ: каталог — мок (MockMarketplaceProvider). Ссылки ведут на поиск в реальных магазинах.
      </p>
    </div>
  );
}
