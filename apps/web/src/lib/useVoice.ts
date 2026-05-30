// Голосовой ввод/вывод через встроенный в браузер Web Speech API.
// Полностью бесплатно, без внешних сервисов (важно для РФ): распознавание речи
// (SpeechRecognition) и озвучка ответов (speechSynthesis) работают локально в
// браузере. На устройствах/браузерах без поддержки — мягко деградирует.
import { useCallback, useEffect, useRef, useState } from 'react';

// Типы Web Speech API не входят в стандартный lib.dom — объявляем минимально.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoice() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const recognitionSupported = typeof window !== 'undefined' && getRecognitionCtor() !== null;
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Запуск распознавания: возвращает распознанный текст в onResult.
  const listen = useCallback((onResult: (text: string) => void) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'ru-RU';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript ?? '';
      if (text) onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, []);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  // Озвучка текста голосом (по-русски).
  const speak = useCallback(
    (text: string) => {
      if (!synthSupported) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU';
      u.rate = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [synthSupported],
  );

  const stopSpeaking = useCallback(() => {
    if (synthSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [synthSupported]);

  useEffect(() => () => stopSpeaking(), [stopSpeaking]);

  return { listening, speaking, listen, stopListening, speak, stopSpeaking, recognitionSupported, synthSupported };
}
