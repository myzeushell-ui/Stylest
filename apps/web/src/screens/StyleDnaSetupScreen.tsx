import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfile } from '../store/profile';
import { useWardrobe } from '../store/wardrobe';
import { useFitness } from '../store/fitness';
import { useStyleDna } from '../store/styledna';
import { buildDna, type DnaQuestionnaire } from '../lib/buildDna';
import { Card, PageHeader, Section, ChipGroup } from '../components/ui';
import { t } from '../i18n';

// Опросник-онбординг — ЯВНЫЙ источник данных для Style DNA (источник [О]).
// Базовые поля (цветотип/фигура/цели/lifestyle) уже в профиле; здесь добиваем
// бьюти/осанку. Остальное Style DNA берёт из модулей и правил (см. buildDna).
const SKIN_CONCERNS = ['тусклость', 'покраснения', 'высыпания', 'пигментация', 'сухость', 'жирный блеск', 'поры'];
const HAIR_GOALS = ['блеск', 'объём', 'рост', 'меньше ломкости', 'убрать пушистость'];
const ROUTINE_GOALS = ['простой уход', 'anti-age', 'ровный тон', 'здоровье кожи'];

export function StyleDnaSetupScreen() {
  const profile = useProfile((s) => s.profile);
  const onboarded = useProfile((s) => s.onboarded);
  const wardrobe = useWardrobe((s) => s.items);
  const fitnessGoals = useFitness((s) => s.goals);
  const setAll = useStyleDna((s) => s.setAll);
  const navigate = useNavigate();

  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [skinSensitivity, setSkinSensitivity] = useState<DnaQuestionnaire['skinSensitivity']>('средняя');
  const [hairCondition, setHairCondition] = useState('нормальное');
  const [hairGoals, setHairGoals] = useState<string[]>([]);
  const [beautyRoutineGoals, setBeautyRoutineGoals] = useState<string[]>([]);
  const [postureNotes, setPostureNotes] = useState('');

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = () => {
    const dna = buildDna({
      profile,
      wardrobe,
      fitnessGoals,
      questionnaire: { skinConcerns, skinSensitivity, hairCondition, hairGoals, beautyRoutineGoals, postureNotes },
    });
    setAll(dna);
    navigate('/styledna/results');
  };

  return (
    <div>
      <PageHeader title={t.styledna.setup} subtitle="3 шага. Соединим профиль, гардероб и цели в одну карту." back="/styledna" />

      {!onboarded && (
        <Card className="mb-4 bg-amber-50 border-amber-200">
          <p className="text-sm">
            Сначала лучше заполнить{' '}
            <Link to="/profile" className="underline font-medium">
              профиль себя
            </Link>{' '}
            — цветотип, фигуру, цели и бюджет. От них зависит точность карты.
          </p>
        </Card>
      )}

      <Section title="Кожа">
        <Card className="space-y-3">
          <div>
            <label className="label">Что беспокоит (источник: опросник)</label>
            <ChipGroup options={SKIN_CONCERNS} selected={skinConcerns} onToggle={(v) => toggle(skinConcerns, setSkinConcerns, v)} />
          </div>
          <div>
            <label className="label">Чувствительность кожи</label>
            <select className="input" value={skinSensitivity} onChange={(e) => setSkinSensitivity(e.target.value as DnaQuestionnaire['skinSensitivity'])}>
              <option value="низкая">низкая</option>
              <option value="средняя">средняя</option>
              <option value="высокая">высокая</option>
            </select>
          </div>
          <div>
            <label className="label">Цели ухода</label>
            <ChipGroup options={ROUTINE_GOALS} selected={beautyRoutineGoals} onToggle={(v) => toggle(beautyRoutineGoals, setBeautyRoutineGoals, v)} />
          </div>
        </Card>
      </Section>

      <Section title="Волосы">
        <Card className="space-y-3">
          <div>
            <label className="label">Состояние волос</label>
            <input className="input" value={hairCondition} onChange={(e) => setHairCondition(e.target.value)} />
          </div>
          <div>
            <label className="label">Цели по волосам</label>
            <ChipGroup options={HAIR_GOALS} selected={hairGoals} onToggle={(v) => toggle(hairGoals, setHairGoals, v)} />
          </div>
        </Card>
      </Section>

      <Section title="Осанка / тело">
        <Card>
          <label className="label">Заметки об осанке (необязательно)</label>
          <input className="input" value={postureNotes} onChange={(e) => setPostureNotes(e.target.value)} placeholder="например: сутулюсь за компьютером" />
        </Card>
      </Section>

      <button className="btn-primary w-full" onClick={submit}>
        Собрать Style DNA
      </button>
      <p className="text-[11px] text-ink/40 text-center mt-2">
        Цвета и силуэты выводятся из цветотипа и фигуры (теория стиля). Анализ фото на старте — мок.
      </p>
    </div>
  );
}
