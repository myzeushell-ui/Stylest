import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StyleDNA, BeautyDNA, BodyDNA } from '@obraz/shared';

// Сигнал обратной связи: лайки/дизлайки образов и факт покупки со временем
// уточняют карту (Style DNA «живёт»).
export interface Feedback {
  liked: string[]; // ключи характеристик, которые зашли (напр. цвет/силуэт)
  disliked: string[];
  purchasedItemTypes: string[];
}

interface StyleDnaState {
  styleDNA?: StyleDNA;
  beautyDNA?: BeautyDNA;
  bodyDNA?: BodyDNA;
  feedback: Feedback;
  setAll: (dna: { styleDNA: StyleDNA; beautyDNA: BeautyDNA; bodyDNA: BodyDNA }) => void;
  like: (key: string) => void;
  dislike: (key: string) => void;
  registerPurchase: (itemType: string) => void;
  reset: () => void;
}

export const useStyleDna = create<StyleDnaState>()(
  persist(
    (set) => ({
      styleDNA: undefined,
      beautyDNA: undefined,
      bodyDNA: undefined,
      feedback: { liked: [], disliked: [], purchasedItemTypes: [] },
      setAll: (dna) => set({ ...dna }),
      like: (key) => set((s) => ({ feedback: { ...s.feedback, liked: [...new Set([...s.feedback.liked, key])] } })),
      dislike: (key) => set((s) => ({ feedback: { ...s.feedback, disliked: [...new Set([...s.feedback.disliked, key])] } })),
      registerPurchase: (itemType) =>
        set((s) => ({ feedback: { ...s.feedback, purchasedItemTypes: [...s.feedback.purchasedItemTypes, itemType] } })),
      reset: () =>
        set({ styleDNA: undefined, beautyDNA: undefined, bodyDNA: undefined, feedback: { liked: [], disliked: [], purchasedItemTypes: [] } }),
    }),
    { name: 'obraz.styledna' },
  ),
);
