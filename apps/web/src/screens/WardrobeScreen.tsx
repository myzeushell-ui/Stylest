import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { WARDROBE_CATEGORIES, SEASONS, type WardrobeCategory, type Season } from '@obraz/shared';
import { useWardrobe } from '../store/wardrobe';
import { api } from '../lib/api';
import { costPerWear } from '../lib/analytics';
import { Card, PageHeader, Section, EmptyState, ChipGroup } from '../components/ui';
import { t } from '../i18n';

export function WardrobeScreen() {
  const { items, add, remove, wearOnce } = useWardrobe();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader title={t.wardrobe.title} subtitle="Цифровой шкаф: добавляй вещи и собирай образы." />

      <div className="flex gap-2 mb-4">
        <button className="btn-primary flex-1" onClick={() => setOpen((v) => !v)}>
          {open ? t.common.cancel : `+ ${t.wardrobe.addItem}`}
        </button>
        <Link to="/wardrobe/analytics" className="btn-ghost flex-1 text-center">
          {t.wardrobe.analytics}
        </Link>
      </div>

      {open && <AddItemForm onAdd={(d) => { add(d); setOpen(false); }} />}

      <Section title={`Вещей: ${items.length}`}>
        {items.length === 0 ? (
          <EmptyState text="Гардероб пуст. Добавь первую вещь — и появится аналитика." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="flex gap-3 items-center">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-black/5 grid place-items-center text-2xl">👕</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{item.title}</div>
                  <div className="text-xs text-ink/50">
                    {item.category} · {item.color} · {item.seasons.join(', ')}
                  </div>
                  <div className="text-xs text-ink/50">
                    {item.wearCount} {t.wardrobe.wears}
                    {costPerWear(item) != null && ` · ${t.wardrobe.costPerWear}: ${costPerWear(item)} ₽`}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="btn-ghost text-xs px-2 py-1" onClick={() => wearOnce(item.id)}>
                    Надел +1
                  </button>
                  <TryOnButton title={item.title} photoUrl={item.photoUrl} />
                  <button className="text-xs text-rose-500" onClick={() => remove(item.id)}>
                    {t.common.delete}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function TryOnButton({ title, photoUrl }: { title: string; photoUrl?: string }) {
  const m = useMutation({
    mutationFn: () => api.tryOn({ itemTitle: title, itemPhotoUrl: photoUrl }),
  });
  return (
    <button className="btn-ghost text-xs px-2 py-1" onClick={() => m.mutate()} disabled={m.isPending}>
      {m.isPending ? '...' : t.wardrobe.tryOn}
      {m.data && <span className="block text-[10px] text-ink/40">демо</span>}
    </button>
  );
}

function AddItemForm({ onAdd }: { onAdd: (d: AddData) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WardrobeCategory>('верх');
  const [color, setColor] = useState('чёрный');
  const [seasons, setSeasons] = useState<Season[]>(['всесезон']);
  const [priceRub, setPriceRub] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Card className="mb-4 space-y-3">
      <div>
        <label className="label">Название</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Белая рубашка" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Категория</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as WardrobeCategory)}>
            {WARDROBE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Цвет</label>
          <input className="input" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Сезон</label>
        <ChipGroup
          options={SEASONS}
          selected={seasons}
          onToggle={(s) => setSeasons((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Цена, ₽ (для cost-per-wear)</label>
          <input className="input" type="number" value={priceRub} onChange={(e) => setPriceRub(e.target.value)} />
        </div>
        <div>
          <label className="label">Фото</label>
          <input className="input" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>
      <button
        className="btn-primary w-full"
        disabled={!title.trim()}
        onClick={() =>
          onAdd({
            title: title.trim(),
            category,
            color,
            seasons,
            priceRub: priceRub ? Number(priceRub) : undefined,
            photoUrl,
          })
        }
      >
        {t.common.save}
      </button>
    </Card>
  );
}

interface AddData {
  title: string;
  category: WardrobeCategory;
  color: string;
  seasons: Season[];
  priceRub?: number;
  photoUrl?: string;
}
