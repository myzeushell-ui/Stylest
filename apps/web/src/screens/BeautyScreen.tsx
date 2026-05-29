import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useBeauty } from '../store/beauty';
import { useProfile } from '../store/profile';
import { api } from '../lib/api';
import { now } from '../lib/uid';
import { Card, PageHeader, Section, EmptyState, Disclaimer } from '../components/ui';
import type { SkinAnalysisResult, BeautyProduct } from '@obraz/shared';
import { t } from '../i18n';

export function BeautyScreen() {
  const { entries, products, addEntry, removeEntry, addProduct, removeProduct, toggleFinished } = useBeauty();
  const skinType = useProfile((s) => s.profile.skinType);
  const [skinScore, setSkinScore] = useState(3);
  const [hairScore, setHairScore] = useState(3);
  const [notes, setNotes] = useState('');

  const analyze = useMutation<SkinAnalysisResult>({
    mutationFn: () => api.analyzeSkin({ knownSkinType: skinType }),
  });

  return (
    <div>
      <PageHeader title={t.beauty.title} subtitle="Дневник кожи и волос + уход. Не диагностика." />

      <Section title={t.beauty.diary}>
        <Card className="space-y-3">
          <Range label={t.beauty.skinScore} value={skinScore} onChange={setSkinScore} />
          <Range label={t.beauty.hairScore} value={hairScore} onChange={setHairScore} />
          <textarea
            className="input"
            rows={2}
            placeholder="Заметки: сон, стресс, новое средство…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            className="btn-primary w-full"
            onClick={() => {
              addEntry({ date: now(), skinScore, hairScore, notes: notes || undefined });
              setNotes('');
            }}
          >
            Записать состояние
          </button>
        </Card>
        <div className="mt-3 space-y-2">
          {entries.length === 0 ? (
            <EmptyState text="Дневник пуст. Записывай состояние — увидишь динамику." />
          ) : (
            entries.slice(0, 7).map((e) => (
              <Card key={e.id} className="flex justify-between text-sm">
                <span>{new Date(e.date).toLocaleDateString('ru-RU')}</span>
                <span>
                  кожа {e.skinScore}/5 · волосы {e.hairScore}/5
                </span>
                <button className="text-rose-500 text-xs" onClick={() => removeEntry(e.id)}>
                  ✕
                </button>
              </Card>
            ))
          )}
        </div>
      </Section>

      <Section title={t.beauty.analyze}>
        <Card>
          <p className="text-sm text-ink/70 mb-3">
            Демо-анализ кожи (MockSkinAnalysisProvider). Реальный вендор подключается в v2.
          </p>
          <button className="btn-accent w-full" onClick={() => analyze.mutate()} disabled={analyze.isPending}>
            {analyze.isPending ? t.common.loading : 'Запустить демо-анализ'}
          </button>
          {analyze.data && (
            <div className="mt-3 text-sm space-y-1">
              <div>Тип кожи: <b>{analyze.data.skinType}</b></div>
              <div>Увлажнённость: {analyze.data.hydration}/100 · жирность: {analyze.data.oiliness}/100</div>
              <div>Особенности: {analyze.data.concerns.join(', ')}</div>
              <div className="text-emerald-700">Подходит: {analyze.data.recommendedIngredients.join(', ')}</div>
              <div className="text-rose-600">Избегать: {analyze.data.ingredientsToAvoid.join(', ')}</div>
            </div>
          )}
        </Card>
      </Section>

      <Section title={t.beauty.products}>
        <AddProductForm onAdd={addProduct} />
        <div className="mt-3 space-y-2">
          {products.length === 0 ? (
            <EmptyState text="Добавь средства, чтобы вести трекер." />
          ) : (
            products.map((p) => (
              <Card key={p.id} className="flex items-center justify-between">
                <div className={p.finished ? 'line-through text-ink/40' : ''}>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-ink/50">{p.kind}{p.brand ? ` · ${p.brand}` : ''}</div>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="btn-ghost px-2 py-1" onClick={() => toggleFinished(p.id)}>
                    {p.finished ? 'вернуть' : 'закончился'}
                  </button>
                  <button className="text-rose-500" onClick={() => removeProduct(p.id)}>✕</button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Section>

      <Disclaimer />
    </div>
  );
}

function Range({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="label">
        {label}: {value}/5
      </label>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function AddProductForm({ onAdd }: { onAdd: (d: Omit<BeautyProduct, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<BeautyProduct['kind']>('уход за кожей');
  const [ingredients, setIngredients] = useState('');
  return (
    <Card className="space-y-2">
      <input className="input" placeholder="Название средства" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <select className="input" value={kind} onChange={(e) => setKind(e.target.value as BeautyProduct['kind'])}>
          <option>уход за кожей</option>
          <option>уход за волосами</option>
          <option>макияж</option>
          <option>другое</option>
        </select>
        <input className="input" placeholder="ингредиенты через запятую" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      </div>
      <button
        className="btn-primary w-full"
        disabled={!title.trim()}
        onClick={() => {
          onAdd({
            title: title.trim(),
            kind,
            ingredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
            finished: false,
          });
          setTitle('');
          setIngredients('');
        }}
      >
        {t.common.add}
      </button>
    </Card>
  );
}
