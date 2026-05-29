import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WardrobeItem } from '@obraz/shared';
import { now, uid } from '../lib/uid';
import { LOCAL_USER_ID } from './profile';

interface WardrobeState {
  items: WardrobeItem[];
  add: (data: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'wearCount'> & { wearCount?: number }) => void;
  remove: (id: string) => void;
  wearOnce: (id: string) => void;
}

export const useWardrobe = create<WardrobeState>()(
  persist(
    (set) => ({
      items: [],
      add: (data) =>
        set((s) => ({
          items: [
            { ...data, wearCount: data.wearCount ?? 0, id: uid(), userId: LOCAL_USER_ID, createdAt: now(), updatedAt: now() },
            ...s.items,
          ],
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      wearOnce: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, wearCount: i.wearCount + 1, updatedAt: now() } : i)),
        })),
    }),
    { name: 'obraz.wardrobe' },
  ),
);
