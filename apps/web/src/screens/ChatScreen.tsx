import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AI_SUGGESTED_QUESTIONS } from '@obraz/shared';
import { useChat } from '../store/chat';
import { useProfile } from '../store/profile';
import { useWardrobe } from '../store/wardrobe';
import { useStyleDna } from '../store/styledna';
import { api, type AIChatContext } from '../lib/api';
import { useVoice } from '../lib/useVoice';
import { PageHeader } from '../components/ui';
import { t } from '../i18n';

export function ChatScreen() {
  const { messages, push } = useChat();
  const { profile } = useProfile();
  const wardrobe = useWardrobe((s) => s.items);
  const styleDNA = useStyleDna((s) => s.styleDNA);
  const [input, setInput] = useState('');
  const [voiceMode, setVoiceMode] = useState(false); // авто-озвучка ответов
  const endRef = useRef<HTMLDivElement>(null);
  const voice = useVoice();

  // Контекст пользователя для персонализации ответов (и объяснений «почему»).
  const context: AIChatContext = {
    displayName: profile.displayName || undefined,
    colorType: profile.colorType,
    bodyType: profile.bodyType,
    skinType: profile.skinType,
    hairType: profile.hairType,
    styleGoals: profile.styleGoals,
    lifestyleTags: profile.lifestyleTags,
    bestColors: styleDNA?.bestColors,
    worstColors: styleDNA?.worstColors,
    styleSummary: styleDNA?.styleSummary,
    wardrobeSize: wardrobe.length,
  };

  const chat = useMutation({
    mutationFn: (text: string) => {
      const history = [...messages, { role: 'user' as const, content: text }];
      return api.aiChat(history, context);
    },
    onSuccess: (res) => {
      push({ role: 'assistant', content: res.content });
      // Если включён голосовой режим — озвучиваем ответ.
      if (voiceMode) voice.speak(res.content);
    },
    onError: () => push({ role: 'assistant', content: 'Не удалось получить ответ. Проверь, что бэкенд запущен.' }),
  });

  const send = (text: string) => {
    const value = text.trim();
    if (!value || chat.isPending) return;
    push({ role: 'user', content: value });
    setInput('');
    chat.mutate(value);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, chat.isPending]);

  // Голосовой ввод: распознаём речь и сразу отправляем.
  const startVoice = () => {
    if (voice.listening) { voice.stopListening(); return; }
    voice.listen((text) => { setVoiceMode(true); send(text); });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <div className="flex items-center justify-between">
        <PageHeader title={t.ai.title} subtitle="Голосом или текстом. Всегда объясняю «почему»." />
        {voice.synthSupported && (
          <button
            onClick={() => { setVoiceMode((v) => !v); if (voice.speaking) voice.stopSpeaking(); }}
            className={`chip ${voiceMode ? 'bg-accent text-ink border-accent' : 'chip-off'} shrink-0`}
            title="Озвучивать ответы голосом"
          >
            {voiceMode ? '🔊 Голос вкл' : '🔇 Голос выкл'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {messages.length === 0 && (
          <div>
            <p className="text-xs text-ink/50 mb-2">{t.ai.suggested}</p>
            <div className="flex flex-wrap gap-2">
              {AI_SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} className="chip-off text-left" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap text-left ${
                m.role === 'user' ? 'bg-ink text-white' : 'bg-white border border-black/5'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {chat.isPending && <div className="text-sm text-ink/40">{t.ai.thinking}</div>}
        {voice.speaking && <div className="text-sm text-accent">🔊 Озвучиваю…</div>}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 pt-2">
        {voice.recognitionSupported && (
          <button
            onClick={startVoice}
            className={`btn shrink-0 ${voice.listening ? 'bg-rose-500 text-white animate-pulse' : 'bg-accent text-ink'}`}
            title="Сказать голосом"
          >
            {voice.listening ? '⏺' : '🎤'}
          </button>
        )}
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder={voice.listening ? 'Слушаю…' : t.ai.placeholder}
        />
        <button className="btn-primary" onClick={() => send(input)} disabled={chat.isPending}>
          {t.common.ask}
        </button>
      </div>
    </div>
  );
}
