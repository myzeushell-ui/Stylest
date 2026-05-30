import { useRef } from 'react';

// Захват фото вещи: на телефоне открывает камеру (capture="environment"),
// на десктопе — выбор файла. Возвращает dataURL (хранится локально, офлайн).
export function PhotoCapture({
  value,
  onChange,
  label = 'Фото вещи',
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const read = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex items-center gap-3">
        {/* Превью */}
        <div className="w-20 h-20 rounded-2xl bg-black/5 overflow-hidden grid place-items-center shrink-0 border border-black/5">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl opacity-40">👕</span>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <button type="button" className="btn-accent w-full" onClick={() => cameraRef.current?.click()}>
            📷 Сфотографировать
          </button>
          <button type="button" className="btn-ghost w-full" onClick={() => galleryRef.current?.click()}>
            🖼 Выбрать из галереи
          </button>
          {value && (
            <button type="button" className="text-xs text-rose-500" onClick={() => onChange(undefined)}>
              Убрать фото
            </button>
          )}
        </div>
      </div>

      {/* Камера телефона */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => read(e.target.files?.[0])}
      />
      {/* Галерея / файлы */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => read(e.target.files?.[0])}
      />
    </div>
  );
}
