import {
  COLOR_TYPES,
  BODY_TYPES,
  SKIN_TYPES,
  HAIR_TYPES,
  STYLE_GOALS,
  LIFESTYLE_TAGS,
  CLOTHING_SIZES,
  GENDER_PRESENTATIONS,
} from '@obraz/shared';
import { useProfile } from '../store/profile';
import { PageHeader, Card, Section, ChipGroup } from '../components/ui';
import { t } from '../i18n';

// «Профиль себя» — единый центр данных, на нём строятся все модули и Style DNA.
export function ProfileScreen() {
  const { profile, update } = useProfile();

  return (
    <div>
      <PageHeader title={t.profile.title} subtitle="Это ядро приложения — на нём строятся все рекомендации." />

      <Section title="Основное">
        <Card className="space-y-3">
          <div>
            <label className="label">Как тебя зовут</label>
            <input
              className="input"
              value={profile.displayName}
              onChange={(e) => update({ displayName: e.target.value })}
              placeholder="Имя"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label={t.profile.colorType} value={profile.colorType} options={COLOR_TYPES} onChange={(v) => update({ colorType: v })} />
            <Select label={t.profile.bodyType} value={profile.bodyType} options={BODY_TYPES} onChange={(v) => update({ bodyType: v })} />
            <Select label={t.profile.skinType} value={profile.skinType} options={SKIN_TYPES} onChange={(v) => update({ skinType: v })} />
            <Select label={t.profile.hairType} value={profile.hairType} options={HAIR_TYPES} onChange={(v) => update({ hairType: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Размер одежды" value={profile.clothingSize} options={CLOTHING_SIZES} onChange={(v) => update({ clothingSize: v })} />
            <Select label="Подача" value={profile.genderPresentation} options={GENDER_PRESENTATIONS} onChange={(v) => update({ genderPresentation: v })} />
          </div>
          <div>
            <label className="label">Рост: {profile.heightCm} см</label>
            <input
              type="range"
              min={140}
              max={210}
              value={profile.heightCm}
              onChange={(e) => update({ heightCm: Number(e.target.value) })}
              className="w-full accent-ink"
            />
          </div>
          <div>
            <label className="label">{t.profile.budget}</label>
            <input
              className="input"
              type="number"
              min={0}
              value={profile.monthlyBudgetRub}
              onChange={(e) => update({ monthlyBudgetRub: Number(e.target.value) })}
            />
          </div>
        </Card>
      </Section>

      <Section title={t.profile.goals}>
        <Card>
          <ChipGroup options={STYLE_GOALS} selected={profile.styleGoals} onToggle={(v) => toggle('styleGoals', v)} />
        </Card>
      </Section>

      <Section title={t.profile.lifestyle}>
        <Card>
          <ChipGroup options={LIFESTYLE_TAGS} selected={profile.lifestyleTags} onToggle={(v) => toggle('lifestyleTags', v)} />
        </Card>
      </Section>

      <p className="text-xs text-ink/40 text-center mt-2">Данные сохраняются на устройстве (офлайн). Изменения применяются сразу.</p>
    </div>
  );

  // Переключение значения в мультивыборе.
  function toggle(field: 'styleGoals' | 'lifestyleTags', value: string) {
    const current = profile[field] as string[];
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
    update({ [field]: next } as never);
  }
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
