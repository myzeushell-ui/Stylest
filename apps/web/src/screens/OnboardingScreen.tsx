import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  COLOR_TYPES, BODY_TYPES, SKIN_TYPES, HAIR_TYPES, CLOTHING_SIZES,
  GENDER_PRESENTATIONS, STYLE_GOALS, LIFESTYLE_TAGS,
  type ColorType, type BodyType, type SkinType, type HairType,
  type ClothingSize, type GenderPresentation, type StyleGoal, type LifestyleTag,
} from '@obraz/shared';
import { useProfile } from '../store/profile';
import { useVoice } from '../lib/useVoice';
import { ChipGroup } from '../components/ui';

// Онбординг-квиз при первом запуске: знакомство + персонализация.
// Пошаговый, с прогрессом. Голосовой ввод имени поддержан.
export function OnboardingScreen() {
  const update = useProfile((s) => s.update);
  const navigate = useNavigate();
  const voice = useVoice();
  const [step, setStep] = useState(0);

  // Локальное состояние ответов.
  const [name, setName] = useState('');
  const [gender, setGender] = useState<GenderPresentation>('нейтральная');
  const [height, setHeight] = useState(170);
  const [size, setSize] = useState<ClothingSize>('M');
  const [bodyType, setBodyType] = useState<BodyType>('не знаю');
  const [colorType, setColorType] = useState<ColorType>('не знаю');
  const [skinType, setSkinType] = useState<SkinType>('нормальная');
  const [hairType, setHairType] = useState<HairType>('прямые');
  const [budget, setBudget] = useState(5000);
  const [goals, setGoals] = useState<StyleGoal[]>([]);
  const [lifestyle, setLifestyle] = useState<LifestyleTag[]>([]);

  const steps = [
    { title: 'Давай познакомимся', emoji: '👋' },
    { title: 'Параметры фигуры', emoji: '📐' },
    { title: 'Внешность', emoji: '🎨' },
    { title: 'Бюджет и цели', emoji: '🎯' },
    { title: 'Образ жизни', emoji: '🌿' },
  ];
  const last = steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const finish = () => {
    update({
      displayName: name.trim() || 'Друг',
      genderPresentation: gender,
      heightCm: height,
      clothingSize: size,
      bodyType, colorType, skinType, hairType,
      monthlyBudgetRub: budget,
      styleGoals: goals,
      lifestyleTags: lifestyle,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink to-[#1e293b] text-white px-5 pt-10 pb-28 flex flex-col">
      {/* Прогресс */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>Шаг {step + 1} из {steps.length}</span>
          <button onClick={finish} className="underline">Пропустить</button>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1">
        <div className="text-5xl mb-3">{steps[step].emoji}</div>
        <h1 className="text-3xl font-bold mb-6 tracking-tight">{steps[step].title}</h1>

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-white/60">Как тебя зовут?</label>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 outline-none focus:border-accent placeholder-white/30"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя"
                />
                {voice.recognitionSupported && (
                  <button
                    onClick={() => voice.listen((t) => setName(t.replace(/[.!?]$/, '')))}
                    className={`rounded-2xl px-4 ${voice.listening ? 'bg-rose-500' : 'bg-accent text-ink'}`}
                    title="Сказать голосом"
                  >
                    🎤
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60">Как подавать рекомендации?</label>
              <div className="mt-2">
                <ChipGroupDark options={GENDER_PRESENTATIONS} selected={[gender]} onToggle={(v) => setGender(v)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-white/60">Рост: {height} см</label>
              <input type="range" min={140} max={210} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full mt-2 accent-accent" />
            </div>
            <div>
              <label className="text-sm text-white/60">Размер одежды</label>
              <div className="mt-2"><ChipGroupDark options={CLOTHING_SIZES} selected={[size]} onToggle={(v) => setSize(v)} /></div>
            </div>
            <div>
              <label className="text-sm text-white/60">Тип фигуры</label>
              <div className="mt-2"><ChipGroupDark options={BODY_TYPES} selected={[bodyType]} onToggle={(v) => setBodyType(v)} /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <DarkSelectGroup label="Цветотип" options={COLOR_TYPES} value={colorType} onChange={setColorType} />
            <DarkSelectGroup label="Тип кожи" options={SKIN_TYPES} value={skinType} onChange={setSkinType} />
            <DarkSelectGroup label="Тип волос" options={HAIR_TYPES} value={hairType} onChange={setHairType} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-white/60">Бюджет на одежду в месяц: {budget.toLocaleString('ru-RU')} ₽</label>
              <input type="range" min={0} max={50000} step={1000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-2 accent-accent" />
            </div>
            <div>
              <label className="text-sm text-white/60">Чего хочешь от стиля? (можно несколько)</label>
              <div className="mt-2"><ChipGroupDark options={STYLE_GOALS} selected={goals} onToggle={(v) => toggle(goals, setGoals, v)} multi /></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-white/60">Где проводишь время? (можно несколько)</label>
              <div className="mt-2"><ChipGroupDark options={LIFESTYLE_TAGS} selected={lifestyle} onToggle={(v) => toggle(lifestyle, setLifestyle, v)} multi /></div>
            </div>
            <p className="text-sm text-white/50">Готово! Дальше соберём твою карту Style DNA и подберём образы — с объяснением «почему».</p>
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button className="rounded-2xl bg-white/10 px-5 py-3 font-medium" onClick={() => setStep((s) => s - 1)}>
            Назад
          </button>
        )}
        {step < last ? (
          <button className="flex-1 rounded-2xl bg-accent text-ink px-5 py-3 font-semibold" onClick={() => setStep((s) => s + 1)}>
            Далее
          </button>
        ) : (
          <button className="flex-1 rounded-2xl bg-accent text-ink px-5 py-3 font-semibold" onClick={finish}>
            Начать пользоваться ✨
          </button>
        )}
      </div>
    </div>
  );

  function toggle<T>(list: T[], set: (v: T[]) => void, v: T) {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }
}

// Тёмные чипсы под градиентный фон онбординга.
function ChipGroupDark<T extends string>({
  options, selected, onToggle, multi = false,
}: { options: readonly T[]; selected: T[]; onToggle: (v: T) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              on ? 'bg-accent text-ink border-accent font-medium' : 'bg-white/5 text-white/70 border-white/15'
            }`}
          >
            {multi && on ? '✓ ' : ''}{opt}
          </button>
        );
      })}
    </div>
  );
}

function DarkSelectGroup<T extends string>({
  label, options, value, onChange,
}: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      <label className="text-sm text-white/60">{label}</label>
      <div className="mt-2">
        <ChipGroupDark options={options} selected={[value]} onToggle={onChange} />
      </div>
    </div>
  );
}

// Реэкспорт общего ChipGroup на случай, если понадобится светлый вариант.
export { ChipGroup };
