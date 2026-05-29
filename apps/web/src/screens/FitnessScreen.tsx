import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFitness } from '../store/fitness';
import { useProfile } from '../store/profile';
import { api } from '../lib/api';
import { now } from '../lib/uid';
import { Card, PageHeader, Section, EmptyState, Disclaimer } from '../components/ui';
import type { FitnessGoal } from '@obraz/shared';
import { t } from '../i18n';

const GOAL_KINDS: FitnessGoal['kind'][] = ['похудение', 'набор массы', 'тонус', 'выносливость', 'осанка', 'общее здоровье'];

export function FitnessScreen() {
  const { goals, logs, addGoal, toggleGoal, removeGoal, addLog } = useFitness();
  const profile = useProfile((s) => s.profile);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalKind, setGoalKind] = useState<FitnessGoal['kind']>('тонус');
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState(3);

  // AI-подбор упражнений: формируем вопрос из целей и шлём в общий AI-чат-эндпоинт.
  const exercises = useMutation({
    mutationFn: () => {
      const goalText = goals.map((g) => g.title).join(', ') || goalKind;
      const q = `Подбери короткую программу упражнений под цели: ${goalText}. Кратко, с объяснением почему.`;
      return api.aiChat([{ role: 'user', content: q }], {
        bodyType: profile.bodyType,
        styleGoals: profile.styleGoals,
        lifestyleTags: profile.lifestyleTags,
      });
    },
  });

  return (
    <div>
      <PageHeader title={t.fitness.title} subtitle="Цели, активность и AI-подбор упражнений." />

      <Section title={t.fitness.goals}>
        <Card className="space-y-2">
          <input className="input" placeholder="Например: подтянуть осанку" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
          <select className="input" value={goalKind} onChange={(e) => setGoalKind(e.target.value as FitnessGoal['kind'])}>
            {GOAL_KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button
            className="btn-primary w-full"
            disabled={!goalTitle.trim()}
            onClick={() => {
              addGoal({ title: goalTitle.trim(), kind: goalKind });
              setGoalTitle('');
            }}
          >
            {t.common.add}
          </button>
        </Card>
        <div className="mt-3 space-y-2">
          {goals.length === 0 ? (
            <EmptyState text="Поставь цель — она попадёт в Body DNA." />
          ) : (
            goals.map((g) => (
              <Card key={g.id} className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-left" onClick={() => toggleGoal(g.id)}>
                  <span>{g.done ? '✅' : '⬜️'}</span>
                  <span className={g.done ? 'line-through text-ink/40' : ''}>
                    {g.title} <span className="text-xs text-ink/40">({g.kind})</span>
                  </span>
                </button>
                <button className="text-rose-500 text-xs" onClick={() => removeGoal(g.id)}>✕</button>
              </Card>
            ))
          )}
        </div>
      </Section>

      <Section title={t.fitness.activity}>
        <Card className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="бег / силовая / йога" value={activity} onChange={(e) => setActivity(e.target.value)} />
            <input className="input" type="number" placeholder="мин" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <label className="label">Нагрузка: {intensity}/5</label>
          <input type="range" min={1} max={5} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
          <button
            className="btn-primary w-full"
            disabled={!activity.trim()}
            onClick={() => {
              addLog({ date: now(), activity: activity.trim(), durationMin: Number(duration) || 0, intensity });
              setActivity('');
            }}
          >
            Записать тренировку
          </button>
          <div className="text-xs text-ink/50">Всего тренировок: {logs.length}</div>
        </Card>
      </Section>

      <Section title={t.fitness.exercises}>
        <Card>
          <button className="btn-accent w-full" onClick={() => exercises.mutate()} disabled={exercises.isPending}>
            {exercises.isPending ? t.common.loading : 'Подобрать упражнения'}
          </button>
          {exercises.data && <p className="text-sm whitespace-pre-wrap mt-3">{exercises.data.content}</p>}
          <p className="text-[11px] text-ink/40 mt-2">
            ДОПУЩЕНИЕ: открытая база упражнений и каталог залов — заглушки для v2.
          </p>
        </Card>
      </Section>

      <Disclaimer text="Перед началом новых нагрузок при проблемах со здоровьем проконсультируйтесь с врачом." />
    </div>
  );
}
